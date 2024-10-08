import { eTransito, eTransitoBuilder } from '../entity/svt/eTransito';
import { repositoryTransito } from '../dao/repositories/svt/repositoryTransito';
import databaseCache from '../utils/database-cache';
import logger from '../utils/logger-winston';
import { enumTransitoStato } from '../entity/enum/enumTransitoStato';
import { enumMeteoTipo } from '../entity/enum/enumMeteoTipo';
import messenger from '@/utils/messenger';
import { enumMessengerCoda } from '@/entity/enum/enumMessengerCoda';

// classe che gestisce la logica di business dell'Transito
class serviceTransitoImplementation {
  // Recupera un Transito per ID
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

  // Recupera tutti gli Transiti
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

  async getTransitiFromQuery(options?: object): Promise<eTransito[]> {
    return await repositoryTransito.getFromQuery(options);
    //return await repositoryTransito.getAll();
  }

  // Crea un nuovo Transito
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
        this.refreshTransito(savedTransito);
      }

      result = savedTransito;

      // Invalida la cache degli Transiti
      await redisClient.del(`Transiti_tutti`);
    } catch (err) {
      throw new Error('createTransito: ' + err);
    }

    return result;
  }

  // Aggiorna un Transito esistente
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

    // Invalida la cache dell'Transito aggiornato e la cache generale
    await redisClient.del(`Transito_${id}`);
    await redisClient.del('Transiti_tutti');
  }

  async updateFieldsTransito(
    objTransito: eTransito,
    fieldsToUpdate: Partial<{
      data_transito: Date;
      speed: number;
      speed_real: number;
      id_varco: number;
      meteo: string;
      id_veicolo: number;
      path_immagine: string;
      stato: string;
    }>,
  ): Promise<void> {
    try {
      const redisClient = await databaseCache.getInstance();

      await repositoryTransito.updateFields(objTransito, fieldsToUpdate);

      // Invalida la cache dell'Transito aggiornato e la cache generale
      await redisClient.del(`Transito_${objTransito.get_id()}`);
      await redisClient.del('Transiti_tutti');
    } catch (err) {
      throw new Error(`serviceTransito - updateFields: ${err}`);
    }
  }

  // Elimina un Transito
  async deleteTransito(id: number): Promise<void> {
    const redisClient = await databaseCache.getInstance();

    const TransitoDaEliminare = new eTransito(new eTransitoBuilder().setId(id));
    await repositoryTransito.delete(TransitoDaEliminare);

    // Invalida la cache dell'Transito eliminato e la cache generale
    await redisClient.del(`Transito_${id}`);
    await redisClient.del('Transiti_tutti');
  }

  public getTransitoStato = (transito: eTransito): enumTransitoStato => {
    let result: enumTransitoStato = enumTransitoStato.indefinito;

    try {
      // Definizione delle regole come array di funzioni
      const rules: Array<() => enumTransitoStato | null> = [
        () => {
          // "non processabile" se manca id_veicolo e path_immagine è null
          if (!transito.get_id_veicolo() && !transito.get_path_immagine()) {
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

  async refreshTransito(objTransito: eTransito): Promise<void> {
    try {
      const statoUpdated: enumTransitoStato =
        this.getTransitoStato(objTransito);

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
          if (!objTransito.get_path_immagine()) {
            const rabbitMQ = messenger.getInstance();
            // Connessione a RabbitMQ
            await rabbitMQ.connect();
            // Invia un messaggio alla coda 'tasks_queue'
            await rabbitMQ.sendToQueue(
              enumMessengerCoda.queueTransitoOCR,
              JSON.stringify(objTransito),
            );
          }
      }
    } catch (err) {
      throw new Error(`refreshTransitoStato: ${err}`);
    }
  }
}
export const serviceTransito = new serviceTransitoImplementation();
