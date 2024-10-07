import dotenv from 'dotenv';
import logger from '../utils/logger-winston';
import { serviceUtente } from '../services/serviceUtente';
import { serviceTransito } from '../services/serviceTransito';
import { enumPermessoTipo } from '../entity/enum/enumPermessoTipo';
import { enumPermessoCategoria } from '../entity/enum/enumPermessoCategoria';
import { Request, Response, NextFunction } from 'express';
import { retMiddleware } from '../utils/retMiddleware';
import { StringisNumeric } from '../utils/utils';
import { eTransito } from '../entity/svt/eTransito';
import { enumTransitoStato } from '../entity/enum/enumTransitoStato';
import { enumMeteoTipo } from '../entity/enum/enumMeteoTipo';
import sequelize, { Op, col, where } from 'sequelize';
import path from 'path';
import fs from 'fs';

dotenv.config();
const IMAGE_PATH = process.env.IMAGE_PATH || '.img';

interface iETransito {
  data_transito: Date;
  id_varco: number;
  stato: enumTransitoStato;
  speed?: number | null;
  speed_real?: number | null;
  meteo?: enumMeteoTipo | null;
  id_veicolo?: number | null;
  path_immagine?: string | null;
}

export class controllerTransito {
  private constructor() {}
  public static checkPermission = async (
    idUtente: number,
    tipoPermesso: enumPermessoTipo,
  ): Promise<boolean> => {
    let ret: boolean = false;
    try {
      ret = await serviceUtente.hasPermessoByIdUtente(
        idUtente,
        enumPermessoCategoria.transito,
        tipoPermesso,
      );
    } catch (error: any) {
      logger.error('controllerTransito.checkPermission :' + error?.message);
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
      const idVarco: string | undefined = req.query.id_varco as string;
      // Se il parametro 'id_varco' esiste, splitto per ottenere l'array
      const idsArray: string[] = idVarco ? idVarco.split(',') : [];

      const statoTansito: string | undefined = req.query.stato as string;
      // Se il parametro 'stato' esiste, splitto per ottenere l'array
      const statoTansitosArray: string[] = statoTansito
        ? statoTansito.split(',')
        : [];

      let varchi: eTransito[] = [];
      if (idsArray.length > 0 || statoTansitosArray.length > 0) {
        let ricerca: sequelize.Utils.Where[] = [];
        if (idsArray.length > 0) {
          ricerca.push(
            where(
              col('id_varco'), // Funzione LOWER su identificativo
              { [Op.in]: idsArray }, // Usare Op.in con valori in lowercase
            ),
          );
        }
        if (statoTansitosArray.length > 0) {
          ricerca.push(
            where(
              col('stato'), // Funzione LOWER su identificativo
              { [Op.in]: statoTansitosArray }, // Usare Op.in con valori in lowercase
            ),
          );
        }
        varchi = await serviceTransito.getAllTransiti({
          where: {
            [Op.and]: ricerca,
          },
        });
      } else {
        varchi = await serviceTransito.getAllTransiti();
      }
      if (!!varchi) {
        ret.setResponse(200, varchi);
      } else {
        ret.setResponse(404, { message: 'errore caricamento varchi' });
      }
    } catch (error: any) {
      logger.error('controllerTransito.getAll :' + error?.message);
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
        const transito: eTransito | null =
          await serviceTransito.getTransitoById(parseInt(req.params.id));
        if (!!transito) {
          ret.setResponse(200, transito);
        } else {
          ret.setResponse(404, { message: 'transito non presente' });
        }
      } else {
        ret.setResponse(400, { message: 'chiave non presente' });
      }
    } catch (error: any) {
      logger.error('controllerTransito.getById :' + error?.message);
      ret.setResponse(500, { message: 'errore caricamento transito' });
    }
    ret.returnResponseJson(res, next);
  };
  public static saveTransito = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    let ret: retMiddleware = new retMiddleware();
    try {
      const transito = req.body as iETransito | null;
      if (!!transito) {
        const transitoRes: eTransito | null =
          await serviceTransito.createTransito(
            transito?.data_transito,
            transito?.id_varco,
            transito?.stato,
            transito?.speed,
            transito?.speed_real,
            transito?.meteo,
            transito?.id_veicolo,
            transito?.path_immagine,
          );
        if (!!transitoRes) {
          ret.setResponse(200, transitoRes);
        } else {
          ret.setResponse(400, { message: 'errore inserimento transito' });
        }
      } else {
        ret.setResponse(400, { message: 'oggetto non presente' });
      }
    } catch (error: any) {
      logger.error('controllerTransito.saveTransito :' + error?.message);
      ret.setResponse(500, { message: 'errore salvataggio transito' });
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
        const idTransito: number = parseInt(req.params.id);
        const transito: eTransito | null =
          await serviceTransito.getTransitoById(idTransito);
        if (!!transito) {
          await serviceTransito.deleteTransito(idTransito);
          ret.setResponse(200, transito);
        } else {
          ret.setResponse(404, { message: 'transito non presente' });
        }
      } else {
        ret.setResponse(400, { message: 'chiave non presente' });
      }
    } catch (error: any) {
      logger.error('controllerTransito.deleteById :' + error?.message);
      ret.setResponse(500, { message: 'errore caricamento transito' });
    }
    ret.returnResponseJson(res, next);
  };
  public static putTransito = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    let ret: retMiddleware = new retMiddleware();
    try {
      if (StringisNumeric(req.params.id)) {
        const idTransito: number = parseInt(req.params.id);
        const transitoReq = req.body as iETransito | null;

        if (!!transitoReq) {
          await serviceTransito.updateTransito(
            idTransito,
            transitoReq?.data_transito,
            transitoReq?.id_varco,
            transitoReq?.stato,
            transitoReq?.speed,
            transitoReq?.speed_real,
            transitoReq?.meteo,
            transitoReq?.id_veicolo,
            transitoReq?.path_immagine,
          );
          const transito: eTransito | null =
            await serviceTransito.getTransitoById(idTransito);
          if (!!transito) {
            ret.setResponse(200, transito);
          } else {
            ret.setResponse(404, { message: 'errore update transito' });
          }
        } else {
          ret.setResponse(400, { message: 'dati per update non presenti' });
        }
      } else {
        ret.setResponse(400, { message: 'chiave non presente' });
      }
    } catch (error: any) {
      logger.error('controllerTransito.putTransito :' + error?.message);
      ret.setResponse(500, { message: 'errore caricamento transito' });
    }
    ret.returnResponseJson(res, next);
  };
  public static patchTransito = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    let ret: retMiddleware = new retMiddleware();
    try {
      if (StringisNumeric(req.params.id)) {
        const idTransito: number = parseInt(req.params.id);
        const transitoReq = req.body as Partial<iETransito> | null;
        if (!!transitoReq) {
          let transito: eTransito | null =
            await serviceTransito.getTransitoById(idTransito);
          if (!!transito) {
            let trovato: boolean = false;
            if (transitoReq.data_transito) {
              transito.set_data_transito(transitoReq.data_transito);
              trovato = true;
            }
            if (transitoReq.id_varco) {
              transito.set_id_varco(transitoReq.id_varco);
              trovato = true;
            }
            if (transitoReq.stato) {
              transito.set_stato(transitoReq.stato);
              trovato = true;
            }
            if (transitoReq.speed) {
              transito.set_speed(transitoReq.speed);
              trovato = true;
            }
            if (transitoReq.speed_real) {
              transito.set_speed_real(transitoReq.speed_real);
              trovato = true;
            }
            if (transitoReq.meteo) {
              transito.set_meteo(transitoReq.meteo);
              trovato = true;
            }
            if (transitoReq.id_veicolo) {
              transito.set_id_veicolo(transitoReq.id_veicolo);
              trovato = true;
            }
            if (transitoReq.path_immagine) {
              transito.set_path_immagine(transitoReq.path_immagine);
              trovato = true;
            }
            if (!!trovato) {
              await serviceTransito.updateTransito(
                idTransito,
                transito?.get_data_transito(),
                transito?.get_id_varco(),
                transito?.get_stato(),
                transito?.get_speed(),
                transito?.get_speed_real(),
                transito?.get_meteo(),
                transito?.get_id_veicolo(),
                transito?.get_path_immagine(),
              );
              const transitoRes: eTransito | null =
                await serviceTransito.getTransitoById(idTransito);
              if (!!transitoRes) {
                ret.setResponse(200, transitoRes);
              } else {
                ret.setResponse(404, { message: 'errore update transito' });
              }
            } else {
              ret.setResponse(400, {
                message: 'nessun parametro per aggiornare il transito',
              });
            }
          } else {
            ret.setResponse(400, { message: 'errore update transito' });
          }
        } else {
          ret.setResponse(400, { message: 'dati per update non presenti' });
        }
      } else {
        ret.setResponse(400, { message: 'chiave non presente' });
      }
    } catch (error: any) {
      logger.error('controllerTransito.patchTransito :' + error?.message);
      ret.setResponse(500, { message: 'errore caricamento transito' });
    }
    ret.returnResponseJson(res, next);
  };
  public static download = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    let ret: retMiddleware = new retMiddleware();
    let transferComplete: boolean = false;
    try {
      if (StringisNumeric(req.params.id)) {
        const transito: eTransito | null =
          await serviceTransito.getTransitoById(parseInt(req.params.id));
        if (!!transito) {
          // Percorso assoluto del file da scaricare
          const filePath = path.join(
            IMAGE_PATH,
            transito.get_path_immagine() || '',
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
          ret.setResponse(404, { message: 'transito non presente' });
        }
      } else {
        ret.setResponse(400, { message: 'chiave non presente' });
      }
    } catch (error: any) {
      logger.error('controllerTransito.download :' + error?.message);
      ret.setResponse(500, { message: 'errore caricamento transito' });
    }
    if (transferComplete === false) {
      ret.returnResponseJson(res, next);
    }
  };
}
