import { eTransito, eTransitoBuilder } from '../entity/svt/eTransito';
import { repositoryTransito } from '../dao/repositories/svt/repositoryTransito';
import databaseCache from '../utils/database-cache';
import logger from '../utils/logger-winston';
import { enumTransitoStato } from '../entity/enum/enumTransitoStato';
import { enumMeteoTipo } from '../entity/enum/enumMeteoTipo';
import messenger from '../utils/messenger';
import { enumMessengerCoda } from '../entity/enum/enumMessengerCoda';
import { serviceVarco } from './serviceVarco';
import { eVarco } from '../entity/svt/eVarco';
import { eVeicolo } from '../entity/svt/eVeicolo';
import { enumVeicoloTipo } from '../entity/enum/enumVeicoloTipo';
import { serviceVeicolo } from './serviceVeicolo';
import { enumVeicoloStato } from '../entity/enum/enumVeicoloStato';

/**
 *classe che gestisce la logica di business dell'Transito
 *
 * @class serviceTransitoImplementation
 */
class serviceTransitoImplementation {
  /**
   *Recupera un Transito per ID
   *
   * @param {number} id
   * @return {*}  {(Promise<eTransito | null>)}
   * @memberof serviceTransitoImplementation
   */
  async getTransitoById(id: number): Promise<eTransito | null> {
    try {
      const redisClient = await databaseCache.getInstance();

      const cacheKey = `Transito_${id}`;

      // Controlla se l'Transito è in cache
      const jsonData = await redisClient.get(cacheKey);
      if (jsonData) {
        const data = JSON.parse(jsonData); // Restituisce l'Transito dalla cache
        const cacheObject = eTransito.fromJSON(data); // Assumendo che tu abbia una classe Transito
        return cacheObject;
      }

      // Se non è in cache, recupera dal repository
      const Transito = await repositoryTransito.get(id);
      if (Transito) {
        // Memorizza l'Transito in cache per 1 ora
        await redisClient.set(cacheKey, JSON.stringify(Transito), {
          EX: parseInt(process.env.REDIS_CACHE_TIMEOUT || '3600'),
        });
      }

      return Transito;
    } catch (err) {
      logger.error('serviceSvt - err:', err);
      return null;
    }
  }

  /**
   *Recupera tutti gli Transiti
   *
   * @param {object} [options]
   * @return {*}  {Promise<eTransito[]>}
   * @memberof serviceTransitoImplementation
   */
  async getAllTransiti(options?: object): Promise<eTransito[]> {
    const redisClient = await databaseCache.getInstance();

    const cacheKey = 'Transiti_tutti';

    //VALUTARE SE USARE QUESTO METODO
    // Controlla se gli Transiti sono in cache
    //const cachedTransiti = await redisClient.get(cacheKey);
    //if (cachedTransiti) {
    //  return JSON.parse(cachedTransiti); // Restituisce gli Transiti dalla cache
    //}

    // Se non sono in cache, recupera dal repository
    const Transiti = await repositoryTransito.getAll(options);
    if (Transiti) {
      // Memorizza gli Transiti in cache per 1 ora
      await redisClient.set(cacheKey, JSON.stringify(Transiti), {
        EX: parseInt(process.env.REDIS_CACHE_TIMEOUT || '3600'),
      });
    }
    return Transiti;
    //return await repositoryTransito.getAll();
  }

  /**
   *
   *
   * @param {object} [options]
   * @return {*}  {Promise<eTransito[]>}
   * @memberof serviceTransitoImplementation
   */
  async getTransitiFromQuery(options?: object): Promise<eTransito[]> {
    return await repositoryTransito.getFromQuery(options);
    //return await repositoryTransito.getAll();
  }

  async getAllTransitiByTarga(targa: string): Promise<eTransito[] | null> {
    return await repositoryTransito.getAllTransitiByTarga(targa);
  }

  /**
   *Crea un nuovo Transito
   *
   * @param {Date} data_transito
   * @param {number} id_varco
   * @param {enumTransitoStato} stato
   * @param {(number | null)} [speed]
   * @param {(number | null)} [speed_real]
   * @param {(enumMeteoTipo | null)} [meteo]
   * @param {(number | null)} [id_veicolo]
   * @param {(string | null)} [path_immagine]
   * @return {*}  {(Promise<eTransito | null>)}
   * @memberof serviceTransitoImplementation
   */
  async createTransito(
    data_transito: Date,
    id_varco: number,
    stato: enumTransitoStato,
    speed?: number | null,
    speed_real?: number | null,
    meteo?: enumMeteoTipo | null,
    id_veicolo?: number | null,
    path_immagine?: string | null,
  ): Promise<eTransito | null> {
    let result: eTransito | null = null;

    try {
      const redisClient = await databaseCache.getInstance();
      const nuovoTransito = new eTransito(
        new eTransitoBuilder()
          .setDataTransito(data_transito)
          .setSpeed(speed)
          .setSpeedReal(speed_real)
          .setIdVarco(id_varco)
          .setMeteo(meteo)
          .setIdVeicolo(id_veicolo)
          .setpath_immagine(path_immagine)
          .setStato(stato),
      );
      const savedTransito = await repositoryTransito.save(nuovoTransito);
      if (savedTransito) {
        await this.refreshTransitoStato(savedTransito);
      }

      result = savedTransito;

      // Invalida la cache degli Transiti
      await redisClient.del(`Transiti_tutti`);
    } catch (err) {
      throw new Error('createTransito: ' + err);
    }

    return result;
  }

  /**
   *Crea un nuovo Transito
   *
   * @param {Date} data_transito
   * @param {string} codice_varco
   * @param {(string | null)} [targa]
   * @param {(string | null)} [tipo_veicolo]
   * @param {(enumMeteoTipo | null)} [meteo]
   * @param {(number | null)} [speed]
   * @param {(string | null)} [path_immagine]
   * @return {*}  {(Promise<eTransito | null>)}
   * @memberof serviceTransitoImplementation
   */
  async createTransitoFromRaw(
    data_transito: Date,
    codice_varco: string,
    targa?: string | null,
    tipo_veicolo?: string | null,
    meteo?: enumMeteoTipo | null,
    speed?: number | null,
    path_immagine?: string | null,
  ): Promise<eTransito | null> {
    let result: eTransito | null = null;

    try {
      const redisClient = await databaseCache.getInstance();

      const objVarco: eVarco | null =
        await serviceVarco.getVarcoByCod(codice_varco);
      if (!objVarco) {
        throw new Error(`Varco ${codice_varco} non trovato`);
      }

      let idVeicolo: number | null = null;

      if (targa) {
        const targaRegex = /^(?=.*[A-Z])(?=.*[0-9])[A-Z0-9]+$/;
        if (targaRegex.test(targa) === false) {
          let objVeicolo: eVeicolo | null =
            await serviceVeicolo.getVeicoloByTarga(targa);
          if (!objVeicolo) {
            // necessario aggiunta veicolo
            let objEnumVeicoloTipo: enumVeicoloTipo =
              enumVeicoloTipo.indefinito;
            let objVeicoloStato: enumVeicoloStato = enumVeicoloStato.in_attesa;
            if (eVeicolo.isTipoVeicoloValid(tipo_veicolo)) {
              objEnumVeicoloTipo = tipo_veicolo as enumVeicoloTipo;
              objVeicoloStato = enumVeicoloStato.acquisito;
            }
            objVeicolo = await serviceVeicolo.createVeicolo(
              objEnumVeicoloTipo,
              targa,
              objVeicoloStato,
            );
            if (objVeicolo) {
              idVeicolo = objVeicolo.get_id();
            }
          } else {
            idVeicolo = objVeicolo.get_id();
          }
        }
      }

      let val_speed_real: number | null = null;
      if (speed) {
        val_speed_real = this.calcolaTolleranza(speed);
      }

      const nuovoTransito = new eTransito(
        new eTransitoBuilder()
          .setDataTransito(data_transito)
          .setSpeed(speed)
          .setSpeedReal(val_speed_real)
          .setIdVarco(objVarco.get_id())
          .setMeteo(meteo)
          .setIdVeicolo(idVeicolo)
          .setpath_immagine(path_immagine)
          .setStato(enumTransitoStato.indefinito),
      );

      const statoTransito: enumTransitoStato =
        this.getTransitoStato(nuovoTransito);
      nuovoTransito.set_stato(statoTransito);

      const savedTransito = await repositoryTransito.save(nuovoTransito);
      if (savedTransito) {
        await this.refreshTransitoStato(savedTransito);
      }

      result = savedTransito;

      // Invalida la cache degli Transiti
      await redisClient.del(`Transiti_tutti`);
    } catch (err) {
      throw new Error('createTransito: ' + err);
    }

    return result;
  }

  /**
   *Funzione per calcolare la tolleranza
   *
   * @param {number} velocita
   * @return {*}  {number}
   * @memberof serviceTransitoImplementation
   */
  calcolaTolleranza(velocita: number): number {
    const tolleranzaPercentuale = velocita * 0.05; // 5% della velocità
    return tolleranzaPercentuale > 5 ? tolleranzaPercentuale : 5; // Usa il massimo tra 5 km/h e il 5% della velocità
  }

  /**
   *Aggiorna un Transito esistente
   *
   * @param {number} id
   * @param {Date} data_transito
   * @param {string} codice_varco
   * @param {(string | null)} [targa]
   * @param {(string | null)} [tipo_veicolo]
   * @param {(enumMeteoTipo | null)} [meteo]
   * @param {(number | null)} [speed]
   * @param {(string | null)} [path_immagine]
   * @return {*}  {Promise<void>}
   * @memberof serviceTransitoImplementation
   */
  async updateTransitoFromRaw(
    id: number,
    data_transito: Date,
    codice_varco: string,
    targa?: string | null,
    tipo_veicolo?: string | null,
    meteo?: enumMeteoTipo | null,
    speed?: number | null,
    path_immagine?: string | null,
  ): Promise<void> {
    const redisClient = await databaseCache.getInstance();

    const objVarco: eVarco | null =
      await serviceVarco.getVarcoByCod(codice_varco);
    if (!objVarco) {
      throw new Error(`Varco ${codice_varco} non trovato`);
    }

    let idVeicolo: number | null = null;

    if (targa) {
      const targaRegex = /^(?=.*[A-Z])(?=.*[0-9])[A-Z0-9]+$/;
      if (targaRegex.test(targa) === false) {
        let objVeicolo: eVeicolo | null =
          await serviceVeicolo.getVeicoloByTarga(targa);
        if (!objVeicolo) {
          // necessario aggiunta veicolo
          let objEnumVeicoloTipo: enumVeicoloTipo = enumVeicoloTipo.indefinito;
          let objVeicoloStato: enumVeicoloStato = enumVeicoloStato.in_attesa;
          if (eVeicolo.isTipoVeicoloValid(tipo_veicolo)) {
            objEnumVeicoloTipo = tipo_veicolo as enumVeicoloTipo;
            objVeicoloStato = enumVeicoloStato.acquisito;
          }
          objVeicolo = await serviceVeicolo.createVeicolo(
            objEnumVeicoloTipo,
            targa,
            objVeicoloStato,
          );
          if (objVeicolo) {
            idVeicolo = objVeicolo.get_id();
          }
        } else {
          idVeicolo = objVeicolo.get_id();
        }
      }
    }

    let val_speed_real: number | null = null;
    if (speed) {
      val_speed_real = this.calcolaTolleranza(speed);
    }

    const Transito = new eTransito(
      new eTransitoBuilder()
        .setId(id)
        .setDataTransito(data_transito)
        .setSpeed(speed)
        .setSpeedReal(val_speed_real)
        .setIdVarco(objVarco.get_id())
        .setMeteo(meteo)
        .setIdVeicolo(idVeicolo)
        .setpath_immagine(path_immagine)
        .setStato(enumTransitoStato.indefinito),
    );

    const statoTransito: enumTransitoStato = this.getTransitoStato(Transito);
    Transito.set_stato(statoTransito);

    await repositoryTransito.update(Transito);

    await this.refreshTransitoStato(Transito);

    // Invalida la cache dell'Transito aggiornato e la cache generale
    await redisClient.del(`Transito_${id}`);
    await redisClient.del('Transiti_tutti');
  }

  /**
   *Aggiorna un Transito esistente
   *
   * @param {number} id
   * @param {Date} data_transito
   * @param {number} id_varco
   * @param {enumTransitoStato} stato
   * @param {(number | null)} [speed]
   * @param {(number | null)} [speed_real]
   * @param {(enumMeteoTipo | null)} [meteo]
   * @param {(number | null)} [id_veicolo]
   * @param {(string | null)} [path_immagine]
   * @return {*}  {Promise<void>}
   * @memberof serviceTransitoImplementation
   */
  async updateTransito(
    id: number,
    data_transito: Date,
    id_varco: number,
    stato: enumTransitoStato,
    speed?: number | null,
    speed_real?: number | null,
    meteo?: enumMeteoTipo | null,
    id_veicolo?: number | null,
    path_immagine?: string | null,
  ): Promise<void> {
    const redisClient = await databaseCache.getInstance();

    const Transito = new eTransito(
      new eTransitoBuilder()
        .setId(id)
        .setDataTransito(data_transito)
        .setSpeed(speed)
        .setSpeedReal(speed_real)
        .setIdVarco(id_varco)
        .setMeteo(meteo)
        .setIdVeicolo(id_veicolo)
        .setpath_immagine(path_immagine)
        .setStato(stato),
    );
    await repositoryTransito.update(Transito);

    await this.refreshTransitoStato(Transito);

    // Invalida la cache dell'Transito aggiornato e la cache generale
    await redisClient.del(`Transito_${id}`);
    await redisClient.del('Transiti_tutti');
  }

  /**
   *
   *
   * @param {eTransito} objTransito
   * @param {Partial<{
   *       data_transito: Date;
   *       speed: number;
   *       speed_real: number;
   *       id_varco: number;
   *       meteo: enumMeteoTipo;
   *       id_veicolo: number;
   *       path_immagine: string;
   *       stato: enumTransitoStato;
   *     }>} fieldsToUpdate
   * @return {*}  {Promise<void>}
   * @memberof serviceTransitoImplementation
   */
  async updateFieldsTransito(
    objTransito: eTransito,
    fieldsToUpdate: Partial<{
      data_transito: Date;
      speed: number;
      speed_real: number;
      id_varco: number;
      meteo: enumMeteoTipo;
      id_veicolo: number;
      path_immagine: string;
      stato: enumTransitoStato;
    }>,
  ): Promise<void> {
    try {
      const redisClient = await databaseCache.getInstance();

      await repositoryTransito.updateFields(objTransito, fieldsToUpdate);
      await this.refreshTransitoStato(objTransito);

      // Invalida la cache dell'Transito aggiornato e la cache generale
      await redisClient.del(`Transito_${objTransito.get_id()}`);
      await redisClient.del('Transiti_tutti');
    } catch (err) {
      throw new Error(`serviceTransito - updateFields: ${err}`);
    }
  }

  /**
   *Elimina un Transito
   *
   * @param {number} id
   * @return {*}  {Promise<void>}
   * @memberof serviceTransitoImplementation
   */
  async deleteTransito(id: number): Promise<void> {
    const redisClient = await databaseCache.getInstance();

    const TransitoDaEliminare = new eTransito(new eTransitoBuilder().setId(id));
    await repositoryTransito.delete(TransitoDaEliminare);

    // Invalida la cache dell'Transito eliminato e la cache generale
    await redisClient.del(`Transito_${id}`);
    await redisClient.del('Transiti_tutti');
  }

  /**
   *
   *
   * @param {eTransito} transito
   * @memberof serviceTransitoImplementation
   */
  public getTransitoStato = (transito: eTransito): enumTransitoStato => {
    let result: enumTransitoStato = enumTransitoStato.indefinito;

    try {
      // Definizione delle regole come array di funzioni
      const rules: Array<() => enumTransitoStato | null> = [
        () => {
          // "non processabile" se manca id_veicolo e path_immagine è null
          if (!transito.get_id_veicolo() && !transito.get_meteo()) {
            return enumTransitoStato.in_attesa;
          } else {
            return null;
          }
        },
        () => {
          // "acquisito" se entrambi id_veicolo e meteo sono valorizzati
          if (transito.get_id_veicolo() && transito.get_meteo()) {
            return enumTransitoStato.elaborato;
          } else {
            return null;
          }
        },
        () => {
          // "acquisito" se entrambi id_veicolo e meteo sono valorizzati
          if (
            !transito.get_id_veicolo() &&
            transito.get_path_immagine() &&
            transito.get_stato() == enumTransitoStato.illeggibile
          ) {
            return enumTransitoStato.illeggibile;
          } else {
            return null;
          }
        },
        () => {
          // "acquisito" se entrambi id_veicolo e meteo sono valorizzati
          if (
            !transito.get_id_veicolo() &&
            transito.get_path_immagine() &&
            transito.get_stato() !== enumTransitoStato.illeggibile
          ) {
            return enumTransitoStato.in_attesa_di_ocr;
          } else {
            return null;
          }
        },
      ];

      // Trova la prima regola che soddisfa la condizione
      let sub_result = rules
        .map((rule) => rule())
        .find((stato) => stato !== null);

      if (sub_result) {
        result = sub_result;
      }

      // Se uno stato è stato determinato, aggiorna il transito
      //if (nuovoStato) {
      //transito.set_stato(nuovoStato);
      //}
    } catch (err) {
      logger.error('serviceSvt - err:', err);
    }

    return result;
  };

  /**
   *
   *
   * @param {eTransito} objTransito
   * @return {*}  {Promise<void>}
   * @memberof serviceTransitoImplementation
   */
  async refreshTransitoStato(objTransito: eTransito): Promise<void> {
    try {
      const statoUpdated: enumTransitoStato =
        this.getTransitoStato(objTransito);

      if (statoUpdated !== objTransito.get_stato()) {
        objTransito.set_stato(statoUpdated);
        await repositoryTransito.updateFields(objTransito, {
          stato: statoUpdated,
        });
      }

      switch (statoUpdated) {
        case enumTransitoStato.in_attesa:
          if (!objTransito.get_meteo()) {
            const rabbitMQ = messenger.getInstance();
            // Connessione a RabbitMQ
            await rabbitMQ.connect();
            // Invia un messaggio alla coda 'tasks_queue'
            await rabbitMQ.sendToQueue(
              enumMessengerCoda.queueTransitoMeteo,
              JSON.stringify(objTransito),
            );
          }
          break;
        case enumTransitoStato.in_attesa_di_ocr:
          if (
            objTransito.get_path_immagine() &&
            !objTransito.get_id_veicolo()
          ) {
            const rabbitMQ = messenger.getInstance();
            // Connessione a RabbitMQ
            await rabbitMQ.connect();
            // Invia un messaggio alla coda 'tasks_queue'
            await rabbitMQ.sendToQueue(
              enumMessengerCoda.queueTransitoOCR,
              JSON.stringify(objTransito),
            );
          }
          break;
        case enumTransitoStato.elaborato:
          const rabbitMQ = messenger.getInstance();
          // Connessione a RabbitMQ
          await rabbitMQ.connect();
          // Invia un messaggio alla coda 'tasks_queue'
          await rabbitMQ.sendToQueue(
            enumMessengerCoda.queueCheckMulta,
            JSON.stringify(objTransito),
          );
          break;

        default:
          break;
      }
    } catch (err) {
      throw new Error(`refreshTransitoStato: ${err}`);
    }
  }
}
export const serviceTransito = new serviceTransitoImplementation();
