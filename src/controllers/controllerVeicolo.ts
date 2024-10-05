import dotenv from 'dotenv';
import logger from '../utils/logger-winston';
import { serviceUtente } from '../services/serviceUtente';
import { serviceVeicolo } from '../services/serviceVeicolo';
import { enumPermessoTipo } from '../entity/enum/enumPermessoTipo';
import { enumPermessoCategoria } from '../entity/enum/enumPermessoCategoria';
import { Request, Response, NextFunction } from 'express';
import { retMiddleware } from '../utils/retMiddleware';
import { StringisNumeric } from '../utils/utils';
import { eVeicolo } from '../entity/vst/eVeicolo';
import { enumStato } from '../entity/enum/enumStato';
import { enumVeicoloTipo } from '../entity/enum/enumVeicoloTipo';

dotenv.config();

interface iEVeicolo {
  tipo: enumVeicoloTipo;
  targa: string;
  stato: enumStato;
}

export class controllerVeicolo {
  private constructor() {}
  public static checkPermission = async (
    idUtente: number,
    tipoPermesso: enumPermessoTipo,
  ): Promise<boolean> => {
    let ret: boolean = false;
    try {
      ret = await serviceUtente.hasPermessoByIdUtente(
        idUtente,
        enumPermessoCategoria.veicolo,
        tipoPermesso,
      );
    } catch (error: any) {
      logger.error('controllerVeicolo.checkPermission :' + error?.message);
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
      const veicoli: eVeicolo[] = await serviceVeicolo.getAllVeicoli();
      if (!!veicoli) {
        ret.setResponse(200, veicoli);
      } else {
        ret.setResponse(404, { message: 'errore caricamento veicoli' });
      }
    } catch (error: any) {
      logger.error('controllerVeicolo.getAll :' + error?.message);
      ret.setResponse(500, { message: 'errore caricamento veicoli' });
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
        const veicolo: eVeicolo | null = await serviceVeicolo.getVeicoloById(
          parseInt(req.params.id),
        );
        if (!!veicolo) {
          ret.setResponse(200, veicolo);
        } else {
          ret.setResponse(404, { message: 'veicolo non presente' });
        }
      } else {
        ret.setResponse(400, { message: 'chiave non presente' });
      }
    } catch (error: any) {
      logger.error('controllerVeicolo.getById :' + error?.message);
      ret.setResponse(500, { message: 'errore caricamento veicolo' });
    }
    ret.returnResponseJson(res, next);
  };
  public static saveVeicolo = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    let ret: retMiddleware = new retMiddleware();
    try {
      const veicolo = req.body as iEVeicolo | null;
      console.log(veicolo);
      if (!!veicolo) {
        const veicoloRes: eVeicolo | null = await serviceVeicolo.createVeicolo(
          veicolo?.tipo,
          veicolo?.targa,
          veicolo?.stato,
        );
        console.log(veicoloRes);
        if (!!veicoloRes) {
          ret.setResponse(200, veicoloRes);
        } else {
          ret.setResponse(400, { message: 'errore inserimento veicolo' });
        }
      } else {
        ret.setResponse(400, { message: 'oggetto non presente' });
      }
    } catch (error: any) {
      logger.error('controllerVeicolo.saveVeicoli :' + error?.message);
      ret.setResponse(500, { message: 'errore salvataggio veicolo' });
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
        const idVeicolo: number = parseInt(req.params.id);
        const veicolo: eVeicolo | null =
          await serviceVeicolo.getVeicoloById(idVeicolo);
        if (!!veicolo) {
          await serviceVeicolo.deleteVeicolo(idVeicolo);
          ret.setResponse(200, veicolo);
        } else {
          ret.setResponse(404, { message: 'veicolo non presente' });
        }
      } else {
        ret.setResponse(400, { message: 'chiave non presente' });
      }
    } catch (error: any) {
      logger.error('controllerVeicolo.deleteById :' + error?.message);
      ret.setResponse(500, { message: 'errore caricamento veicolo' });
    }
    ret.returnResponseJson(res, next);
  };
  public static putVeicolo = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    let ret: retMiddleware = new retMiddleware();
    try {
      if (StringisNumeric(req.params.id)) {
        const idVeicolo: number = parseInt(req.params.id);
        const veicoloReq = req.body as iEVeicolo | null;
        if (!!veicoloReq) {
          await serviceVeicolo.updateVeicolo(
            idVeicolo,
            veicoloReq?.tipo,
            veicoloReq?.targa,
            veicoloReq?.stato,
          );
          const veicolo: eVeicolo | null =
            await serviceVeicolo.getVeicoloById(idVeicolo);
          if (!!veicolo) {
            ret.setResponse(200, veicolo);
          } else {
            ret.setResponse(404, { message: 'errore update veicolo' });
          }
        } else {
          ret.setResponse(400, { message: 'dati per update non presenti' });
        }
      } else {
        ret.setResponse(400, { message: 'chiave non presente' });
      }
    } catch (error: any) {
      logger.error('controllerVeicolo.putveicolo :' + error?.message);
      ret.setResponse(500, { message: 'errore caricamento veicolo' });
    }
    ret.returnResponseJson(res, next);
  };
  public static patchVeicolo = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    let ret: retMiddleware = new retMiddleware();
    try {
      if (StringisNumeric(req.params.id)) {
        const idVeicolo: number = parseInt(req.params.id);
        const veicoloReq = req.body as Partial<iEVeicolo> | null;
        if (!!veicoloReq) {
          let veicolo: eVeicolo | null =
            await serviceVeicolo.getVeicoloById(idVeicolo);
          if (!!veicolo) {
            let trovato: boolean = false;
            if (veicoloReq.tipo) {
              veicolo.set_tipo(veicoloReq.tipo);
              trovato = true;
            }
            if (veicoloReq.targa) {
              veicolo.set_targa(veicoloReq.targa);
              trovato = true;
            }
            if (veicoloReq.stato) {
              veicolo.set_stato(veicoloReq.stato);
              trovato = true;
            }
            if (!!trovato) {
              await serviceVeicolo.updateVeicolo(
                idVeicolo,
                veicolo?.get_tipo(),
                veicolo?.get_targa(),
                veicolo?.get_stato(),
              );
              const veicoloRes: eVeicolo | null =
                await serviceVeicolo.getVeicoloById(idVeicolo);
              if (!!veicoloRes) {
                ret.setResponse(200, veicoloRes);
              } else {
                ret.setResponse(404, { message: 'errore update veicolo' });
              }
            } else {
              ret.setResponse(400, {
                message: 'nessun parametro per aggiornare il veicolo',
              });
            }
          } else {
            ret.setResponse(400, { message: 'errore update veicolo' });
          }
        } else {
          ret.setResponse(400, { message: 'dati per update non presenti' });
        }
      } else {
        ret.setResponse(400, { message: 'chiave non presente' });
      }
    } catch (error: any) {
      logger.error('controllerVeicolo.patchveicolo :' + error?.message);
      ret.setResponse(500, { message: 'errore caricamento veicolo' });
    }
    ret.returnResponseJson(res, next);
  };
}
