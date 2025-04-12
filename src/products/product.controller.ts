import { Request, Response } from 'express';
import { ProductService } from './product.service';


export const getAllProducts = (req: Request, res: Response): void => {
  res.json(ProductService.getAll());
};

export const getProductById = (req: Request, res: Response): void => {
  const product = ProductService.getById(req.params.id);
  if (!product) {
    console.log('Product not found');
    res.status(404).json({ message: 'Product not found' });
  }
   res.json(product);
};

export const getProductsByCategory = (req: Request, res: Response) => {
  const products = ProductService.getByCategory(req.params.category);
  res.json(products);
};

export const createProduct = (req: Request, res: Response) => {
  const { name, category, price, stock, brand } = req.body;
  if (!name || !category || price == null || stock == null || !brand) {
     res.status(400).json({ message: 'Todos los campos son requeridos' });
  }

  const newProduct = ProductService.create({ name, category, price, stock, brand });
  res.status(201).json(newProduct);
};

export const updateProduct = (req: Request, res: Response) => {
  const updated = ProductService.update(req.params.id, req.body);
  if (!updated)  res.status(404).json({ message: 'product not found' });
  res.json(updated);
};

export const deleteProduct = (req: Request, res: Response) => {
  const success = ProductService.delete(req.params.id);
  if (!success)  res.status(404).json({ message: 'product not found' });
  res.status(204).send();
};

export const getProductMetrics = (req: Request, res: Response) => {
  const metrics = ProductService.getMetrics();
  res.json(metrics);
};


