import { Router } from 'express';
import { login } from './auth.controller';

const router = Router();

/**
 * @swagger
 * /login:
 *   post:
 *     summary: "User Login"
 *     tags: [Login]
 *     description: "This endpoint allows the user to log in and receive an access token for further requests."
 *     requestBody:
 *       description: "User credentials (username and password)"
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: "Login successful"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: "Invalid credentials"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid credentials"
 */
router.post('/login', login);

export default router;
