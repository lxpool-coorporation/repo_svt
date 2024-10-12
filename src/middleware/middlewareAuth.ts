import dotenv from 'dotenv';
import logger from '../utils/logger-winston';
import { Request, Response, NextFunction } from 'express';
import { controllerAuth, JwtPayload } from '../controllers/controllerAuth';
import { retMiddleware } from '../utils/retMiddleware';
import { serviceUtente } from '../services/serviceUtente';
import { eUtente } from '../entity/utente/eUtente';

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
  public static verifyToken = async (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> => {
    let ret: retMiddleware = new retMiddleware();
    try {
      const authHeader = req.headers.authorization;
      if (!!authHeader && authHeader.startsWith('Bearer ')) {
        const arrayToken = authHeader.split(' '); // Estraiamo il token dall'header

        if (arrayToken.length === 2) {
          const token = arrayToken[1]; // Estraiamo il token dall'header
          const decoded = controllerAuth.verifyToken(token) as JwtPayload;
          if (!!decoded) {
            const objUtente: eUtente | null =
              await serviceUtente.getUtenteByIdentificativo(
                decoded.identificativo,
              );
            if (!!objUtente) {
              req.userId = objUtente.get_id();
            } else {
              ret.setResponse(401, { message: 'utente non esiste' });
            }
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
