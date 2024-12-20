import express from "express";
import mySqlDb from '../mySqlDb';
import {IItems} from '../types';

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

itemsRouter.post("/", async (req, res) => {

});

export default itemsRouter;

