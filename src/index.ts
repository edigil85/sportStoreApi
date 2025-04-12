// src/index.ts
import express from 'express';
import productRoutes from './products/product.routes';
import setupSwagger from './utils/swagger';
import { apiLimiter } from './middleware/rateLimiter';
import { setupSecurity } from './middleware/security';
import authRoutes from './auth/auth.routes';

const app = express();

app.use(express.json()); 
app.use(apiLimiter);
setupSecurity(app);
setupSwagger(app);

app.use('/products', apiLimiter, productRoutes);
app.use('/auth', apiLimiter, authRoutes);

app.listen(3000, () => {
  console.log('server runing 3000');
});

export default app;
