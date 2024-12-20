import path from 'path';

const rootPath = __dirname;

const config = {
  rootPath,
  publicPath: path.join(rootPath, 'public'),
  dataBase:{
    host: "localhost",
    user:"root",
    password: "1qaz@WSX29",
    database:"inventories"
  }
}

export default config;