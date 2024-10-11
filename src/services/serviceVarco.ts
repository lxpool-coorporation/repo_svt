import { enumStato } from '../entity/enum/enumStato';
import { eVarco } from '../entity/svt/eVarco';
import { repositoryVarco } from '../dao/repositories/svt/repositoryVarco';
import databaseCache from '../utils/database-cache';
import logger from '../utils/logger-winston';
import { eTransito } from '../entity/svt/eTransito';
import { ePolicy } from '../entity/svt/ePolicy';

/**
 *classe che gestisce la logica di business dell'Varco
 *
 * @class serviceVarcoImplementation
 */
class serviceVarcoImplementation {
  /**
   *Recupera un Varco per ID
   *
   * @param {number} id
   * @return {*}  {(Promise<eVarco | null>)}
   * @memberof serviceVarcoImplementation
   */
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

  /**
   *
   *
   * @param {string} cod
   * @return {*}  {(Promise<eVarco | null>)}
   * @memberof serviceVarcoImplementation
   */
  async getVarcoByCod(cod: string): Promise<eVarco | null> {
    return await repositoryVarco.getByCod(cod);
  }

  /**
   *Recupera tutti gli Varchi
   *
   * @param {object} [options]
   * @return {*}  {Promise<eVarco[]>}
   * @memberof serviceVarcoImplementation
   */
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

  /**
   *Crea un nuovo Varco
   *
   * @param {string} cod
   * @param {string} descrizione
   * @param {number} latitudine
   * @param {number} longitudine
   * @param {enumStato} stato
   * @return {*}  {(Promise<eVarco | null>)}
   * @memberof serviceVarcoImplementation
   */
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

  /**
   *Aggiorna un Varco esistente
   *
   * @param {number} id
   * @param {string} cod
   * @param {string} descrizione
   * @param {number} latitudine
   * @param {number} longitudine
   * @param {enumStato} stato
   * @return {*}  {Promise<void>}
   * @memberof serviceVarcoImplementation
   */
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

  /**
   *Elimina un Varco
   *
   * @param {number} id
   * @return {*}  {Promise<void>}
   * @memberof serviceVarcoImplementation
   */
  async deleteVarco(id: number): Promise<void> {
    const redisClient = await databaseCache.getInstance();

    const VarcoDaEliminare = new eVarco(id, '', '', 0, 0, enumStato.attivo);
    await repositoryVarco.delete(VarcoDaEliminare);

    // Invalida la cache dell'Varco eliminato e la cache generale
    await redisClient.del(`Varco_${id}`);
    await redisClient.del('Varchi_tutti');
  }

  /**
   *Ottieni Transiti di un Varco
   *
   * @param {number} idVarco
   * @return {*}  {(Promise<eTransito[] | null>)}
   * @memberof serviceVarcoImplementation
   */
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

  /**
   *Ottieni Policies di un Varco
   *
   * @param {number} idVarco
   * @return {*}  {(Promise<ePolicy[] | null>)}
   * @memberof serviceVarcoImplementation
   */
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
