import dotenv from 'dotenv';
import logger from '../utils/logger-winston';
import { Request, Response, NextFunction } from 'express';
import { controllerAuth, JwtPayload } from '../controllers/controllerAuth';
import { retMiddleware } from '../utils/retMiddleware';

dotenv.config();

/**
 *
 *
 * @export
 * @class middlewareAuth
 */
export class middlewareAuth {
  /**
   * Creates an instance of middlewareAuth.
   * @memberof middlewareAuth
   */
  private constructor() {}
  /**
   *
   *
   * @static
   * @param {Request} req
   * @param {Response} _res
   * @param {NextFunction} next
   * @memberof middlewareAuth
   */
  public static verifyToken = (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): void => {
    let ret: retMiddleware = new retMiddleware();
    try {
      const authHeader = req.headers.authorization;
      if (!!authHeader && authHeader.startsWith('Bearer ')) {
        const arrayToken = authHeader.split(' '); // Estraiamo il token dall'header

        if (arrayToken.length === 2) {
          const token = arrayToken[1]; // Estraiamo il token dall'header
          const decoded = controllerAuth.verifyToken(token) as JwtPayload;
          if (!!decoded) {
            req.userId = decoded.id_utente;
          } else {
            ret.setResponse(401, { message: 'Token non valido' });
          }
        } else {
          ret.setResponse(401, { message: 'Token non valido' });
        }
      } else {
        ret.setResponse(401, { message: 'Token mancante o non valido' });
      }
    } catch (error: any) {
      logger.error('middlewareAuth.verifyToken :' + error?.message);
      ret.setResponse(403, { message: 'Token non valido' });
    }
    ret.returnNext(next);
  };
}
