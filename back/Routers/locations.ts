import express from "express";
import mySqlDb from '../mySqlDb';
import {ILocations} from '../types';


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

locationsRouter.post("/", (req, res) => {


});





export default locationsRouter;