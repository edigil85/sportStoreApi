import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 3 * 60 * 1000, // 3 minutos
  max: 100, // Limita a 100 solicitudes por IP cada 3 minutos
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many requests from this IP, please try again in 3 minutes.',
  },
});