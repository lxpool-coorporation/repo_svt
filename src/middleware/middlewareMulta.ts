import dotenv from 'dotenv';
import logger from '../utils/logger-winston';
import { Request, Response, NextFunction } from 'express';
import { retMiddleware } from '../utils/retMiddleware';
import { enumPermessoTipo } from '../entity/enum/enumPermessoTipo';
import { controllerMulta } from '../controllers/controllerMulta';
import { isNumeric } from '../utils/utils';
import { middlewareValidate } from './middlewareValidate';
import { query } from 'express-validator';

dotenv.config();

/**
 *
 *
 * @export
 * @class middlewareMulta
 */
export class middlewareMulta {
  /**
   * Creates an instance of middlewareMulta.
   * @memberof middlewareMulta
   */
  private constructor() {}
  /**
   *
   *
   * @static
   * @param {Request} req
   * @param {Response} _res
   * @param {NextFunction} next
   * @memberof middlewareMulta
   */
  public static checkPermissionRead = async (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> => {
    let ret: retMiddleware = new retMiddleware();
    try {
      if (isNumeric(req.userId)) {
        const isPermit: boolean = await controllerMulta.checkPermission(
          req.userId,
          enumPermessoTipo.lettura,
        );
        if (!isPermit) {
          ret.setResponse(401, {
            message: 'non si dispongono dei permessi LETTURA',
          });
        }
      } else {
        ret.setResponse(403, { message: 'errore verifica permessi LETTURA' });
      }
    } catch (error: any) {
      logger.error('middlewareMulta.checkPermission :' + error?.message);
      ret.setResponse(403, { message: 'errore verifica permessi LETTURA' });
    }
    ret.returnNext(next);
  };
  /**
   *
   *
   * @static
   * @param {Request} req
   * @param {Response} _res
   * @param {NextFunction} next
   * @memberof middlewareMulta
   */
  public static checkPermissionWrite = async (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> => {
    let ret: retMiddleware = new retMiddleware();
    try {
      if (isNumeric(req.userId)) {
        const isPermit: boolean = await controllerMulta.checkPermission(
          req.userId,
          enumPermessoTipo.scrittura,
        );
        if (!isPermit) {
          ret.setResponse(401, {
            message: 'non si dispongono dei permessi SCRITTURA',
          });
        }
      } else {
        ret.setResponse(403, { message: 'errore verifica permessi SCRITTURA' });
      }
    } catch (error: any) {
      logger.error('middlewareMulta.checkPermission :' + error?.message);
      ret.setResponse(403, { message: 'errore verifica permessi SCRITTURA' });
    }
    ret.returnNext(next);
  };
  /**
   *
   *
   * @static
   * @param {Request} req
   * @param {Response} _res
   * @param {NextFunction} next
   * @memberof middlewareMulta
   */
  public static validate = async (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> => {
    let ret: retMiddleware = new retMiddleware();
    // per il metodo patch i controlli devono essere effettuati solo se il campo esiste
    let optional: boolean = req.method.toLowerCase() === 'patch';

    let validations = [
      middlewareValidate.validateDateISO8601('data_inizio', optional, query),
      middlewareValidate.validateDateISO8601('data_fine', optional, query),
      middlewareValidate.validateString('targa', optional, query),
      middlewareValidate.validateFormatoOutput('format', optional, query),
      /*
      middlewareValidate
        .validateString('format', optional, query)
        .custom((value) => {
          if (value.trim().toLowerCase() != 'json') {
            throw new Error('formato di output non valido');
          }
          return true;
        }),
      */
    ];

    // Esegui le validazioni
    Promise.all(validations.map((validation) => validation.run(req))).then(
      () => {
        ret.returnNext(next);
      },
    );
  };
}
