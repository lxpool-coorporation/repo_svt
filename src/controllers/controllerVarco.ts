import dotenv from 'dotenv';
import logger from '../utils/logger-winston';
import { serviceUtente } from '../services/serviceUtente';
import { serviceVarco } from '../services/serviceVarco';
import { enumPermessoTipo } from '../entity/enum/enumPermessoTipo';
import { enumPermessoCategoria } from '../entity/enum/enumPermessoCategoria';
import { Request, Response, NextFunction } from 'express';
import { retMiddleware } from '../utils/retMiddleware';
import { StringisNumeric } from '../utils/utils';
import { eVarco } from '../entity/svt/eVarco';
import { enumStato } from '../entity/enum/enumStato';

dotenv.config();

interface iEVarco {
  cod: string;
  descrizione: string;
  latitudine: number;
  longitudine: number;
  stato: enumStato;
}

export class varcoController {
  private constructor() {}
  public static checkPermission = async (
    idUtente: number,
    tipoPermesso: enumPermessoTipo,
  ): Promise<boolean> => {
    let ret: boolean = false;
    try {
      ret = await serviceUtente.hasPermessoByIdUtente(
        idUtente,
        enumPermessoCategoria.varco,
        tipoPermesso,
      );
    } catch (error: any) {
      logger.error('varcoController.checkPermission :' + error?.message);
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
      const varchi: eVarco[] = await serviceVarco.getAllVarchi();
      if (!!varchi) {
        ret.setResponse(200, varchi);
      } else {
        ret.setResponse(404, { message: 'errore caricamento varchi' });
      }
    } catch (error: any) {
      logger.error('varcoController.getAll :' + error?.message);
      ret.setResponse(500, { message: 'errore caricamento varchi' });
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
        const varco: eVarco | null = await serviceVarco.getVarcoById(
          parseInt(req.params.id),
        );
        if (!!varco) {
          ret.setResponse(200, varco);
        } else {
          ret.setResponse(404, { message: 'varco non presente' });
        }
      } else {
        ret.setResponse(400, { message: 'chiave non presente' });
      }
    } catch (error: any) {
      logger.error('varcoController.getById :' + error?.message);
      ret.setResponse(500, { message: 'errore caricamento varco' });
    }
    ret.returnResponseJson(res, next);
  };
  public static saveVarco = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    let ret: retMiddleware = new retMiddleware();
    try {
      const varco = req.body as iEVarco | null;
      if (!!varco) {
        const varcoRes: eVarco | null = await serviceVarco.createVarco(
          varco?.cod,
          varco?.descrizione,
          varco?.latitudine,
          varco?.longitudine,
          varco?.stato,
        );
        if (!!varcoRes) {
          ret.setResponse(200, varcoRes);
        } else {
          ret.setResponse(400, { message: 'errore inserimento varco' });
        }
      } else {
        ret.setResponse(400, { message: 'oggetto non presente' });
      }
    } catch (error: any) {
      logger.error('varcoController.saveVarco :' + error?.message);
      ret.setResponse(500, { message: 'errore salvataggio varco' });
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
        const idVarco: number = parseInt(req.params.id);
        const varco: eVarco | null = await serviceVarco.getVarcoById(idVarco);
        if (!!varco) {
          await serviceVarco.deleteVarco(idVarco);
          ret.setResponse(200, varco);
        } else {
          ret.setResponse(404, { message: 'varco non presente' });
        }
      } else {
        ret.setResponse(400, { message: 'chiave non presente' });
      }
    } catch (error: any) {
      logger.error('varcoController.deleteById :' + error?.message);
      ret.setResponse(500, { message: 'errore caricamento varco' });
    }
    ret.returnResponseJson(res, next);
  };
  public static putVarco = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    let ret: retMiddleware = new retMiddleware();
    try {
      if (StringisNumeric(req.params.id)) {
        const idVarco: number = parseInt(req.params.id);
        const varcoReq = req.body as iEVarco | null;
        if (!!varcoReq) {
          await serviceVarco.updateVarco(
            idVarco,
            varcoReq?.cod,
            varcoReq?.descrizione,
            varcoReq?.latitudine,
            varcoReq?.longitudine,
            varcoReq?.stato,
          );
          const varco: eVarco | null = await serviceVarco.getVarcoById(idVarco);
          if (!!varco) {
            ret.setResponse(200, varco);
          } else {
            ret.setResponse(404, { message: 'errore update varco' });
          }
        } else {
          ret.setResponse(400, { message: 'dati per update non presenti' });
        }
      } else {
        ret.setResponse(400, { message: 'chiave non presente' });
      }
    } catch (error: any) {
      logger.error('varcoController.putVarco :' + error?.message);
      ret.setResponse(500, { message: 'errore caricamento varco' });
    }
    ret.returnResponseJson(res, next);
  };
  public static patchVarco = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    let ret: retMiddleware = new retMiddleware();
    try {
      if (StringisNumeric(req.params.id)) {
        const idVarco: number = parseInt(req.params.id);
        const varcoReq = req.body as Partial<iEVarco> | null;
        if (!!varcoReq) {
          let varco: eVarco | null = await serviceVarco.getVarcoById(idVarco);
          if (!!varco) {
            let trovato: boolean = false;
            if (varcoReq.cod) {
              varco.set_cod(varcoReq.cod);
              trovato = true;
            }
            if (varcoReq.descrizione) {
              varco.set_descrizione(varcoReq.descrizione);
              trovato = true;
            }
            if (varcoReq.latitudine) {
              varco.set_latitudine(varcoReq.latitudine);
              trovato = true;
            }
            if (varcoReq.longitudine) {
              varco.set_longitudine(varcoReq.longitudine);
              trovato = true;
            }
            if (varcoReq.stato) {
              varco.set_stato(varcoReq.stato);
              trovato = true;
            }
            if (!!trovato) {
              await serviceVarco.updateVarco(
                idVarco,
                varco?.get_cod(),
                varco?.get_descrizione(),
                varco?.get_latitudine(),
                varco?.get_longitudine(),
                varco?.get_stato(),
              );
              const varcoRes: eVarco | null =
                await serviceVarco.getVarcoById(idVarco);
              if (!!varcoRes) {
                ret.setResponse(200, varcoRes);
              } else {
                ret.setResponse(404, { message: 'errore update varco' });
              }
            } else {
              ret.setResponse(400, {
                message: 'nessun parametro per aggiornare il varco',
              });
            }
          } else {
            ret.setResponse(400, { message: 'errore update varco' });
          }
        } else {
          ret.setResponse(400, { message: 'dati per update non presenti' });
        }
      } else {
        ret.setResponse(400, { message: 'chiave non presente' });
      }
    } catch (error: any) {
      logger.error('varcoController.patchVarco :' + error?.message);
      ret.setResponse(500, { message: 'errore caricamento varco' });
    }
    ret.returnResponseJson(res, next);
  };
}
