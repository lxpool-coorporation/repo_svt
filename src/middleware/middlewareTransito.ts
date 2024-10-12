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
import { enumVeicoloTipo } from '../entity/enum/enumVeicoloTipo';
import path from 'path';
import { controllerOcr } from '../controllers/controllerOcr';

dotenv.config();
let SPEED_TOLLERANCE = process.env.SPEED_TOLLERANCE || 0;
const IMAGE_PATH = process.env.IMAGE_PATH || '.img';

/**
 *
 *
 * @export
 * @class middlewareTransito
 */
export class middlewareTransito {
  /**
   * Creates an instance of middlewareTransito.
   * @memberof middlewareTransito
   */
  private constructor() {}
  /**
   *
   *
   * @static
   * @param {Request} req
   * @param {Response} _res
   * @param {NextFunction} next
   * @memberof middlewareTransito
   */
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
  /**
   *
   *
   * @static
   * @param {Request} req
   * @param {Response} _res
   * @param {NextFunction} next
   * @memberof middlewareTransito
   */
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
  /**
   *
   *
   * @static
   * @param {Request} req
   * @param {Response} _res
   * @param {NextFunction} next
   * @memberof middlewareTransito
   */
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
  /**
   *
   *
   * @static
   * @param {Request} req
   * @param {Response} _res
   * @param {NextFunction} next
   * @memberof middlewareTransito
   */
  public static rebuildBody = async (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> => {
    let ret: retMiddleware = new retMiddleware();

    try {
      // con l'uso di multer il body potrebbe essere vuoto, unisco i dati del body se aggiunti dal middleware con i metadati
      req.body = Object.assign(
        req.body,
        typeof req.body.metadata === 'string'
          ? JSON.parse(req.body.metadata)
          : req.body.metadata,
      );
      // imposto lo stato se si tratta di una insert
      if (req.method.toLowerCase() === 'post') {
        req.body.stato = enumTransitoStato.in_attesa;
      }

      // se il tipo veicolo non mi arriva nella request lo imposto indefinito
      if (!req.body.veicolo_tipo) {
        req.body.veicolo_tipo = enumVeicoloTipo.indefinito;
      }
    } catch (error: any) {
      logger.error('middlewareTransito.rebuildBody :' + error?.message);
      ret.setResponse(400, { message: 'errore lettura body' });
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
   * @memberof middlewareTransito
   */
  public static validate = async (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> => {
    let ret: retMiddleware = new retMiddleware();
    // per il metodo patch i controlli devono essere effettuati solo se il campo esiste
    let optional: boolean = req.method.toLowerCase() === 'patch';
    let optionalImmagine: boolean =
      req.method.toLowerCase() === 'put' ||
      req.method.toLowerCase() === 'patch';
    let optionalTarga: boolean = optional;

    // verifico se l'utente ha ruolo varco, in questo caso imposto la data con l'ora del server e rendo opzionale la targa prima dei controlli
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
      middlewareValidate.validateImageFromReq('immagine', optionalImmagine),
      middlewareValidate.validateDateISO8601('data_transito', optional),
      middlewareValidate.validateTarga('targa', optionalTarga),
      middlewareValidate.validateVeicoloTipo('veicolo_tipo', optional),
    ];

    // Esegui le validazioni
    Promise.all(validations.map((validation) => validation.run(req))).then(
      () => {
        ret.returnNext(next);
      },
    );
  };
  /**
   *
   *
   * @static
   * @param {Request} req
   * @param {Response} _res
   * @param {NextFunction} next
   * @memberof middlewareTransito
   */
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
  /**
   *
   *
   * @static
   * @param {Request} req
   * @param {Response} _res
   * @param {NextFunction} next
   * @memberof middlewareTransito
   */
  public static ocrTarga = async (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> => {
    let ret: retMiddleware = new retMiddleware();
    try {
      //non blocco l'esecuzione se non riesce a inserire la targa tanto l'ocr verificherà anche questa
      let targa: string | null = req.body?.targa;
      if (!targa) {
        const filePath = path.join(IMAGE_PATH, req.body?.path_immagine || '');
        targa = await controllerOcr.detectAndRecognizePlate(filePath);
        if (targa === '') {
          req.body.stato = enumTransitoStato.indefinito;
        } else {
          req.body.targa = targa;
          const targaRegex = /^(?=.*[A-Z])(?=.*[0-9])[A-Z0-9]+$/;
          if (targaRegex.test(targa) === false) {
            req.body.stato = enumTransitoStato.in_attesa;
          }
        }
      }
    } catch (error: any) {
      logger.warn('middlewareTransito.ocrTarga :' + error?.message);
    }

    ret.returnNext(next);
  };
}
