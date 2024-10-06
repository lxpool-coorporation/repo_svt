import { eMulta } from '../entity/svt/eMulta';
import { repositoryMulta } from '../dao/repositories/svt/repositoryMulta';
import databaseCache from '../utils/database-cache';
import logger from '../utils/logger-winston';

// classe che gestisce la logica di business dell'Multa
class serviceMultaImplementation {
  // Recupera un Multa per ID
  async getMultaById(id: number): Promise<eMulta | null> {
    try {
      const redisClient = await databaseCache.getInstance();

      const cacheKey = `Multa_${id}`;

      // Controlla se l'Multa è in cache
      const jsonData = await redisClient.get(cacheKey);
      if (jsonData) {
        const data = JSON.parse(jsonData); // Restituisce l'Multa dalla cache
        const cacheObject = eMulta.fromJSON(data); // Assumendo che tu abbia una classe Multa
        return cacheObject;
      }

      // Se non è in cache, recupera dal repository
      const Multa = await repositoryMulta.get(id);
      if (Multa) {
        // Memorizza l'Multa in cache per 1 ora
        await redisClient.set(cacheKey, JSON.stringify(Multa), {
          EX: parseInt(process.env.REDIS_CACHE_TIMEOUT || '3600'),
        });
      }

      return Multa;
    } catch (err) {
      logger.error('serviceSvt - err:', err);
      return null;
    }
  }

  // Crea un nuovo Multa
  async createMulta(
    id_transito: number,
    id_policy: number,
    speed_delta: number,
    path_bollettino: string,
  ): Promise<eMulta | null> {
    const redisClient = await databaseCache.getInstance();

    const nuovoMulta = new eMulta(
      0,
      id_transito,
      id_policy,
      speed_delta,
      path_bollettino,
    );
    const savedMulta = await repositoryMulta.save(nuovoMulta);

    // Invalida la cache degli Varchi
    await redisClient.del(`Multa_tutti`);
    return savedMulta;
  }

  // Aggiorna un Multa esistente
  async updateMulta(
    id_transito: number,
    id_policy: number,
    speed_delta: number,
    path_bollettino: string,
  ): Promise<void> {
    const redisClient = await databaseCache.getInstance();

    const Multa = new eMulta(
      0,
      id_transito,
      id_policy,
      speed_delta,
      path_bollettino,
    );
    await repositoryMulta.update(Multa);

    // Invalida la cache dell'Multa aggiornato e la cache generale
    await redisClient.del(`Multa_${Multa.get_id()}`);
    await redisClient.del('Multa_tutti');
  }

  // Elimina un Multa
  async deleteMulta(id: number): Promise<void> {
    const redisClient = await databaseCache.getInstance();

    const MultaDaEliminare = new eMulta(id, null, null, null, null);
    await repositoryMulta.delete(MultaDaEliminare);

    // Invalida la cache dell'Multa eliminato e la cache generale
    await redisClient.del(`Multa_${id}`);
    await redisClient.del('Multa_tutti');
  }
}

export const serviceMulta = new serviceMultaImplementation();
