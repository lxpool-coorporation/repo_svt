import { eMultaSpeedControl } from '../entity/svt/eMultaSpeedControl';
import { repositoryMulta } from '../dao/repositories/svt/repositoryMulta';
import databaseCache from '../utils/database-cache';
import logger from '../utils/logger-winston';
import { enumPolicyTipo } from '../entity/enum/enumPolicyTipo';
import { enumMultaStato } from '../entity/enum/enumMultaStato';

// classe che gestisce la logica di business dell'MultaSpeedControl
class serviceMultaSpeedControlImplementation {
  // Recupera un MultaSpeedControl per ID
  async getMultaSpeedControlById(
    id: number,
  ): Promise<eMultaSpeedControl | null> {
    try {
      const redisClient = await databaseCache.getInstance();

      const cacheKey = `MultaSpeedControl_${id}`;

      // Controlla se l'MultaSpeedControl è in cache
      const jsonData = await redisClient.get(cacheKey);
      if (jsonData) {
        const data = JSON.parse(jsonData); // Restituisce l'MultaSpeedControl dalla cache
        const cacheObject = eMultaSpeedControl.fromJSON(data); // Assumendo che tu abbia una classe MultaSpeedControl
        return cacheObject;
      }

      // Se non è in cache, recupera dal repository
      const MultaSpeedControl = await repositoryMulta.getMultaSpeedControl(id);
      if (MultaSpeedControl) {
        // Memorizza l'MultaSpeedControl in cache per 1 ora
        await redisClient.set(cacheKey, JSON.stringify(MultaSpeedControl), {
          EX: parseInt(process.env.REDIS_CACHE_TIMEOUT || '3600'),
        });
      }

      return MultaSpeedControl;
    } catch (err) {
      logger.error('serviceSvt - err:', err);
      return null;
    }
  }

  // Crea un nuovo MultaSpeedControl
  async createMultaSpeedControl(
    id_transito: number | null,
    id_policy: number | null,
    id_policy_type: enumPolicyTipo | null,
    id_automobilista: number | null,
    is_notturno: boolean | null,
    is_recidivo: boolean | null,
    path_bollettino: string | null,
    stato: enumMultaStato | null,
    speed: number,
    speed_real: number,
    speed_limit: number,
    speed_delta: number,
  ): Promise<eMultaSpeedControl | null> {
    const redisClient = await databaseCache.getInstance();

    const nuovoMultaSpeedControl = new eMultaSpeedControl(
      0,
      id_transito,
      id_policy,
      id_policy_type,
      id_automobilista,
      is_notturno,
      is_recidivo,
      path_bollettino,
      stato,
      speed,
      speed_real,
      speed_limit,
      speed_delta,
    );
    const savedMultaSpeedControl = await repositoryMulta.saveMultaSpeedControl(
      nuovoMultaSpeedControl,
    );

    // Invalida la cache degli Varchi
    await redisClient.del(`MultaSpeedControl_tutti`);
    return savedMultaSpeedControl;
  }

  // Aggiorna un MultaSpeedControl esistente
  async updateMultaSpeedControl(
    id: number,
    id_transito: number | null,
    id_policy: number | null,
    id_policy_type: enumPolicyTipo | null,
    id_automobilista: number | null,
    is_notturno: boolean | null,
    is_recidivo: boolean | null,
    path_bollettino: string | null,
    stato: enumMultaStato | null,
    speed: number,
    speed_real: number,
    speed_limit: number,
    speed_delta: number,
  ): Promise<void> {
    const redisClient = await databaseCache.getInstance();

    const MultaSpeedControl = new eMultaSpeedControl(
      id,
      id_transito,
      id_policy,
      id_policy_type,
      id_automobilista,
      is_notturno,
      is_recidivo,
      path_bollettino,
      stato,
      speed,
      speed_real,
      speed_limit,
      speed_delta,
    );
    await repositoryMulta.updateMultaSpeedControl(MultaSpeedControl);

    // Invalida la cache dell'MultaSpeedControl aggiornato e la cache generale
    await redisClient.del(`MultaSpeedControl_${MultaSpeedControl.get_id()}`);
    await redisClient.del('MultaSpeedControl_tutti');
  }

  // Elimina un MultaSpeedControl
  async deleteMultaSpeedControl(id: number): Promise<void> {
    const redisClient = await databaseCache.getInstance();

    const MultaSpeedControlDaEliminare = new eMultaSpeedControl(
      id,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      0,
      0,
      0,
      0,
    );
    await repositoryMulta.deleteMultaSpeedControl(MultaSpeedControlDaEliminare);

    // Invalida la cache dell'MultaSpeedControl eliminato e la cache generale
    await redisClient.del(`MultaSpeedControl_${id}`);
    await redisClient.del('MultaSpeedControl_tutti');
  }
}

export const serviceMultaSpeedControl =
  new serviceMultaSpeedControlImplementation();
