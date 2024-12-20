import express from "express";
import mySqlDb from '../mySqlDb';
import {ILocations} from '../types';
import {ResultSetHeader} from 'mysql2';


const locationsRouter = express.Router();


locationsRouter.get("/", async (req, res,next) => {
  try{
    const connection = await mySqlDb.getConnection();
    const [result] = await connection.query('SELECT * FROM locations');
    const locations = result as ILocations[];
    res.status(200).send(locations);
  }catch(err){
    next(err);
  }
});

locationsRouter.get("/:id", async (req,res,next) => {
  const id = req.params.id;
  try{
    const connection = await mySqlDb.getConnection();
    const [result] = await connection.query('SELECT * From locations WHERE id =?', [id]);
    const oneLocation = result as ILocations[];
    if(oneLocation.length === 0){
      res.status(404).send({error:"No locations found"});
    }else{
      res.status(200).send(oneLocation[0]);
    }

  }catch(err){
    next(err);
  }
})

locationsRouter.post("/", async (req, res,next) => {
  try{
    if(!req.body.title){
      res.status(404).send({error:"No title for location"});
    }
    const newLocation = {
      title: req.body.title,
      description: req.body.description,
    }
    const connection = await mySqlDb.getConnection();
    const [result] =  await connection.query('INSERT INTO locations(title, description) VALUES (?, ?)', [newLocation.title, newLocation.description]);

    const resultHeader = result as ResultSetHeader;
    const [resultOneLocation] = await connection.query('SELECT * FROM locations WHERE id = ?', [resultHeader.insertId]);
    const location = resultOneLocation as ILocations[];

    if(location.length === 0){
      res.status(404).send({error:"No locations found"});
    }else{
      res.status(200).send(location[0]);
    }
  }catch(err){
    next(err)
  }
});

locationsRouter.delete("/:id", async (req,res,next)=>{
  const id = req.params.id;
  try {
    const connection = await mySqlDb.getConnection();
    await connection.query('DELETE FROM locations WHERE id = ?', [id]);

    res.status(200).send("Successfully deleted From Locations!");
  }catch (err){
    next(err);
  }
});

locationsRouter.put("/:id", async (req,res,next)=>{
  const id = req.params.id;
  if(!req.body.title){
    res.status(404).send({error:"No title for location"});
  }

  const updateLocation ={
    title: req.body.title,
    description: req.body.description,
  }
  try{
    const connection = await mySqlDb.getConnection();
    await connection.query('UPDATE locations SET title = ?, description = ? WHERE id = ?', [updateLocation.title, updateLocation.description, id]);
    const [result] = await connection.query('SELECT * FROM locations WHERE id = ?', [id]);
    const location = result as ILocations[];
    if(location.length === 0){
      res.status(404).send({error:"No locations found"});
    }else{
      res.status(200).send(location[0]);
    }
  }catch (err){
    next(err);
  }
})
export default locationsRouter;