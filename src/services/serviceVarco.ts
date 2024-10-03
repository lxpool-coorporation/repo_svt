import { enumStato } from '../entity/enum/enumStato';
import { eVarco } from '../entity/svt/eVarco';
import { repositoryVarco } from '../dao/repositories/svt/repositoryVarco';
import databaseCache from '../utils/database-cache';
import logger from '../utils/logger-winston';
import { eTransito } from '../entity/svt/eTransito';

// classe che gestisce la logica di business dell'Varco
class serviceSvtImplementation {
  // Recupera un Varco per ID
  async getVarcoById(id: number): Promise<eVarco | null> {
    try {
      const redisClient = await databaseCache.getInstance();

      const cacheKey = `Varco_${id}`;

      // Controlla se l'Varco è in cache
      const jsonData = await redisClient.get(cacheKey);
      if (jsonData) {
        const data = JSON.parse(jsonData); // Restituisce l'Varco dalla cache
        const cacheObject = eVarco.fromJSON(data); // Assumendo che tu abbia una classe Varco
        return cacheObject;
      }

      // Se non è in cache, recupera dal repository
      const Varco = await repositoryVarco.get(id);
      if (Varco) {
        // Memorizza l'Varco in cache per 1 ora
        await redisClient.set(cacheKey, JSON.stringify(Varco), {
          EX: parseInt(process.env.REDIS_CACHE_TIMEOUT || '3600'),
        });
      }

      return Varco;
    } catch (err) {
      logger.error('serviceSvt - err:', err);
      return null;
    }
  }

  // Recupera tutti gli Veicoli
  async getAllVeicoli(options?: object): Promise<eVarco[]> {
    const redisClient = await databaseCache.getInstance();

    const cacheKey = 'Veicoli_tutti';

    // Controlla se gli Veicoli sono in cache
    const cachedVeicoli = await redisClient.get(cacheKey);
    if (cachedVeicoli) {
      return JSON.parse(cachedVeicoli); // Restituisce gli Veicoli dalla cache
    }

    // Se non sono in cache, recupera dal repository
    const Veicoli = await repositoryVarco.getAll(options);
    if (Veicoli) {
      // Memorizza gli Veicoli in cache per 1 ora
      await redisClient.set(cacheKey, JSON.stringify(Veicoli), {
        EX: parseInt(process.env.REDIS_CACHE_TIMEOUT || '3600'),
      });
    }
    return Veicoli;
    //return await repositoryVarco.getAll();
  }

  // Crea un nuovo Varco
  async createVarco(
    cod: string,
    descrizione: string,
    latitudine: number,
    longitudine: number,
    stato: enumStato,
  ): Promise<eVarco | null> {
    const redisClient = await databaseCache.getInstance();

    const nuovoVarco = new eVarco(
      0,
      cod,
      descrizione,
      latitudine,
      longitudine,
      stato,
    );
    const savedVarco = await repositoryVarco.save(nuovoVarco);

    // Invalida la cache degli Veicoli
    await redisClient.del(`Veicoli_tutti`);
    return savedVarco;
  }

  // Aggiorna un Varco esistente
  async updateVarco(
    id: number,
    cod: string,
    descrizione: string,
    latitudine: number,
    longitudine: number,
    stato: enumStato,
  ): Promise<void> {
    const redisClient = await databaseCache.getInstance();

    const Varco = new eVarco(
      id,
      cod,
      descrizione,
      latitudine,
      longitudine,
      stato,
    );
    await repositoryVarco.update(Varco);

    // Invalida la cache dell'Varco aggiornato e la cache generale
    await redisClient.del(`Varco_${id}`);
    await redisClient.del('Veicoli_tutti');
  }

  // Elimina un Varco
  async deleteVarco(id: number): Promise<void> {
    const redisClient = await databaseCache.getInstance();

    const VarcoDaEliminare = new eVarco(id, '', '', 0, 0, enumStato.attivo);
    await repositoryVarco.delete(VarcoDaEliminare);

    // Invalida la cache dell'Varco eliminato e la cache generale
    await redisClient.del(`Varco_${id}`);
    await redisClient.del('Veicoli_tutti');
  }

  // Ottieni Transiti di un Varco
  async getTransitiByIdVarco(idVarco: number): Promise<eTransito[] | null> {
    const redisClient = await databaseCache.getInstance();

    const cacheKey = `Transiti_Varco_${idVarco}`;

    // Controlla se i Transiti sono in cache
    const jsonData = await redisClient.get(cacheKey);
    if (jsonData) {
      const dataArray = JSON.parse(jsonData); // dataArray è un array di oggetti plain
      const cacheObjectArray = dataArray.map((data: any) =>
        eTransito.fromJSON(data),
      );
      return cacheObjectArray;
    }

    // Se non sono in cache, recupera dal repository
    const transiti = await repositoryVarco.getTransiti(idVarco);
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
    return await repositoryVarco.init(options);
  }
}

export const serviceSvt = new serviceSvtImplementation();
