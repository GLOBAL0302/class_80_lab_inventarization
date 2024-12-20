import express from "express";
import mySqlDb from '../mySqlDb';
import {IItems} from '../types';
import {strict} from 'node:assert';
import {ResultSetHeader} from 'mysql2';
import {imagesUpload} from '../multer';

const itemsRouter = express.Router();

itemsRouter.get("/", async (req, res,next) => {
  try{
    const connection = await mySqlDb.getConnection();
    const [result] = await connection.query('SELECT * FROM items');
    const items = result as IItems[]
    res.status(200).send(items);
  }catch(err){
    next(err)
  }
});

itemsRouter.get("/:id", async (req,res,next)=>{
  const id = req.params.id;
  try{
    const connection = await mySqlDb.getConnection();
    const [result] = await connection.query('SELECT * FROM items WHERE id = ?', [id]);
    const oneItem = result as IItems[];
    if(oneItem.length === 0){
      res.status(404).send({error:"No item found"});
    }else{
      res.status(200).send(oneItem[0]);
    }
  }catch(err){
    next(err);
  }
});

itemsRouter.post("/", imagesUpload.single("image"), async (req, res,next) => {
  if(!req.body.title || !req.body.categories_id || !req.body.locations_id){
    res.status(404).send({error:"required category, location, title"});
  }
  const newItems = {
    categories_id: req.body.categories_id,
    locations_id: req.body.locations_id,
    title: req.body.title,
    description: req.body.description,
    image: req.file ? "image" + req.file.filename : null,
  }
  try{
    const connection = await mySqlDb.getConnection();
    const [result] = await connection.query('INSERT INTO items (categories_id, locations_id, title, description, image) VALUES(?,?,?,?,?)', [newItems.categories_id, newItems.locations_id, newItems.title, newItems.description, newItems.image]);
    const resultHeader = result as ResultSetHeader;
    const [resultItem] = await connection.query('SELECT * FROM items WHERE id = ?', [resultHeader.insertId]);
    const oneItem =  resultItem as IItems[];
    if(oneItem.length === 0){
      res.status(404).send({error:"No item found"});
    }else{
      res.status(200).send(oneItem);
    }
  }catch(err){
    next(err)
  }
});

itemsRouter.delete("/:id", async (req,res,next)=>{
  const id = req.params.id;
  try {
    const connection = await mySqlDb.getConnection();
    const [result]  = await connection.query('DELETE FROM items WHERE id= ?', [id])
    const deletedItem = result as ResultSetHeader;
    if(deletedItem.affectedRows ===0){
      res.status(404).send({error:"No item found"});
    }
    res.status(200).send("Successfully deleted from items!");
  }catch (err){
    next(err);
  }
})

itemsRouter.put('/:id',imagesUpload.single('image'), async(req,res, next)=>{
  const id = req.params.id

  try{
    const updatedItem = {
      categories_id: req.body.categories_id,
      locations_id: req.body.locations_id,
      title: req.body.title,
      description: req.body.description,
      image: req.file ? "image" + req.file.filename : null,
    }

    const connection = await mySqlDb.getConnection();
    await connection.query('UPDATE items SET categories_id=?, locations_id=?,title=? , description=?, image=?', [updatedItem.categories_id, updatedItem.locations_id, updatedItem.title, updatedItem.description, updatedItem.image]);
    const [result] = await connection.query('SELECT * FROM items WHERE id=?', [id]);
    const item = result as IItems[];

    if(item.length === 0){
      res.status(404).send({error:"No item found"});
    }else {
      res.status(200).send(item);
    }

  }catch(err){
    next(err);
  }
})
export default itemsRouter;

