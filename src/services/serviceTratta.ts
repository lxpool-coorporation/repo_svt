import { enumStato } from '../entity/enum/enumStato';
import { eTratta } from '../entity/svt/eTratta';
import { repositoryTratta } from '../dao/repositories/svt/repositoryTratta';
import databaseCache from '../utils/database-cache';
import logger from '../utils/logger-winston';
import { ePolicy } from '../entity/svt/ePolicy';
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

  // Recupera tutti gli Tratta
  async getAllTratte(options?: object): Promise<eTratta[]> {
    const redisClient = await databaseCache.getInstance();

    const cacheKey = 'Tratta_tutti';

    // Controlla se gli Tratta sono in cache
    const cachedTratta = await redisClient.get(cacheKey);
    if (cachedTratta) {
      return JSON.parse(cachedTratta); // Restituisce gli Tratta dalla cache
    }

    // Se non sono in cache, recupera dal repository
    const Tratta = await repositoryTratta.getAll(options);
    if (Tratta) {
      // Memorizza gli Tratta in cache per 1 ora
      await redisClient.set(cacheKey, JSON.stringify(Tratta), {
        EX: parseInt(process.env.REDIS_CACHE_TIMEOUT || '3600'),
      });
    }
    return Tratta;
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

    // Invalida la cache degli Tratta
    await redisClient.del(`Tratta_tutti`);
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
    await redisClient.del('Tratta_tutti');
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
    await redisClient.del('Tratta_tutti');
  }

  // Ottieni Varchi di un Tratta
  async getVarchiByIdTratta(idTratta: number): Promise<eVarco[] | null> {
    const redisClient = await databaseCache.getInstance();

    const cacheKey = `Varchi_Tratta_${idTratta}`;

    // Controlla se i Transiti sono in cache
    const jsonData = await redisClient.get(cacheKey);
    if (jsonData) {
      const dataArray = JSON.parse(jsonData); // dataArray è un array di oggetti plain
      const cacheObjectArray = dataArray.map((data: any) =>
        ePolicy.fromJSON(data),
      );
      return cacheObjectArray;
    }

    // Se non sono in cache, recupera dal repository
    const varchi = await repositoryTratta.getVarchi(idTratta);
    if (varchi) {
      // Memorizza i profili in cache per 1 ora
      await redisClient.set(cacheKey, JSON.stringify(varchi), {
        EX: parseInt(process.env.REDIS_CACHE_TIMEOUT || '3600'),
      });
    }
    return varchi;
  }

  // Ottieni Varchi di un Tratta
  async getPoliciesByIdTratta(idTratta: number): Promise<ePolicy[] | null> {
    const redisClient = await databaseCache.getInstance();

    const cacheKey = `Policy_Tratta_${idTratta}`;

    // Controlla se i Transiti sono in cache
    const jsonData = await redisClient.get(cacheKey);
    if (jsonData) {
      const dataArray = JSON.parse(jsonData); // dataArray è un array di oggetti plain
      const cacheObjectArray = dataArray.map((data: any) =>
        ePolicy.fromJSON(data),
      );
      return cacheObjectArray;
    }

    // Se non sono in cache, recupera dal repository
    const policies = await repositoryTratta.getPolicies(idTratta);
    if (policies) {
      // Memorizza i profili in cache per 1 ora
      await redisClient.set(cacheKey, JSON.stringify(policies), {
        EX: parseInt(process.env.REDIS_CACHE_TIMEOUT || '3600'),
      });
    }
    return policies;
  }
}

export const serviceTratta = new serviceTrattaImplementation();
