const findMock = jest.fn();
const findOneByMock = jest.fn();
const saveMock = jest.fn();
const deleteMock = jest.fn();
const createMock = jest.fn();

jest.mock('../../../ormconfig', () => ({
  AppDataSource: {
    getRepository: jest.fn().mockReturnValue({
      find: findMock,
      findOneBy: findOneByMock,
      save: saveMock,
      delete: deleteMock,
      create: createMock,
    }),
  },
}));

import { createProductService } from '../product.service';
import { ObjectId, Collection } from 'mongodb';
import { Product } from '../product.entity';


let productService: ReturnType<typeof createProductService>;

describe('ProductService', () => {
  beforeEach(() => {
    let mockCollection: Partial<Collection>;
    let mockDbService: any;
    
    mockCollection = {
      countDocuments: jest.fn().mockResolvedValue(5),
      aggregate: jest.fn().mockReturnValueOnce({
        toArray: jest.fn().mockResolvedValue([{ totalStock: 200 }]),
      }).mockReturnValueOnce({
        toArray: jest.fn().mockResolvedValue([{ averagePrice: 99.99 }]),
      }).mockReturnValueOnce({
        toArray: jest.fn().mockResolvedValue([
          { _id: 'category1', count: 2 },
          { _id: 'category2', count: 1 },
        ]),
      }),
    };

    mockDbService = {
      getCollection: jest.fn().mockResolvedValue(mockCollection),
      close: jest.fn(),
    };

    productService = createProductService(mockDbService);
  });

  it('should return a product by ID', async () => {
    const mockProduct = {
      id: new ObjectId('507f1f77bcf86cd799439011'),
      name: 'Balón Adidas',
      category: 'Fútbol',
      price: 99.99,
      stock: 10,
      brand: 'Adidas',
    };

    findOneByMock.mockResolvedValue(mockProduct);

    const result = await productService.getById('507f1f77bcf86cd799439011');
    expect(result?.id.toString()).toEqual('507f1f77bcf86cd799439011');
    expect(result?.name).toEqual('Balón Adidas');
    expect(result?.category).toEqual('Fútbol');
  });

  it('should return null if product not found by ID', async () => {
    findOneByMock.mockResolvedValue(null);

    const result = await productService.getById('507f1f77bcf86cd799439011');
    expect(result).toBeNull();
  });

  it('should create a new product', async () => {
    const mockProduct: Omit<Product, 'id'> = {
      name: 'Balón Nike', category: 'Fútbol', price: 79.99, stock: 5, brand: 'Nike',
    };
    const createdProduct: Product = { ...mockProduct, id: new ObjectId('507f1f77bcf86cd799439011') };
    findOneByMock.mockResolvedValue(null);
    createMock.mockReturnValue(createdProduct);
    saveMock.mockResolvedValue(createdProduct);

    const result = await productService.create(mockProduct);
    expect(result).toEqual(createdProduct);
  });

  it('should throw error if product already exists during creation', async () => {
    const mockProduct: Omit<Product, 'id'> = {
      name: 'Balón Nike', category: 'Fútbol', price: 79.99, stock: 5, brand: 'Nike',
    };

    findOneByMock.mockResolvedValue(mockProduct);

    await expect(productService.create(mockProduct)).rejects.toThrow(
      new Error('El producto con el nombre "Balón Nike" ya existe.')
    );
  });

  it('should update a product', async () => {
    const mockProduct: Product = {
      id: new ObjectId('507f1f77bcf86cd799439011'), name: 'Balón Adidas', category: 'Fútbol', price: 99.99, stock: 10, brand: 'Adidas',
    };
    const updatedProduct: Product = { ...mockProduct, stock: 15 };
    findOneByMock.mockResolvedValue(mockProduct);
    saveMock.mockResolvedValue(updatedProduct);

    const result = await productService.update('507f1f77bcf86cd799439011', { stock: 15 });
    expect(result).toEqual(updatedProduct);
  });

  it('should return null if product not found during update', async () => {
    findOneByMock.mockResolvedValue(null);

    const result = await productService.update('507f1f77bcf86cd799439567', { stock: 15 });
    expect(result).toBeNull();
  });

  it('should delete a product', async () => {
    deleteMock.mockResolvedValue({ affected: 1 });

    const result = await productService.delete('507f1f77bcf86cd799439567');
    expect(result).toBe(true);
  });

  it('should return false if product not found during delete', async () => {
    deleteMock.mockResolvedValue({ affected: 0 });

    const result = await productService.delete('507f1f77bcf86cd799439567');
    expect(result).toBe(false);
  });
});
