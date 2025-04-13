import { createProductService } from '../product.service';
import { Collection } from 'mongodb';

describe('ProductService - getMetrics', () => {
  let mockCollection: Partial<Collection>;
  let mockDbService: any;
  let productService: ReturnType<typeof createProductService>;

  beforeEach(() => {
    mockCollection = {
      countDocuments: jest.fn().mockResolvedValue(5),
      aggregate: jest.fn().mockReturnValueOnce({
        toArray: jest.fn().mockResolvedValue([{ totalStock: 200 }])
      }).mockReturnValueOnce({
        toArray: jest.fn().mockResolvedValue([{ averagePrice: 99.99 }])
      }).mockReturnValueOnce({
        toArray: jest.fn().mockResolvedValue([
          { _id: 'category1', count: 2 },
          { _id: 'category2', count: 1 }
        ])
      }),
    };

    mockDbService = {
      getCollection: jest.fn().mockResolvedValue(mockCollection),
      close: jest.fn()
    };

    productService = createProductService(mockDbService);
  });

  it('should return correct product metrics', async () => {
    const metrics = await productService.getMetrics();

    expect(metrics).toEqual({
      total_products: 5,
      total_stock: 200,
      average_price: '99.99',
      top_categories: ['category1', 'category2'],
    });

    expect(mockDbService.getCollection).toHaveBeenCalledWith('product');
    expect(mockCollection.countDocuments).toHaveBeenCalled();
    expect(mockCollection.aggregate).toHaveBeenCalledTimes(3);
  });
});
