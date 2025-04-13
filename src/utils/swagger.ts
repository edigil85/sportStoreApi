import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';

/**
 * 
 * @param app 
 */
const setupSwagger = (app: Application) => {
  
  const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Product API',
        version: '1.0.0',
        description: 'API for managing products',
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
        schemas: {
          LoginRequest: {
            type: 'object',
            properties: {
              username: {
                type: 'string',
                example: 'admin',
              },
              password: {
                type: 'string',
                example: 'password123',
              },
            },
          },
          LoginResponse: {
            type: 'object',
            properties: {
              accessToken: {
                type: 'string',
                example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiZXhwIjoxNjMwODAxNjE0fQ.X29hZ...9Hs9X4P5o',
              },
            },
          },
          Product: {
            type: 'object',
            properties: {
              id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
              name: { type: 'string', example: 'Balón Adidas' },
              category: { type: 'string', example: 'Fútbol' },
              price: { type: 'number', example: 99.99 },
              stock: { type: 'integer', example: 10 },
              brand: { type: 'string', example: 'Adidas' },
            },
          },
        },
      },
    },
    apis: ['./src/auth/*.ts', './src/products/*.ts'] 
  };

  const swaggerSpec = swaggerJSDoc(swaggerOptions);

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.get('/swagger.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
};

export default setupSwagger;
