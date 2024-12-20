import express from "express";
import cors from "cors";
import itemsRouter from './Routers/items';
import categoriesRouter from './Routers/categories';
import locationsRouter from './Routers/locations';
import MySqlDb from './mySqlDb';

const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());
app.use(express.static("public"));
app.use('/items', itemsRouter);
app.use('/categories', categoriesRouter);
app.use('/locations', locationsRouter);



const run = async()=>{
  await MySqlDb.init();
  app.listen(port,()=>{
    console.log(`Server running on port http://localhost:${port}`);
  });
}

run().catch(err=>{
  console.error(err);
})

