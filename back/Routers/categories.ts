import express from "express";
import mysqlDb from '../mySqlDb';
import {ICategories} from '../types';


const categoriesRouter = express.Router();

categoriesRouter.get("/", async (req, res, next)=>{
  try{
    const connection = await mysqlDb.getConnection();
    const [result] = await connection.query('SELECT * FROM categories');
    const categories = result as ICategories[];
    res.status(200).send(categories);

  }catch(err){
    next(err);
  }
})

categoriesRouter.post("/", async (req,res)=>{

})


export default categoriesRouter