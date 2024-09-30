import dotenv from 'dotenv';
import logger from '../utils/logger-winston';
import createError from 'http-errors';
import { Request, Response, NextFunction } from 'express';
import { authController, JwtPayload } from '../controller/authController';

dotenv.config();

export class authMiddleware {
  private constructor() {}
  public static verifyToken = (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): void => {
    try {
      const authHeader = req.headers.authorization;
      if (!!authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1]; // Estraiamo il token dall'header
        const decoded = authController.verifyToken(token) as JwtPayload;
        if (!!decoded) {
          req.userId = decoded.id;
          next(); // Continuiamo con la richiesta
        } else {
          next(createError(403, { message: 'Token non valido' }));
        }
      } else {
        next(createError(401, { message: 'Token mancante o non valido' }));
      }
    } catch (error: any) {
      logger.error('authMiddleware.verifyToken :' + error?.message);
      next(createError(403, { message: 'Token non valido' }));
    }
  };
}
