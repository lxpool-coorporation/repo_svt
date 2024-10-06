import dotenv from 'dotenv';
import logger from '../utils/logger-winston';
import { Request, Response, NextFunction } from 'express';
import { retMiddleware } from '../utils/retMiddleware';
import { enumPermessoTipo } from '../entity/enum/enumPermessoTipo';
import { controllerTratta } from '../controllers/controllerTratta';
import { isNumeric } from '../utils/utils';
import { middlewareValidate } from './middlewareValidate';

dotenv.config();

export class middlewareTratta {
  private constructor() {}
  public static checkPermissionRead = async (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> => {
    let ret: retMiddleware = new retMiddleware();
    try {
      if (isNumeric(req.userId)) {
        const isPermit: boolean = await controllerTratta.checkPermission(
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
      logger.error('middlewareTratta.checkPermission :' + error?.message);
      ret.setResponse(403, { message: 'errore verifica permessi LETTURA' });
    }
    ret.returnNext(next);
  };
  public static checkPermissionWrite = async (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> => {
    let ret: retMiddleware = new retMiddleware();
    try {
      if (isNumeric(req.userId)) {
        const isPermit: boolean = await controllerTratta.checkPermission(
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
      logger.error('middlewareTratta.checkPermission :' + error?.message);
      ret.setResponse(403, { message: 'errore verifica permessi SCRITTURA' });
    }
    ret.returnNext(next);
  };
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
      middlewareValidate.validateStato('stato', optional),
      middlewareValidate.validateNumber('id_varco_ingresso', optional),
      middlewareValidate.validateNumber('id_varco_uscita', optional),
      middlewareValidate.validateNumber('distanza', optional),
    ];

    // Esegui le validazioni
    Promise.all(validations.map((validation) => validation.run(req))).then(
      () => {
        ret.returnNext(next);
      },
    );
  };
}
