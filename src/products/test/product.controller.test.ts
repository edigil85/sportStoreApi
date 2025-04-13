import { getAllProducts,
  getProductById,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductMetrics
} from '../product.controller';
import { Request, Response } from 'express';
import { createProductService } from '../product.service';
import { DatabaseService } from '../../database/database.service'; 

jest.mock('../product.service', () => ({
  createProductService: jest.fn().mockReturnValue({
    getAll: jest.fn(),
    getById: jest.fn(),
    getByCategory: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    getMetrics: jest.fn(),
  }),
}));

describe('Product Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let productService: ReturnType<typeof createProductService>; 

  beforeEach(() => {
    req = {};
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    
    productService = createProductService(new DatabaseService());
  });

  it('should return all products', async () => {
    (productService.getAll as jest.Mock).mockResolvedValue([{ id: 1, name: 'Test Product' }]);

    await getAllProducts(req as Request, res as Response);

    expect(res.json).toHaveBeenCalledWith([{ id: 1, name: 'Test Product' }]);
  });

  it('should handle errors', async () => {
    (productService.getAll as jest.Mock).mockRejectedValue(new Error('Database error'));

    await getAllProducts(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error retrieving products' });
  });

  it('should return a product by id', async () => {
    req.params = { id: '1' };
    (productService.getById as jest.Mock).mockResolvedValue({ id: '1', name: 'Test Product' });

    await getProductById(req as Request, res as Response);

    expect(res.json).toHaveBeenCalledWith({ id: '1', name: 'Test Product' });
  });

  it('should return 404 if product not found', async () => {
    req.params = { id: '1' };
    (productService.getById as jest.Mock).mockResolvedValue(null);  // Simulamos que no encontró el producto

    await getProductById(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Product not found' });
  });

  it('should handle errors in getProductById', async () => {
    req.params = { id: '1' };
    (productService.getById as jest.Mock).mockRejectedValue(new Error('Database error'));

    await getProductById(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error retrieving product' });
  });

  it('should return products by category', async () => {
    req.params = { category: 'Test Category' };
    (productService.getByCategory as jest.Mock).mockResolvedValue([{ id: '1', name: 'Test Product', category: 'Test Category' }]);

    await getProductsByCategory(req as Request, res as Response);

    expect(res.json).toHaveBeenCalledWith([{ id: '1', name: 'Test Product', category: 'Test Category' }]);
  });

  it('should handle errors in getProductsByCategory', async () => {
    req.params = { category: 'Test Category' };
    (productService.getByCategory as jest.Mock).mockRejectedValue(new Error('Database error'));

    await getProductsByCategory(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error retrieving products by category' });
  });

  it('should create a new product', async () => {
    req.body = { name: 'New Product', category: 'Test Category', price: 100, stock: 10, brand: 'BrandX' };
    const newProduct = { id: '1', ...req.body };
    (productService.create as jest.Mock).mockResolvedValue(newProduct);

    await createProduct(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(newProduct);
  });

  it('should return a 400 error when create fails', async () => {
    req.body = { name: 'New Product', category: 'Test Category', price: 100, stock: 10, brand: 'BrandX' };
    const errorMessage = 'Product creation failed';
    (productService.create as jest.Mock).mockRejectedValue(new Error(errorMessage));

    await createProduct(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
  });

  it('should update a product successfully', async () => {
    req.params = { id: '1' };
    req.body = { name: 'Updated Product', category: 'Updated Category', price: 150, stock: 20, brand: 'UpdatedBrand' };
    const updatedProduct = { id: '1', ...req.body };
    (productService.update as jest.Mock).mockResolvedValue(updatedProduct);

    await updateProduct(req as Request, res as Response);

    expect(res.json).toHaveBeenCalledWith(updatedProduct);
  });

  it('should return 404 if product to update is not found', async () => {
    req.params = { id: '1' };
    req.body = { name: 'Updated Product', category: 'Updated Category', price: 150, stock: 20, brand: 'UpdatedBrand' };
    (productService.update as jest.Mock).mockResolvedValue(null);

    await updateProduct(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Product not found' });
  });

  it('should handle errors in updateProduct', async () => {
    req.params = { id: '1' };
    req.body = { name: 'Updated Product', category: 'Updated Category', price: 150, stock: 20, brand: 'UpdatedBrand' };
    (productService.update as jest.Mock).mockRejectedValue(new Error('Database error'));

    await updateProduct(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error updating product' });
  });

  it('should delete a product successfully', async () => {
    req.params = { id: '1' };
    (productService.delete as jest.Mock).mockResolvedValue(true);

    await deleteProduct(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(204);
  });

  it('should return 404 if product to delete is not found', async () => {
    req.params = { id: '1' };
    (productService.delete as jest.Mock).mockResolvedValue(false);

    await deleteProduct(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Product not found' });
  });

  it('should handle errors in deleteProduct', async () => {
    req.params = { id: '1' };
    (productService.delete as jest.Mock).mockRejectedValue(new Error('Database error'));

    await deleteProduct(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error deleting product' });
  });

  it('should return product metrics', async () => {
    const metrics = { totalProducts: 100, averagePrice: 50 };
    (productService.getMetrics as jest.Mock).mockResolvedValue(metrics);

    await getProductMetrics(req as Request, res as Response);

    expect(res.json).toHaveBeenCalledWith(metrics);
  });

  it('should handle errors in getProductMetrics', async () => {
    (productService.getMetrics as jest.Mock).mockRejectedValue(new Error('Database error'));

    await getProductMetrics(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error retrieving product metrics' });
  });


});


