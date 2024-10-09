import { eTransito, eTransitoBuilder } from '../entity/svt/eTransito';
import { repositoryTransito } from '../dao/repositories/svt/repositoryTransito';
import databaseCache from '../utils/database-cache';
import logger from '../utils/logger-winston';
import { enumTransitoStato } from '../entity/enum/enumTransitoStato';
import { enumMeteoTipo } from '../entity/enum/enumMeteoTipo';

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

    // Invalida la cache degli Transiti
    await redisClient.del(`Transiti_tutti`);

    return savedTransito;
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

  // Elimina un Transito
  async deleteTransito(id: number): Promise<void> {
    const redisClient = await databaseCache.getInstance();

    const TransitoDaEliminare = new eTransito(new eTransitoBuilder().setId(id));
    await repositoryTransito.delete(TransitoDaEliminare);

    // Invalida la cache dell'Transito eliminato e la cache generale
    await redisClient.del(`Transito_${id}`);
    await redisClient.del('Transiti_tutti');
  }

  public getStato = (transito: eTransito): enumTransitoStato => {
    let result = enumTransitoStato.indefinito;

    try {
      // Definizione delle regole come array di funzioni
      const rules: Array<() => enumTransitoStato | null> = [
        () => {
          // "non processabile" se manca id_veicolo e path_immagine è null
          if (!transito.get_id_veicolo() && !transito.get_path_immagine()) {
            return enumTransitoStato.non_processabile;
          } else {
            return null;
          }
        },
        () => {
          // "acquisito" se entrambi id_veicolo e meteo sono valorizzati
          if (transito.get_id_veicolo() && transito.get_meteo()) {
            return enumTransitoStato.acquisito;
          } else {
            return null;
          }
        },
        () => {
          // "in attesa" se manca uno dei due campi (id_veicolo o meteo)
          if (!transito.get_id_veicolo() || !transito.get_meteo()) {
            return enumTransitoStato.in_attesa;
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
}
export const serviceTransito = new serviceTransitoImplementation();
