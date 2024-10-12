import dotenv from 'dotenv';
import logger from '../utils/logger-winston';
import { serviceUtente } from '../services/serviceUtente';
import { enumPermessoTipo } from '../entity/enum/enumPermessoTipo';
import { enumPermessoCategoria } from '../entity/enum/enumPermessoCategoria';
import { Request, Response, NextFunction } from 'express';
import { retMiddleware } from '../utils/retMiddleware';
import { isNumeric, isString } from '../utils/utils';
import { serviceMulta } from '../services/serviceMulta';
import { eBollettino } from '../entity/svt/eBollettino';
import fs from 'fs';
import path from 'path';
import { enumExportFormato } from '../entity/enum/enumExportFormato';

dotenv.config();
const IMAGE_FILE = process.env.IMAGE_FILE || '.pdf';

/**
 *
 *
 * @export
 * @class controllerMulta
 */
export class controllerMulta {
  /**
   * Creates an instance of controllerMulta.
   * @memberof controllerMulta
   */
  private constructor() {}
  /**
   *
   *
   * @static
   * @param {number} idUtente
   * @param {enumPermessoTipo} tipoPermesso
   * @memberof controllerMulta
   */
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
  /**
   *
   *
   * @static
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof controllerMulta
   */
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
      let userId: number = 0;
      let multeResult: string | null = null;
      if (arrayTarghe.length > 0 || (arrayTarghe.length > 0 && req.userId)) {
        if (isNumeric(req.userId)) {
          userId = req.userId;
          const formatoEnum = format as enumExportFormato;
          multeResult = await serviceMulta.getAllMulteExport(
            formatoEnum,
            new Date(dataInizioString),
            new Date(dataFineString),
            arrayTarghe,
            userId,
          );
        }

        /*
         */
      } else {
        ret.setResponse(400, {
          message: 'errore caricamento multe, nessuna targa da cercare',
        });
      }
      if (!!multeResult) {
        ret.setResponse(200, multeResult);
      } else {
        ret.setResponse(404, { message: 'errore caricamento multe' });
      }
    } catch (error: any) {
      logger.error('controllerMulta.getAll :' + error?.message);
      ret.setResponse(500, { message: 'errore caricamento multe' });
    }
    ret.returnResponseJson(res, next);
  };

  /**
   *
   *
   * @static
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof controllerMulta
   */
  public static download = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    let ret: retMiddleware = new retMiddleware();
    let transferComplete: boolean = false;
    try {
      if (isString(req.params.id)) {
        const bollettino: eBollettino | null =
          await serviceMulta.getBollettinoByUUID(req.params.id);
        if (!!bollettino) {
          // Percorso assoluto del file da scaricare
          const filePath = path.join(
            '/',
            IMAGE_FILE,
            bollettino.get_path_bollettino() || '',
          );
          // Verifica se il file esiste
          if (fs.existsSync(filePath)) {
            // Invia il file al client
            transferComplete = true;
            res.sendFile(filePath, (err) => {
              if (err) {
                transferComplete = false;
                ret.setResponse(500, {
                  message: 'Errore durante il download del file.',
                });
              }
            });
          } else {
            ret.setResponse(404, { message: 'File non trovato.' });
          }
        } else {
          ret.setResponse(404, { message: 'bollettino non presente' });
        }
      } else {
        ret.setResponse(400, { message: 'chiave non presente' });
      }
    } catch (error: any) {
      logger.error('controllerBollettino.download :' + error?.message);
      ret.setResponse(500, { message: 'errore caricamento bollettino' });
    }
    if (transferComplete === false) {
      ret.returnResponseJson(res, next);
    }
  };
}
