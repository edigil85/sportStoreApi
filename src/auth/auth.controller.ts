import dotenv from 'dotenv';
dotenv.config(); 
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const USERNAME = 'admin';
const PASSWORD = 'password123'; // usuario inicial de pruebas
const JWT_SECRET = process.env.JWT_SECRET as string;

export const login = (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (username !== USERNAME || password !== PASSWORD) {
     res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });

   res.json({ token });
};
