import dotenv from 'dotenv';
import logger from '../utils/logger-winston';
import { Request, Response, NextFunction } from 'express';
import { retMiddleware } from '../utils/retMiddleware';
import { body, ValidationChain, validationResult } from 'express-validator';
import { enumStato } from '../entity/enum/enumStato';
import { enumVeicoloTipo } from '../entity/enum/enumVeicoloTipo';

dotenv.config();

export class middlewareValidate {
  private constructor() {}
  public static validateTarga = (
    campo: string,
    optional: boolean,
  ): ValidationChain => {
    let ret: ValidationChain = body(campo)
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
  ): ValidationChain => {
    let ret: ValidationChain = body(campo).custom((value) => {
      if (!Object.values(enumStato).includes(value)) {
        throw new Error('Stato veicolo non valido');
      }
      return true;
    });
    return optional ? ret.optional() : ret;
  };
  public static validateTipoVeicolo = (
    campo: string,
    optional: boolean,
  ): ValidationChain => {
    let ret: ValidationChain = body(campo).custom((value) => {
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
  ): ValidationChain => {
    let ret: ValidationChain = body(campo)
      .trim()
      .notEmpty()
      .withMessage(`${campo} non può essere vuoto.`);
    return optional ? ret.optional() : ret;
  };
  public static validateLatitudine = (
    campo: string,
    optional: boolean,
  ): ValidationChain => {
    let ret: ValidationChain = body(campo)
      .isFloat({ min: -90, max: 90 })
      .withMessage('La latitudine deve essere compresa tra -90 e 90');
    return optional ? ret.optional() : ret;
  };
  public static validateLongitudine = (
    campo: string,
    optional: boolean,
  ): ValidationChain => {
    let ret: ValidationChain = body(campo)
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
}
