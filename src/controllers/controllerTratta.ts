import dotenv from 'dotenv';
import logger from '../utils/logger-winston';
import { serviceUtente } from '../services/serviceUtente';
import { serviceTratta } from '../services/serviceTratta';
import { enumPermessoTipo } from '../entity/enum/enumPermessoTipo';
import { enumPermessoCategoria } from '../entity/enum/enumPermessoCategoria';
import { Request, Response, NextFunction } from 'express';
import { retMiddleware } from '../utils/retMiddleware';
import { StringisNumeric } from '../utils/utils';
import { eTratta } from '../entity/vst/eTratta';
import { enumStato } from '../entity/enum/enumStato';

dotenv.config();

interface iETratta {
  cod: string;
  descrizione: string;
  id_varco_ingresso: number;
  id_varco_uscita: number;
  distanza: number;
  stato: enumStato;
}

export class trattaController {
  private constructor() {}
  public static checkPermission = async (
    idUtente: number,
    tipoPermesso: enumPermessoTipo,
  ): Promise<boolean> => {
    let ret: boolean = false;
    try {
      ret = await serviceUtente.hasPermessoByIdUtente(
        idUtente,
        enumPermessoCategoria.tratta,
        tipoPermesso,
      );
    } catch (error: any) {
      logger.error('trattaController.checkPermission :' + error?.message);
      ret = false;
    }
    return ret;
  };
  public static getAll = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    let ret: retMiddleware = new retMiddleware();
    try {
      const tratte: eTratta[] = await serviceTratta.getAllTratte();
      if (!!tratte) {
        ret.setResponse(200, tratte);
      } else {
        ret.setResponse(404, { message: 'errore caricamento tratte' });
      }
    } catch (error: any) {
      logger.error('trattaController.getAll :' + error?.message);
      ret.setResponse(500, { message: 'errore caricamento tratte' });
    }
    ret.returnResponseJson(res, next);
  };
  public static getById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    let ret: retMiddleware = new retMiddleware();
    try {
      if (StringisNumeric(req.params.id)) {
        const Tratta: eTratta | null = await serviceTratta.getTrattaById(
          parseInt(req.params.id),
        );
        if (!!Tratta) {
          ret.setResponse(200, Tratta);
        } else {
          ret.setResponse(404, { message: 'Tratta non presente' });
        }
      } else {
        ret.setResponse(400, { message: 'chiave non presente' });
      }
    } catch (error: any) {
      logger.error('trattaController.getById :' + error?.message);
      ret.setResponse(500, { message: 'errore caricamento Tratta' });
    }
    ret.returnResponseJson(res, next);
  };
  public static saveTratta = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    let ret: retMiddleware = new retMiddleware();
    try {
      const Tratta = req.body as iETratta | null;
      if (!!Tratta) {
        const TrattaRes: eTratta | null = await serviceTratta.createTratta(
          Tratta?.cod,
          Tratta?.descrizione,
          Tratta?.id_varco_ingresso,
          Tratta?.id_varco_uscita,
          Tratta?.distanza,
          Tratta?.stato,
        );
        if (!!TrattaRes) {
          ret.setResponse(200, TrattaRes);
        } else {
          ret.setResponse(400, { message: 'errore inserimento Tratta' });
        }
      } else {
        ret.setResponse(400, { message: 'oggetto non presente' });
      }
    } catch (error: any) {
      logger.error('trattaController.saveTratta :' + error?.message);
      ret.setResponse(500, { message: 'errore salvataggio Tratta' });
    }
    ret.returnResponseJson(res, next);
  };
  public static deleteById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    let ret: retMiddleware = new retMiddleware();
    try {
      if (StringisNumeric(req.params.id)) {
        const idTratta: number = parseInt(req.params.id);
        const Tratta: eTratta | null =
          await serviceTratta.getTrattaById(idTratta);
        if (!!Tratta) {
          await serviceTratta.deleteTratta(idTratta);
          ret.setResponse(200, Tratta);
        } else {
          ret.setResponse(404, { message: 'Tratta non presente' });
        }
      } else {
        ret.setResponse(400, { message: 'chiave non presente' });
      }
    } catch (error: any) {
      logger.error('trattaController.deleteById :' + error?.message);
      ret.setResponse(500, { message: 'errore caricamento Tratta' });
    }
    ret.returnResponseJson(res, next);
  };
  public static putTratta = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    let ret: retMiddleware = new retMiddleware();
    try {
      if (StringisNumeric(req.params.id)) {
        const idTratta: number = parseInt(req.params.id);
        const TrattaReq = req.body as iETratta | null;
        if (!!TrattaReq) {
          await serviceTratta.updateTratta(
            idTratta,
            TrattaReq?.cod,
            TrattaReq?.descrizione,
            TrattaReq?.id_varco_ingresso,
            TrattaReq?.id_varco_uscita,
            TrattaReq?.distanza,
            TrattaReq?.stato,
          );
          const Tratta: eTratta | null =
            await serviceTratta.getTrattaById(idTratta);
          if (!!Tratta) {
            ret.setResponse(200, Tratta);
          } else {
            ret.setResponse(404, { message: 'errore update Tratta' });
          }
        } else {
          ret.setResponse(400, { message: 'dati per update non presenti' });
        }
      } else {
        ret.setResponse(400, { message: 'chiave non presente' });
      }
    } catch (error: any) {
      logger.error('trattaController.putTratta :' + error?.message);
      ret.setResponse(500, { message: 'errore caricamento Tratta' });
    }
    ret.returnResponseJson(res, next);
  };
  public static patchTratta = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    let ret: retMiddleware = new retMiddleware();
    try {
      if (StringisNumeric(req.params.id)) {
        const idTratta: number = parseInt(req.params.id);
        const TrattaReq = req.body as Partial<iETratta> | null;
        if (!!TrattaReq) {
          let Tratta: eTratta | null =
            await serviceTratta.getTrattaById(idTratta);
          if (!!Tratta) {
            let trovato: boolean = false;
            if (TrattaReq.cod) {
              Tratta.set_cod(TrattaReq.cod);
              trovato = true;
            }
            if (TrattaReq.descrizione) {
              Tratta.set_descrizione(TrattaReq.descrizione);
              trovato = true;
            }
            if (TrattaReq.id_varco_ingresso) {
              Tratta.set_id_varco_ingresso(TrattaReq.id_varco_ingresso);
              trovato = true;
            }
            if (TrattaReq.id_varco_uscita) {
              Tratta.set_id_varco_uscita(TrattaReq.id_varco_uscita);
              trovato = true;
            }
            if (TrattaReq.distanza) {
              Tratta.set_distanza(TrattaReq.distanza);
              trovato = true;
            }
            if (TrattaReq.stato) {
              Tratta.set_stato(TrattaReq.stato);
              trovato = true;
            }
            if (!!trovato) {
              await serviceTratta.updateTratta(
                idTratta,
                Tratta?.get_cod(),
                Tratta?.get_descrizione(),
                Tratta?.get_id_varco_ingresso(),
                Tratta?.get_id_varco_uscita(),
                Tratta?.get_distanza(),
                Tratta?.get_stato(),
              );
              const TrattaRes: eTratta | null =
                await serviceTratta.getTrattaById(idTratta);
              if (!!TrattaRes) {
                ret.setResponse(200, TrattaRes);
              } else {
                ret.setResponse(404, { message: 'errore update Tratta' });
              }
            } else {
              ret.setResponse(400, {
                message: 'nessun parametro per aggiornare il Tratta',
              });
            }
          } else {
            ret.setResponse(400, { message: 'errore update Tratta' });
          }
        } else {
          ret.setResponse(400, { message: 'dati per update non presenti' });
        }
      } else {
        ret.setResponse(400, { message: 'chiave non presente' });
      }
    } catch (error: any) {
      logger.error('trattaController.patchTratta :' + error?.message);
      ret.setResponse(500, { message: 'errore caricamento Tratta' });
    }
    ret.returnResponseJson(res, next);
  };
}
