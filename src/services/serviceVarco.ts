import { enumStato } from '../entity/enum/enumStato';
import { eVarco } from '../entity/svt/eVarco';
import { repositoryVarco } from '../dao/repositories/svt/repositoryVarco';
import databaseCache from '../utils/database-cache';
import logger from '../utils/logger-winston';
import { eTransito } from '../entity/svt/eTransito';
import { ePolicy } from '../entity/svt/ePolicy';

// classe che gestisce la logica di business dell'Varco
class serviceVarcoImplementation {
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

  // Recupera tutti gli Varchi
  async getAllVarchi(options?: object): Promise<eVarco[]> {
    const redisClient = await databaseCache.getInstance();

    const cacheKey = 'Varchi_tutti';

    // Controlla se gli Varchi sono in cache
    const cachedVarchi = await redisClient.get(cacheKey);
    if (cachedVarchi) {
      return JSON.parse(cachedVarchi); // Restituisce gli Varchi dalla cache
    }

    // Se non sono in cache, recupera dal repository
    const Varchi = await repositoryVarco.getAll(options);
    if (Varchi) {
      // Memorizza gli Varchi in cache per 1 ora
      await redisClient.set(cacheKey, JSON.stringify(Varchi), {
        EX: parseInt(process.env.REDIS_CACHE_TIMEOUT || '3600'),
      });
    }
    return Varchi;
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

    // Invalida la cache degli Varchi
    await redisClient.del(`Varchi_tutti`);
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
    await redisClient.del('Varchi_tutti');
  }

  // Elimina un Varco
  async deleteVarco(id: number): Promise<void> {
    const redisClient = await databaseCache.getInstance();

    const VarcoDaEliminare = new eVarco(id, '', '', 0, 0, enumStato.attivo);
    await repositoryVarco.delete(VarcoDaEliminare);

    // Invalida la cache dell'Varco eliminato e la cache generale
    await redisClient.del(`Varco_${id}`);
    await redisClient.del('Varchi_tutti');
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

  // Ottieni Policies di un Varco
  async getPoliciesByIdVarco(idVarco: number): Promise<ePolicy[] | null> {
    const redisClient = await databaseCache.getInstance();

    const cacheKey = `Policies_Varco_${idVarco}`;

    // Controlla se i Policies sono in cache
    const jsonData = await redisClient.get(cacheKey);
    if (jsonData) {
      const dataArray = JSON.parse(jsonData); // dataArray è un array di oggetti plain
      const cacheObjectArray = dataArray.map((data: any) =>
        eTransito.fromJSON(data),
      );
      return cacheObjectArray;
    }

    // Se non sono in cache, recupera dal repository
    const policies = await repositoryVarco.getPolicies(idVarco);
    if (policies) {
      // Memorizza i profili in cache per 1 ora
      await redisClient.set(cacheKey, JSON.stringify(policies), {
        EX: parseInt(process.env.REDIS_CACHE_TIMEOUT || '3600'),
      });
    }
    return policies;
  }
}

export const serviceVarco = new serviceVarcoImplementation();
