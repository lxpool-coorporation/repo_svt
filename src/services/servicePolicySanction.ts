import { enumStato } from '../entity/enum/enumStato';
import { ePolicySanctionSpeedControl } from '../entity/svt/ePolicySanctionSpeedControl';
import { repositoryPolicySanction } from '../dao/repositories/svt/repositoryPolicySanction';
import databaseCache from '../utils/database-cache';
import logger from '../utils/logger-winston';
import { enumPolicyTipo } from '../entity/enum/enumPolicyTipo';

// classe che gestisce la logica di business dell'PolicySanctionSpeedControl
class servicePolicySanctionSpeedControlImplementation {
  // Recupera un PolicySanctionSpeedControl per ID
  async getPolicySanctionSpeedControlById(
    id: number,
  ): Promise<ePolicySanctionSpeedControl | null> {
    try {
      const redisClient = await databaseCache.getInstance();

      const cacheKey = `PolicySanctionSpeedControl_${id}`;

      // Controlla se l'PolicySanctionSpeedControl è in cache
      const jsonData = await redisClient.get(cacheKey);
      if (jsonData) {
        const data = JSON.parse(jsonData); // Restituisce l'PolicySanctionSpeedControl dalla cache
        const cacheObject = ePolicySanctionSpeedControl.fromJSON(data); // Assumendo che tu abbia una classe PolicySanctionSpeedControl
        return cacheObject;
      }

      // Se non è in cache, recupera dal repository
      const PolicySanctionSpeedControl =
        await repositoryPolicySanction.getPolicySanctionSpeedControl(id);
      if (PolicySanctionSpeedControl) {
        // Memorizza l'PolicySanctionSpeedControl in cache per 1 ora
        await redisClient.set(
          cacheKey,
          JSON.stringify(PolicySanctionSpeedControl),
          {
            EX: parseInt(process.env.REDIS_CACHE_TIMEOUT || '3600'),
          },
        );
      }

      return PolicySanctionSpeedControl;
    } catch (err) {
      logger.error('serviceSvt - err:', err);
      return null;
    }
  }

  // Crea un nuovo PolicySanctionSpeedControl
  async createPolicySanctionSpeedControl(
    tipo_policy: enumPolicyTipo,
    cod: string,
    descrizione: string,
    costo_min: number,
    costo_max: number,
    costo_punti_patente: number,
    stato: enumStato,
    speed_min: number,
    speed_max: number,
  ): Promise<ePolicySanctionSpeedControl | null> {
    const redisClient = await databaseCache.getInstance();

    const nuovoPolicySanctionSpeedControl = new ePolicySanctionSpeedControl(
      0,
      tipo_policy,
      cod,
      descrizione,
      costo_min,
      costo_max,
      costo_punti_patente,
      stato,
      speed_min,
      speed_max,
    );
    const savedPolicySanctionSpeedControl =
      await repositoryPolicySanction.savePolicySanctionSpeedControl(
        nuovoPolicySanctionSpeedControl,
      );

    // Invalida la cache degli Varchi
    await redisClient.del(`PolicySanctionSpeedControl_tutti`);
    return savedPolicySanctionSpeedControl;
  }

  // Aggiorna un PolicySanctionSpeedControl esistente
  async updatePolicySanctionSpeedControl(
    id: number,
    tipo_policy: enumPolicyTipo,
    cod: string,
    descrizione: string,
    costo_min: number,
    costo_max: number,
    costo_punti_patente: number,
    stato: enumStato,
    speed_min: number,
    speed_max: number,
  ): Promise<void> {
    const redisClient = await databaseCache.getInstance();

    const PolicySanctionSpeedControl = new ePolicySanctionSpeedControl(
      id,
      tipo_policy,
      cod,
      descrizione,
      costo_min,
      costo_max,
      costo_punti_patente,
      stato,
      speed_min,
      speed_max,
    );
    await repositoryPolicySanction.updatePolicySanctionSpeedControl(
      PolicySanctionSpeedControl,
    );

    // Invalida la cache dell'PolicySanctionSpeedControl aggiornato e la cache generale
    await redisClient.del(
      `PolicySanctionSpeedControl_${PolicySanctionSpeedControl.get_id()}`,
    );
    await redisClient.del('PolicySanctionSpeedControl_tutti');
  }

  // Elimina un PolicySanctionSpeedControl
  async deletePolicySanctionSpeedControl(id: number): Promise<void> {
    const redisClient = await databaseCache.getInstance();

    const PolicySanctionSpeedControlDaEliminare =
      new ePolicySanctionSpeedControl(
        id,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        0,
        0,
      );
    await repositoryPolicySanction.deletePolicySanctionSpeedControl(
      PolicySanctionSpeedControlDaEliminare,
    );

    // Invalida la cache dell'PolicySanctionSpeedControl eliminato e la cache generale
    await redisClient.del(`PolicySanctionSpeedControl_${id}`);
    await redisClient.del('PolicySanctionSpeedControl_tutti');
  }
}

export const servicePolicySanctionSpeedControl =
  new servicePolicySanctionSpeedControlImplementation();
