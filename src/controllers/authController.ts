import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';
import logger from '../utils/logger-winston';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';
import { repositoryUtente } from '../dao/repositories/utente/repositoryUtente';
import { eUtente } from '../entity/utente/eUtente';
import { isString } from '../utils/utils';
import { retMiddleware } from '../utils/retMiddleware';

dotenv.config(); // Per leggere la chiave segreta dal file .env

// Leggiamo le chiavi in base all'ambiente
let JWT_SECRET_PRIVATE: string;
let JWT_SECRET_PUBLIC: string;

const PRIVATE_KEY_PATH = process.env.JWT_PRIVATE_KEY || '';
const PUBLIC_KEY_PATH = process.env.JWT_PUBLIC_KEY || '';

if (
  process.env.NODE_ENV === 'development' ||
  process.env.NODE_ENV === 'production'
) {
  // In development e production leggiamo le chiavi dai file
  JWT_SECRET_PRIVATE = fs.readFileSync(PRIVATE_KEY_PATH, 'utf8');
  JWT_SECRET_PUBLIC = fs.readFileSync(PUBLIC_KEY_PATH, 'utf8');
} else if (process.env.NODE_ENV === 'test') {
  // In test leggiamo le chiavi direttamente dalle variabili d'ambiente
  JWT_SECRET_PRIVATE = process.env.JWT_PRIVATE_KEY || ''; // Fallback se la variabile non è presente
  JWT_SECRET_PUBLIC = process.env.JWT_PUBLIC_KEY || ''; // Fallback se la variabile non è presente
}

const JWT_TOKEN_EXPIRED = process.env.JWT_TOKEN_EXPIRED || '1h';
const options: SignOptions = {
  expiresIn: JWT_TOKEN_EXPIRED,
  algorithm: 'RS256',
};

export interface JwtPayload {
  id_utente: number; // Aggiungiamo altre proprietà se hai più dati nel payload
}

export class authController {
  private constructor() {}
  public static generateToken = (userId: number): string => {
    let ret: string = '';
    try {
      if (!!userId && userId !== undefined) {
        const private_key = JWT_SECRET_PRIVATE; // Usiamo la chiave corretta in base all'ambiente
        const payload = { id_utente: userId };
        ret = jwt.sign(payload, private_key, options);
        logger.info(
          'authController.generateToken : token generato per id [' +
            String(userId) +
            ']',
        );
      }
    } catch (error: any) {
      logger.error('authController.generateToken :' + error?.message);
    }
    return ret;
  };
  public static verifyToken = (token: string): JwtPayload | null => {
    let ret: JwtPayload | null = null;
    try {
      if (!!token && token !== undefined && token.trim() != '') {
        const public_key = JWT_SECRET_PUBLIC; // Usiamo la chiave corretta in base all'ambiente
        ret = jwt.verify(token, public_key, options) as JwtPayload;
      }
    } catch (error: any) {
      logger.error('authController.verifyToken :' + error?.message);
    }
    return ret;
  };
  public static login = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    let ret: retMiddleware = new retMiddleware();
    try {
      const { identificativo } = req.body as any;
      if (!!identificativo && isString(identificativo)) {
        const user: eUtente | null =
          await repositoryUtente.getByIdentificativo(identificativo);
        // Eseguiamo qui la validazione dell'utente
        if (!!user) {
          const token: string = authController.generateToken(user.get_id()); // Passa l'ID utente
          if (!!token && token.trim() !== '') {
            ret.setResponse(200, { token });
          } else {
            ret.setResponse(500, { message: 'errore generazione Token' });
          }
        } else {
          ret.setResponse(401, { message: 'Credenziali non valide' });
        }
      } else {
        ret.setResponse(401, { message: 'Credenziali non valide' });
      }
    } catch (error: any) {
      logger.error('authController.verifyToken :' + error?.message);
      ret.setResponse(500, { message: 'errore generazione Token' });
    }
    ret.returnResponseJson(res, next);
  };
}
