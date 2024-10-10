import dotenv from 'dotenv';
import logger from '../utils/logger-winston';
import { Request, Response, NextFunction } from 'express';
import { retMiddleware } from '../utils/retMiddleware';
import {
  body,
  check,
  ValidationChain,
  validationResult,
} from 'express-validator';
import { enumStato } from '../entity/enum/enumStato';
import { enumVeicoloTipo } from '../entity/enum/enumVeicoloTipo';
import { enumTransitoStato } from '../entity/enum/enumTransitoStato';
import { enumMeteoTipo } from '../entity/enum/enumMeteoTipo';
import { parseISO } from 'date-fns'; // Opzionale, per gestire meglio la data

dotenv.config();

export class middlewareValidate {
  private constructor() {}
  public static validateTarga = (
    campo: string,
    optional: boolean,
    callback: Function = body,
  ): ValidationChain => {
    let ret: ValidationChain = callback(campo)
      .matches(/^(?=.*[A-Z])(?=.*[0-9])[A-Z0-9]+$/)
      .withMessage(
        'La targa deve contenere solo lettere maiuscole (A-Z) e numeri (0-9)',
      )
      .isLength({ min: 5, max: 10 })
      .withMessage(
        'La targa deve avere una lunghezza compresa tra 5 e 10 caratteri',
      );
    return optional ? ret.optional() : ret;
  };
  public static validateStato = (
    campo: string,
    optional: boolean,
    callback: Function = body,
  ): ValidationChain => {
    let ret: ValidationChain = callback(campo).custom((value: any) => {
      if (!Object.values(enumStato).includes(value)) {
        throw new Error('Stato non valido');
      }
      return true;
    });
    return optional ? ret.optional() : ret;
  };
  public static validateStatoTransito = (
    campo: string,
    optional: boolean,
    callback: Function = body,
  ): ValidationChain => {
    let ret: ValidationChain = callback(campo).custom((value: any) => {
      if (!Object.values(enumTransitoStato).includes(value)) {
        throw new Error('Stato transito non valido');
      }
      return true;
    });
    return optional ? ret.optional() : ret;
  };
  public static validateMeteo = (
    campo: string,
    optional: boolean,
    callback: Function = body,
  ): ValidationChain => {
    let ret: ValidationChain = callback(campo).custom((value: any) => {
      if (!Object.values(enumMeteoTipo).includes(value)) {
        throw new Error('Meteo non valido');
      }
      return true;
    });
    return optional ? ret.optional() : ret;
  };
  public static validateTipoVeicolo = (
    campo: string,
    optional: boolean,
    callback: Function = body,
  ): ValidationChain => {
    let ret: ValidationChain = callback(campo).custom((value: any) => {
      if (!Object.values(enumVeicoloTipo).includes(value)) {
        throw new Error('Tipo veicolo non valido');
      }
      return true;
    });
    return optional ? ret.optional() : ret;
  };
  public static validateString = (
    campo: string,
    optional: boolean,
    callback: Function = body,
  ): ValidationChain => {
    let ret: ValidationChain = callback(campo)
      .trim()
      .notEmpty()
      .withMessage(`${campo} non può essere vuoto.`);
    return optional ? ret.optional() : ret;
  };
  public static validateLatitudine = (
    campo: string,
    optional: boolean,
    callback: Function = body,
  ): ValidationChain => {
    let ret: ValidationChain = callback(campo)
      .isFloat({ min: -90, max: 90 })
      .withMessage('La latitudine deve essere compresa tra -90 e 90');
    return optional ? ret.optional() : ret;
  };
  public static validateLongitudine = (
    campo: string,
    optional: boolean,
    callback: Function = body,
  ): ValidationChain => {
    let ret: ValidationChain = callback(campo)
      .isFloat({ min: -180, max: 180 })
      .withMessage('La latitudine deve essere compresa tra -180 e 180');
    return optional ? ret.optional() : ret;
  };
  public static handleValidationErrors = (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): void => {
    let ret: retMiddleware = new retMiddleware();
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        ret.setResponse(400, { message: errors.array() });
      }
    } catch (error: any) {
      logger.error(
        'middlewareValidate.handleValidationErrors:' + error?.message,
      );
      ret.setResponse(400, { message: 'errore handleValidationErrors' });
    }
    ret.returnNext(next);
  };
  public static validateNumber = (
    campo: string,
    optional: boolean,
    callback: Function = body,
  ): ValidationChain => {
    let ret: ValidationChain = callback(campo)
      .isNumeric()
      .withMessage('Il valore deve essere un numero')
      .custom((value: any) => {
        if (value <= 0) {
          throw new Error('Il valore deve essere maggiore di 0');
        }
        return true;
      });
    return optional ? ret.optional() : ret;
  };
  public static validateImageFromReq = (
    campo: string,
    optional: boolean,
  ): ValidationChain => {
    let ret: ValidationChain = check(campo).custom((_value, { req }) => {
      if (!req.file) {
        throw new Error('Il file è obbligatorio');
      }
      return true;
    });
    return optional ? ret.optional() : ret;
  };
  public static validateDateISO8601 = (
    campo: string,
    optional: boolean,
    callback: Function = body,
  ): ValidationChain => {
    let ret: ValidationChain = callback(campo)
      .isISO8601()
      .withMessage(
        'La data deve essere in formato ISO 8601 (es: 2024-10-06T19:09:00).',
      )
      .bail() // Ferma ulteriori validazioni se il formato è errato
      .custom((value: any) => {
        const dataTransito = parseISO(value); // Converte la stringa in oggetto Date
        const now = new Date(); // Ottieni la data corrente

        if (dataTransito > now) {
          throw new Error('La data non può essere nel futuro.');
        }

        return true; // La data è valida e non è futura
      });
    return optional ? ret.optional() : ret;
  };
  public static validateDate = (
    campo: string,
    optional: boolean,
    callback: Function = body,
  ): ValidationChain => {
    let ret: ValidationChain = callback(campo)
      .isDate()
      .withMessage('La data non è valida')
      .isAfter(new Date().toISOString()) // Assicura che la data sia nel futuro
      .withMessage('La data deve essere nel futuro');
    return optional ? ret.optional() : ret;
  };
  public static validateVeicoloTipo = (
    campo: string,
    optional: boolean,
    callback: Function = body,
  ): ValidationChain => {
    let ret: ValidationChain = callback(campo).custom((value: any) => {
      if (!Object.values(enumVeicoloTipo).includes(value)) {
        throw new Error('Tipo veicolo non valido');
      }
      return true;
    });
    return optional ? ret.optional() : ret;
  };
}
