import { Request, Response } from 'express';
import { createProductService } from './product.service';
import { DatabaseService } from '../database/database.service';

const productService = createProductService(new DatabaseService());

export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await productService.getAll();
    res.json(products);
  } catch (error) {
    console.error('Error retrieving products:', error);
    res.status(500).json({ message: 'Error retrieving products' });
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await productService.getById(req.params.id);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
    } else {
      res.json(product);
    }
  } catch (error) {
    console.error('Error retrieving product by id:', error);
    res.status(500).json({ message: 'Error retrieving product' });
  }
};

export const getProductsByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await productService.getByCategory(req.params.category);
    res.json(products);
  } catch (error) {
    console.error('Error retrieving products by category:', error);
    res.status(500).json({ message: 'Error retrieving products by category' });
  }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, category, price, stock, brand } = req.body;
    const product = await productService.create({ name, category, price, stock, brand });
    res.status(201).json(product);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await productService.update(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ message: 'Product not found' });
    } else {
      res.json(updated);
    }
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error updating product' });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const success = await productService.delete(req.params.id);
    if (!success) {
      res.status(404).json({ message: 'Product not found' });
    } else {
      res.status(204).send();
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product' });
  }
};

export const getProductMetrics = async (req: Request, res: Response): Promise<void> => {
  try {
    const metrics = await productService.getMetrics();
    res.json(metrics);
  } catch (error) {
    console.error('Error retrieving product metrics:', error);
    res.status(500).json({ message: 'Error retrieving product metrics' });
  }
};
