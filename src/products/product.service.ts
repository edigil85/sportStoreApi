import { Product } from './product.model';
import { randomUUID } from 'crypto';

let products: Product[] = [];

export const ProductService = {
  getAll: (): Product[] => products,

  getById: (id: string): Product | undefined =>
    products.find((p) => p.id === id),

  getByCategory: (category: string): Product[] =>
    products.filter((p) => p.category.toLowerCase() === category.toLowerCase()),

  create: (data: Omit<Product, 'id'>): Product => {
    const newProduct: Product = { id: randomUUID(), ...data };
    products.push(newProduct);
    return newProduct;
  },

  update: (id: string, data: Partial<Omit<Product, 'id'>>): Product | null => {
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;
    products[index] = { ...products[index], ...data };
    return products[index];
  },

  delete: (id: string): boolean => {
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return false;
    products.splice(index, 1);
    return true;
  },

  getMetrics: () => {
    const totalProducts = products.length;
    const totalStock = products.reduce((acc, product) => acc + product.stock, 0);

    const averagePrice =
      totalProducts > 0
        ? products.reduce((acc, product) => acc + product.price, 0) / totalProducts
        : 0;

    const categoryMap: Record<string, number> = {};

    for (const product of products) {
      categoryMap[product.category] = (categoryMap[product.category] || 0) + 1;
    }

    const topCategories = Object.entries(categoryMap)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);

    return {
      total_products: totalProducts,
      top_categories: topCategories,
      total_stock: totalStock,
      average_price: Number(averagePrice.toFixed(2)),
    };
  },



};
