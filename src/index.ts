// src/index.ts
import express from 'express';
import productRoutes from './products/product.routes';
import setupSwagger from './utils/swagger';

const app = express();

app.use(express.json()); 

setupSwagger(app);

app.use('/products', productRoutes); 

app.listen(3000, () => {
  console.log('server runing 3000');
});

export default app;
