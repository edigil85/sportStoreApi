import { Product } from './product.entity';
import { AppDataSource } from '../../ormconfig';
import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { DatabaseService } from '../database/database.service';

const productRepository: Repository<Product> = AppDataSource.getRepository(Product);

export const createProductService = (dbService: DatabaseService) => {
  return {
    getAll: async (): Promise<any[]> => {
      const products = await productRepository.find();
      return products.map(p => ({ ...p, id: p.id.toString() }));
    },

    getById: async (id: string): Promise<Product | null> => {
      const objectId = new ObjectId(id);
      return await productRepository.findOneBy({ _id: objectId } as any);
    },

    getByCategory: async (category: string): Promise<Product[]> => {
      return await productRepository.find({ where: { category } });
    },

    create: async (data: Omit<Product, 'id'>): Promise<Product> => {
      const exists = await productRepository.findOneBy({ name: data.name });
      if (exists) throw new Error(`El producto con el nombre "${data.name}" ya existe.`);
      const newProduct = productRepository.create(data);
      return await productRepository.save(newProduct);
    },

    update: async (id: string, data: Partial<Omit<Product, 'id'>>): Promise<Product | null> => {
      const objectId = new ObjectId(id);
      const product = await productRepository.findOneBy({ _id: objectId } as any);
      if (!product) return null;
      return await productRepository.save({ ...product, ...data });
    },

    delete: async (id: string): Promise<boolean> => {
      const result = await productRepository.delete(id);
      return !!(result.affected && result.affected > 0);
    },

    getMetrics: async () => {
      const collection = await dbService.getCollection('product');

      const totalProducts = await collection.countDocuments();
      
      const totalStockResult = await collection.aggregate([
        { $group: { _id: null, totalStock: { $sum: '$stock' } } },
      ]).toArray();

      const averagePriceResult = await collection.aggregate([
        { $group: { _id: null, averagePrice: { $avg: '$price' } } },
      ]).toArray();

      const categories = await collection.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]).toArray();

      return {
        total_products: totalProducts,
        total_stock: totalStockResult[0]?.totalStock || 0,
        average_price: averagePriceResult[0]?.averagePrice?.toFixed(2) || '0.00',
        top_categories: categories.map(cat => cat._id),
      };
    },
  };
};
