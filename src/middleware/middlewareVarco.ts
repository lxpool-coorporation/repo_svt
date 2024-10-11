import dotenv from 'dotenv';
import logger from '../utils/logger-winston';
import { Request, Response, NextFunction } from 'express';
import { retMiddleware } from '../utils/retMiddleware';
import { enumPermessoTipo } from '../entity/enum/enumPermessoTipo';
import { controllerVarco } from '../controllers/controllerVarco';
import { isNumeric } from '../utils/utils';
import { middlewareValidate } from './middlewareValidate';

dotenv.config();

/**
 *
 *
 * @export
 * @class middlewareVarco
 */
export class middlewareVarco {
  /**
   * Creates an instance of middlewareVarco.
   * @memberof middlewareVarco
   */
  private constructor() {}
  /**
   *
   *
   * @static
   * @param {Request} req
   * @param {Response} _res
   * @param {NextFunction} next
   * @memberof middlewareVarco
   */
  public static checkPermissionRead = async (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> => {
    let ret: retMiddleware = new retMiddleware();
    try {
      if (isNumeric(req.userId)) {
        const isPermit: boolean = await controllerVarco.checkPermission(
          req.userId,
          enumPermessoTipo.lettura,
        );
        if (!isPermit) {
          ret.setResponse(401, { message: 'errore verifica permessi LETTURA' });
        }
      } else {
        ret.setResponse(403, { message: 'errore verifica permessi LETTURA' });
      }
    } catch (error: any) {
      logger.error('middlewareVarco.checkPermission :' + error?.message);
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
   * @memberof middlewareVarco
   */
  public static checkPermissionWrite = async (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> => {
    let ret: retMiddleware = new retMiddleware();
    try {
      if (isNumeric(req.userId)) {
        const isPermit: boolean = await controllerVarco.checkPermission(
          req.userId,
          enumPermessoTipo.scrittura,
        );
        if (!isPermit) {
          ret.setResponse(401, {
            message: 'errore verifica permessi SCRITTURA',
          });
        }
      } else {
        ret.setResponse(403, { message: 'errore verifica permessi SCRITTURA' });
      }
    } catch (error: any) {
      logger.error('middlewareVarco.checkPermission :' + error?.message);
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
   * @memberof middlewareVarco
   */
  public static validate = (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): void => {
    let ret: retMiddleware = new retMiddleware();
    let optional: boolean = req.method.toLowerCase() === 'patch';
    // Aggiungi le varie validazioni
    const validations = [
      middlewareValidate.validateString('cod', optional),
      middlewareValidate.validateString('descrizione', optional),
      middlewareValidate.validateLatitudine('latitudine', optional),
      middlewareValidate.validateLongitudine('longitudine', optional),
      middlewareValidate.validateStato('stato', optional),
    ];

    // Esegui le validazioni
    Promise.all(validations.map((validation) => validation.run(req))).then(
      () => {
        ret.returnNext(next);
      },
    );
  };
}
