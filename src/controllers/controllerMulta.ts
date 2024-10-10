import dotenv from 'dotenv';
import logger from '../utils/logger-winston';
import { serviceUtente } from '../services/serviceUtente';
import { enumPermessoTipo } from '../entity/enum/enumPermessoTipo';
import { enumPermessoCategoria } from '../entity/enum/enumPermessoCategoria';
import { Request, Response, NextFunction } from 'express';
import { retMiddleware } from '../utils/retMiddleware';
import { eMulta } from '../entity/svt/eMulta';
//import { serviceMulta } from '../services/serviceMulta';

dotenv.config();

export class controllerMulta {
  private constructor() {}
  public static checkPermission = async (
    idUtente: number,
    tipoPermesso: enumPermessoTipo,
  ): Promise<boolean> => {
    let ret: boolean = false;
    try {
      ret = await serviceUtente.hasPermessoByIdUtente(
        idUtente,
        enumPermessoCategoria.multa,
        tipoPermesso,
      );
    } catch (error: any) {
      logger.error('controllerMulta.checkPermission :' + error?.message);
      ret = false;
    }
    return ret;
  };
  public static getAll = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    let ret: retMiddleware = new retMiddleware();
    try {
      const idTarghe: string | undefined = req.query.targa as string;
      // Se il parametro 'id_varco' esiste, splitto per ottenere l'array
      const arrayTarghe: string[] = idTarghe ? idTarghe.split(',') : [];

      const dataInizioString: string | undefined = req.query
        .data_inizio as string;
      const dataFineString: string | undefined = req.query.data_fine as string;
      // Se il parametro 'stato' esiste, splitto per ottenere l'array
      const format: string | undefined = req.query.format as string;

      let varchi: eMulta[] = [];
      if (arrayTarghe.length > 0 || arrayTarghe.length > 0) {
        console.log(arrayTarghe);
        console.log(dataInizioString);
        console.log(dataFineString);
        console.log(format);
        /*
         */
      } else {
        ret.setResponse(400, {
          message: 'errore caricamento multe, nessuna targa da cercare',
        });
      }
      if (!!varchi) {
        ret.setResponse(200, varchi);
      } else {
        ret.setResponse(404, { message: 'errore caricamento multe' });
      }
    } catch (error: any) {
      logger.error('controllerMulta.getAll :' + error?.message);
      ret.setResponse(500, { message: 'errore caricamento multe' });
    }
    ret.returnResponseJson(res, next);
  };
}
