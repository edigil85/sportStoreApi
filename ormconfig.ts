import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { Product } from './src/products/product.entity'; 

dotenv.config(); 
const AppDataSource = new DataSource({
  type: 'mongodb',
  url: process.env.MONGO_URI, 
  database: 'sportstore', 
  synchronize: true, 
  entities: [Product], 
  migrations: [],
  subscribers: [],
});

export { AppDataSource };
