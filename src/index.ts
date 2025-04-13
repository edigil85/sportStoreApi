// src/index.ts
import express from 'express';
import productRoutes from './products/product.routes';
import setupSwagger from './utils/swagger';
import { apiLimiter } from './middleware/rateLimiter';
import { setupSecurity } from './middleware/security';
import authRoutes from './auth/auth.routes';
import 'reflect-metadata';
import dotenv from 'dotenv';
import { AppDataSource } from '../ormconfig';

dotenv.config(); 

const app = express();

app.use(express.json());
app.use(apiLimiter);
setupSecurity(app);
setupSwagger(app);


AppDataSource.initialize()
  .then(() => {
    console.log('conected to MongoDB');

    app.use('/products', apiLimiter, productRoutes);
    app.use('/auth', apiLimiter, authRoutes);

    app.listen(3000, () => {
      console.log('server run http://localhost:3000');
    });
  })
  .catch((err) => {
    console.error('error conect to database', err);
  });

export default app;
