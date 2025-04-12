import request from 'supertest';
import app from '../index';

let createdId: string;

describe('Product Controller', () => {
  it('should create a product', async () => {
    const response = await request(app)
      .post('/products')
      .send({
        name: 'Balón Adidas',
        category: 'Fútbol',
        price: 99.99,
        stock: 10,
        brand: 'Adidas',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Balón Adidas');

    createdId = response.body.id; 
    console.log('Created product ID:', createdId); 
  });

  it('should get all products', async () => {
    const response = await request(app).get('/products');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should get a product by ID', async () => {
    const response = await request(app).get(`/products/${createdId}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(createdId);
  });

  it('should get products by category', async () => {
    const response = await request(app).get('/products/category/Fútbol');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0].category).toBe('Fútbol');
  });

  it('should update a product', async () => {
    const response = await request(app)
      .put(`/products/${createdId}`)
      .send({
        name: 'Balón Adidas',
        category: 'Fútbol',
        price: 99.99,
        stock: 15,
        brand: 'Adidas',
      });
    expect(response.status).toBe(200);
    expect(response.body.stock).toBe(15);
  });

  it('should return product metrics', async () => {
    const response = await request(app).get('/products/metrics');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('total_products');
    expect(response.body).toHaveProperty('top_categories');
    expect(response.body).toHaveProperty('total_stock');
    expect(response.body).toHaveProperty('average_price');
  });

  it('should delete a product', async () => {
    const response = await request(app).delete(`/products/${createdId}`);
    expect(response.status).toBe(204);
  });

  it('should return 404 if product is not found', async () => {
    const response = await request(app).get(`/products/${createdId}`);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Product not found');
  });

  it('should fail to create a product with negative stock', async () => {
    const response = await request(app)
      .post('/products')
      .send({
        name: 'Guantes Nike',
        category: 'Boxeo',
        price: 49.99,
        stock: -5,
        brand: 'Nike',
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
  });

  it('should fail to create a product with negative price', async () => {
    const response = await request(app)
      .post('/products')
      .send({
        name: 'Raqueta Wilson',
        category: 'Tenis',
        price: -99.99,
        stock: 5,
        brand: 'Wilson',
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
  });

  it('should fail if the name is longer than 100 characters', async () => {
    const longName = 'a'.repeat(101);
    const response = await request(app)
      .post('/products')
      .send({
        name: longName,
        category: 'Fútbol',
        price: 100,
        stock: 10,
        brand: 'Nike',
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
  });

  it('should fail if the brand is longer than 50 characters', async () => {
    const longBrand = 'a'.repeat(51);
    const response = await request(app)
      .post('/products')
      .send({
        name: 'Balón Adidas',
        category: 'Fútbol',
        price: 50,
        stock: 15,
        brand: longBrand,
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
  });

  it('should fail if the category is longer than 50 characters', async () => {
    const longCategory = 'a'.repeat(51);
    const response = await request(app)
      .post('/products')
      .send({
        name: 'Zapatillas Puma',
        category: longCategory,
        price: 75,
        stock: 5,
        brand: 'Puma',
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
  });
});
