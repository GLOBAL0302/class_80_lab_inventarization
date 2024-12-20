import express from "express";
import mysqlDb from '../mySqlDb';
import {ICategories} from '../types';
import {ResultSetHeader} from 'mysql2';


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
});

categoriesRouter.get("/:id", async (req,res,next)=>{
  try{
    const id = req.params.id;
    const connection = await mysqlDb.getConnection();
    const [result] = await connection.query('SELECT * FROM categories WHERE id = ?', [id]);
    const oneCategory = result as ICategories[];
    if(oneCategory.length === 0){
      res.status(404).send({error:"No category found"});
    }else{
      res.status(200).send(oneCategory[0]);
    }
  }catch(err){
    next(err);
  }
});

categoriesRouter.post("/", async (req,res, next)=>{
  try {
    if(!req.body.title){
      res.status(400).send({error:"Title is required"});
    }
    const newCategory = {
      title: req.body.title,
      description: req.body.description,
    }

    const connection = await mysqlDb.getConnection();
    const [result] = await connection.query
    ('INSERT INTO categories (title, description) VALUES (?, ?)',[newCategory.title, newCategory.description]);

    const resultHeader = result as ResultSetHeader;
    const [resultNewCategory] = await connection.query('SELECT * FROM categories WHERE id = ?', [resultHeader.insertId]);
    const oneCategory = resultNewCategory as ICategories[];

    if(oneCategory.length === 0){
      res.status(404).send({error:"No category"});
    }else{
      res.status(200).send(oneCategory[0]);
    }
  }catch(err){
    next(err);
  }
});

categoriesRouter.delete("/:id", async (req,res,next)=>{
  try{
    const id = req.params.id;
    const connection = await mysqlDb.getConnection();
    const[result] =  await connection.query('DELETE FROM categories WHERE id = ?', [id]);
    const deleteCategory = result as ResultSetHeader
    if(deleteCategory.affectedRows === 0 ){
      res.status(404).send({error:"No category found"});
    }
    res.status(200).send("Successfully deleted from categories!");
  }catch(err){
    next(err);
  }
});

categoriesRouter.put("/:id", async (req,res,next)=>{
  const updatedCategories = {
    title: req.body.title,
    description: req.body.description,
  }
  const id = req.params.id;
  if(!req.body.title){
    res.status(404).send({error:"Title is required"});
  }
  try{
    const connection = await mysqlDb.getConnection();
    await connection.query('UPDATE categories SET title = ?, description = ? WHERE id = ?',[updatedCategories.title, updatedCategories.description, id]);
    const [result] = await connection.query('SELECT * FROM categories WHERE id = ?', [id]);
    const category = result as ICategories[];
    if(category.length === 0){
      res.status(404).send({error:"No category found"});
    }else{
      res.status(200).send(category[0]);
    }
  }catch(err){
    next(err);
  }
})




export default categoriesRouter