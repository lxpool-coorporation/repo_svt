import { enumStato } from '../entity/enum/enumStato';
import { eTratta } from '../entity/svt/eTratta';
import { repositoryTratta } from '../dao/repositories/svt/repositoryTratta';
import databaseCache from '../utils/database-cache';
import logger from '../utils/logger-winston';
import { eVarco } from '../entity/svt/eVarco';

// classe che gestisce la logica di business dell'Tratta
class serviceTrattaImplementation {
  // Recupera un Tratta per ID
  async getTrattaById(id: number): Promise<eTratta | null> {
    try {
      const redisClient = await databaseCache.getInstance();

      const cacheKey = `Tratta_${id}`;

      // Controlla se l'Tratta è in cache
      const jsonData = await redisClient.get(cacheKey);
      if (jsonData) {
        const data = JSON.parse(jsonData); // Restituisce l'Tratta dalla cache
        const cacheObject = eTratta.fromJSON(data); // Assumendo che tu abbia una classe Tratta
        return cacheObject;
      }

      // Se non è in cache, recupera dal repository
      const Tratta = await repositoryTratta.get(id);
      if (Tratta) {
        // Memorizza l'Tratta in cache per 1 ora
        await redisClient.set(cacheKey, JSON.stringify(Tratta), {
          EX: parseInt(process.env.REDIS_CACHE_TIMEOUT || '3600'),
        });
      }

      return Tratta;
    } catch (err) {
      logger.error('serviceSvt - err:', err);
      return null;
    }
  }

  // Recupera tutti gli Veicoli
  async getAllVeicoli(options?: object): Promise<eTratta[]> {
    const redisClient = await databaseCache.getInstance();

    const cacheKey = 'Veicoli_tutti';

    // Controlla se gli Veicoli sono in cache
    const cachedVeicoli = await redisClient.get(cacheKey);
    if (cachedVeicoli) {
      return JSON.parse(cachedVeicoli); // Restituisce gli Veicoli dalla cache
    }

    // Se non sono in cache, recupera dal repository
    const Veicoli = await repositoryTratta.getAll(options);
    if (Veicoli) {
      // Memorizza gli Veicoli in cache per 1 ora
      await redisClient.set(cacheKey, JSON.stringify(Veicoli), {
        EX: parseInt(process.env.REDIS_CACHE_TIMEOUT || '3600'),
      });
    }
    return Veicoli;
    //return await repositoryTratta.getAll();
  }

  // Crea un nuovo Tratta
  async createTratta(
    cod: string,
    descrizione: string,
    id_varco_ingresso: number,
    id_varco_uscita: number,
    distanza: number,
    stato: enumStato,
  ): Promise<eTratta | null> {
    const redisClient = await databaseCache.getInstance();

    const nuovoTratta = new eTratta(
      0,
      cod,
      descrizione,
      id_varco_ingresso,
      id_varco_uscita,
      distanza,
      stato,
    );
    const savedTratta = await repositoryTratta.save(nuovoTratta);

    // Invalida la cache degli Veicoli
    await redisClient.del(`Veicoli_tutti`);
    return savedTratta;
  }

  // Aggiorna un Tratta esistente
  async updateTratta(
    id: number,
    cod: string,
    descrizione: string,
    id_varco_ingresso: number,
    id_varco_uscita: number,
    distanza: number,
    stato: enumStato,
  ): Promise<void> {
    const redisClient = await databaseCache.getInstance();

    const Tratta = new eTratta(
      id,
      cod,
      descrizione,
      id_varco_ingresso,
      id_varco_uscita,
      distanza,
      stato,
    );
    await repositoryTratta.update(Tratta);

    // Invalida la cache dell'Tratta aggiornato e la cache generale
    await redisClient.del(`Tratta_${id}`);
    await redisClient.del('Veicoli_tutti');
  }

  // Elimina un Tratta
  async deleteTratta(id: number): Promise<void> {
    const redisClient = await databaseCache.getInstance();

    const TrattaDaEliminare = new eTratta(
      id,
      '',
      '',
      0,
      0,
      0,
      enumStato.attivo,
    );
    await repositoryTratta.delete(TrattaDaEliminare);

    // Invalida la cache dell'Tratta eliminato e la cache generale
    await redisClient.del(`Tratta_${id}`);
    await redisClient.del('Veicoli_tutti');
  }

  // Ottieni Transiti di un Tratta
  async getTransitiByIdTratta(idTratta: number): Promise<eVarco[] | null> {
    const redisClient = await databaseCache.getInstance();

    const cacheKey = `Transiti_Tratta_${idTratta}`;

    // Controlla se i Transiti sono in cache
    const jsonData = await redisClient.get(cacheKey);
    if (jsonData) {
      const dataArray = JSON.parse(jsonData); // dataArray è un array di oggetti plain
      const cacheObjectArray = dataArray.map((data: any) =>
        eVarco.fromJSON(data),
      );
      return cacheObjectArray;
    }

    // Se non sono in cache, recupera dal repository
    const transiti = await repositoryTratta.getVarchi(idTratta);
    if (transiti) {
      // Memorizza i profili in cache per 1 ora
      await redisClient.set(cacheKey, JSON.stringify(transiti), {
        EX: parseInt(process.env.REDIS_CACHE_TIMEOUT || '3600'),
      });
    }
    return transiti;
  }

  // Inizializza struttura db Svt
  async initStruttura(options?: {
    force?: boolean;
    alter?: boolean;
    logging?: boolean;
  }): Promise<boolean> {
    return await repositoryTratta.init(options);
  }
}

export const serviceTratta = new serviceTrattaImplementation();
