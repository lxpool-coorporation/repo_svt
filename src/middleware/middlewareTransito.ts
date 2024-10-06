import dotenv from 'dotenv';
import logger from '../utils/logger-winston';
import { Request, Response, NextFunction } from 'express';
import { retMiddleware } from '../utils/retMiddleware';
import { enumPermessoTipo } from '../entity/enum/enumPermessoTipo';
import { controllerTransito } from '../controllers/controllerTransito';
import { isNumeric } from '../utils/utils';
import { middlewareValidate } from './middlewareValidate';
import { serviceUtente } from '../services/serviceUtente';
import { eProfilo } from '../entity/utente/eProfilo';
import { enumTransitoStato } from '../entity/enum/enumTransitoStato';
import { repositoryVeicolo } from '../dao/repositories/svt/repositoryVeicolo';
import { eVeicolo } from '../entity/svt/eVeicolo';
import { controllerVeicolo } from '../controllers/controllerVeicolo';
import { enumVeicoloTipo } from '../entity/enum/enumVeicoloTipo';
import { serviceVeicolo } from '../services/serviceVeicolo';
import { enumStato } from '../entity/enum/enumStato';

dotenv.config();
const SPEED_TOLLERANCE = process.env.SPEED_TOLLERANCE || 0;

export class middlewareTransito {
  private constructor() {}
  public static checkPermissionRead = async (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> => {
    let ret: retMiddleware = new retMiddleware();
    try {
      if (isNumeric(req.userId)) {
        const isPermit: boolean = await controllerTransito.checkPermission(
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
      logger.error('middlewareTransito.checkPermission :' + error?.message);
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
        const isPermit: boolean = await controllerTransito.checkPermission(
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
      logger.error('middlewareTransito.checkPermission :' + error?.message);
      ret.setResponse(403, { message: 'errore verifica permessi SCRITTURA' });
    }
    ret.returnNext(next);
  };
  public static checkPermissionOperatore = async (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> => {
    let ret: retMiddleware = new retMiddleware();
    try {
      if (isNumeric(req.userId)) {
        const arrayProfili: eProfilo[] | null =
          await serviceUtente.getProfiliByIdUtente(req.userId);
        if (!!arrayProfili && arrayProfili.length) {
          const indexOperatore = arrayProfili.findIndex((obj) => {
            return obj.get_id() === 1;
          });
          if (indexOperatore === -1) {
            ret.setResponse(401, {
              message: 'non si dispongono dei permessi SCRITTURA',
            });
          }
        } else {
          ret.setResponse(403, {
            message: 'errore verifica permessi SCRITTURA',
          });
        }
      } else {
        ret.setResponse(403, {
          message: 'errore verifica permessi SCRITTURA',
        });
      }
    } catch (error: any) {
      logger.error('middlewareTransito.checkPermission :' + error?.message);
      ret.setResponse(403, { message: 'errore verifica permessi SCRITTURA' });
    }
    ret.returnNext(next);
  };
  public static validate = async (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> => {
    let ret: retMiddleware = new retMiddleware();

    let optional: boolean = req.method.toLowerCase() === 'patch';
    let optionalTarga: boolean = optional;
    req.body = Object.assign(
      req.body,
      typeof req.body.metadata === 'string'
        ? JSON.parse(req.body.metadata)
        : req.body.metadata,
    );
    req.body.stato = enumTransitoStato.in_attesa;
    if (optionalTarga === false) {
      if (isNumeric(req.userId)) {
        const arrayProfili: eProfilo[] | null =
          await serviceUtente.getProfiliByIdUtente(req.userId);
        if (!!arrayProfili && arrayProfili.length) {
          const indexVarco = arrayProfili.findIndex((obj) => {
            return obj.get_id() === 3;
          });
          const indexOperatore = arrayProfili.findIndex((obj) => {
            return obj.get_id() === 1;
          });
          if (indexVarco > -1 && indexOperatore === -1) {
            optionalTarga = true;
            req.body.data_transito = new Date().toISOString();
          }
        } else {
          ret.setResponse(400, { message: 'errore nel ricavare i profili' });
          ret.returnNext(next);
        }
        // Aggiungi le varie validazioni
      } else {
        ret.setResponse(403, { message: 'errore nel ricavare i profili' });
        ret.returnNext(next);
      }
    }
    let validations = [
      middlewareValidate.validateNumber('id_varco', optional),
      middlewareValidate.validateStatoTransito('stato', optional),
      middlewareValidate.validateNumber('speed', true),
      middlewareValidate.validateMeteo('meteo', optional),
      //middlewareValidate.validateImageFromReq('immagine', optional),
      middlewareValidate.validateDateISO8601('data_transito', optional),
      middlewareValidate.validateTarga('targa', optionalTarga),
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
      if (!!targa) {
        logger.warn('middlewareTransito.insertTarga : 1');
        const veicolo: eVeicolo | null =
          await repositoryVeicolo.getByTarga(targa);
        if (!!veicolo) {
          logger.warn('middlewareTransito.insertTarga : 2');
          req.body.id_veicolo = veicolo.get_id();
        } else {
          logger.warn('middlewareTransito.insertTarga : 3');
          const tipo: enumVeicoloTipo | null =
            controllerVeicolo.ricavaTipo(targa);
          if (!!tipo) {
            logger.warn('middlewareTransito.insertTarga : 4');
            const veicoloRes: eVeicolo | null =
              await serviceVeicolo.createVeicolo(tipo, targa, enumStato.attivo);
            if (!!veicoloRes) {
              logger.warn('middlewareTransito.insertTarga : 5');
              req.body.id_veicolo = veicoloRes.get_id();
            }
          }
        }
      }
    } catch (error: any) {
      logger.warn('middlewareTransito.insertTarga :' + error?.message);
    }

    ret.returnNext(next);
  };
  public static calculateSpeedReal = (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): void => {
    let ret: retMiddleware = new retMiddleware();
    try {
      //non blocco l'esecuzione se non riesce a ricavare lo speed_real perchè è un dato in più
      const speed: number | null = req.body?.speed;
      if (!!speed) {
        if (isNumeric(SPEED_TOLLERANCE)) {
          req.body.speed_real = speed - (speed * SPEED_TOLLERANCE) / 100;
        }
      }
    } catch (error: any) {
      logger.warn('middlewareTransito.calculateSpeedReal :' + error?.message);
    }

    ret.returnNext(next);
  };
}
