import dotenv from 'dotenv';
import logger from '../utils/logger-winston';
import { Request, Response, NextFunction } from 'express';
import { retMiddleware } from '../utils/retMiddleware';
import { enumPermessoTipo } from '../entity/enum/enumPermessoTipo';
import { controllerVeicolo } from '../controllers/controllerVeicolo';
import { isNumeric } from '../utils/utils';
import { middlewareValidate } from './middlewareValidate';
import { serviceVeicolo } from '../services/serviceVeicolo';
import { repositoryVeicolo } from '../dao/repositories/svt/repositoryVeicolo';
import { eVeicolo } from '../entity/svt/eVeicolo';
import { enumVeicoloTipo } from '../entity/enum/enumVeicoloTipo';
import { enumVeicoloStato } from '../entity/enum/enumVeicoloStato';

dotenv.config();

export class middlewareVeicolo {
  private constructor() {}
  public static checkPermissionRead = async (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> => {
    let ret: retMiddleware = new retMiddleware();
    try {
      if (isNumeric(req.userId)) {
        const isPermit: boolean = await controllerVeicolo.checkPermission(
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
      logger.error('middlewareVeicolo.checkPermission :' + error?.message);
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
        const isPermit: boolean = await controllerVeicolo.checkPermission(
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
      logger.error('middlewareVeicolo.checkPermission :' + error?.message);
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
      middlewareValidate.validateTipoVeicolo('tipo', optional),
      middlewareValidate.validateStato('stato', optional),
      middlewareValidate.validateTarga('targa', optional),
    ];

    // Esegui le validazioni
    Promise.all(validations.map((validation) => validation.run(req))).then(
      () => {
        ret.returnNext(next);
      },
    );
  };

  public static validateAssociation = (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): void => {
    let ret: retMiddleware = new retMiddleware();
    let optional: boolean = req.method.toLowerCase() === 'patch';
    // Aggiungi le varie validazioni
    const validations = [
      middlewareValidate.validateString('identificativo', optional),
      middlewareValidate.validateTarga('targa', optional),
    ];

    // Esegui le validazioni
    Promise.all(validations.map((validation) => validation.run(req))).then(
      () => {
        ret.returnNext(next);
      },
    );
  };

  public static insertTarga = async (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> => {
    let ret: retMiddleware = new retMiddleware();
    try {
      //non blocco l'esecuzione se non riesce a inserire la targa tanto l'ocr verificherà anche questa
      const targa: string | null = req.body?.targa;
      const veicolo_tipo: enumVeicoloTipo = req.body.veicolo_tipo;
      if (!!targa) {
        const veicolo: eVeicolo | null =
          await repositoryVeicolo.getByTarga(targa);
        if (!!veicolo) {
          req.body.id_veicolo = veicolo.get_id();
        } else {
          const veicoloRes: eVeicolo | null =
            await serviceVeicolo.createVeicolo(
              veicolo_tipo,
              targa,
              enumVeicoloStato.acquisito,
            );
          if (!!veicoloRes) {
            req.body.id_veicolo = veicoloRes.get_id();
          }
        }
      }
    } catch (error: any) {
      logger.warn('middlewareVeicolo.insertTarga :' + error?.message);
    }

    ret.returnNext(next);
  };
}
