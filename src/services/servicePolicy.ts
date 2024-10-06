import { enumStato } from '../entity/enum/enumStato';
import { ePolicySpeedControl } from '../entity/svt/ePolicySpeedControl';
import { repositoryPolicy } from '../dao/repositories/svt/repositoryPolicy';
import databaseCache from '../utils/database-cache';
import logger from '../utils/logger-winston';
import { enumPolicyTipo } from '../entity/enum/enumPolicyTipo';
import { enumMeteoTipo } from '../entity/enum/enumMeteoTipo';
import { enumVeicoloTipo } from '@/entity/enum/enumVeicoloTipo';

// classe che gestisce la logica di business dell'PolicySpeedControl
class servicePolicySpeedControlImplementation {
  // Recupera un PolicySpeedControl per ID
  async getPolicySpeedControlById(
    id: number,
  ): Promise<ePolicySpeedControl | null> {
    try {
      const redisClient = await databaseCache.getInstance();

      const cacheKey = `PolicySpeedControl_${id}`;

      // Controlla se l'PolicySpeedControl è in cache
      const jsonData = await redisClient.get(cacheKey);
      if (jsonData) {
        const data = JSON.parse(jsonData); // Restituisce l'PolicySpeedControl dalla cache
        const cacheObject = ePolicySpeedControl.fromJSON(data); // Assumendo che tu abbia una classe PolicySpeedControl
        return cacheObject;
      }

      // Se non è in cache, recupera dal repository
      const PolicySpeedControl =
        await repositoryPolicy.getPolicySpeedControl(id);
      if (PolicySpeedControl) {
        // Memorizza l'PolicySpeedControl in cache per 1 ora
        await redisClient.set(cacheKey, JSON.stringify(PolicySpeedControl), {
          EX: parseInt(process.env.REDIS_CACHE_TIMEOUT || '3600'),
        });
      }

      return PolicySpeedControl;
    } catch (err) {
      logger.error('serviceSvt - err:', err);
      return null;
    }
  }

  // Crea un nuovo PolicySpeedControl
  async createPolicySpeedControl(
    cod: string,
    descrizione: string,
    tipo: enumPolicyTipo,
    stato: enumStato,
    meteo: enumMeteoTipo,
    veicolo: enumVeicoloTipo,
    speed_limit: number,
  ): Promise<ePolicySpeedControl | null> {
    const redisClient = await databaseCache.getInstance();

    const nuovoPolicySpeedControl = new ePolicySpeedControl(
      0,
      cod,
      descrizione,
      tipo,
      stato,
      meteo,
      veicolo,
      speed_limit,
    );
    const savedPolicySpeedControl =
      await repositoryPolicy.savePolicySpeedControl(nuovoPolicySpeedControl);

    // Invalida la cache degli Varchi
    await redisClient.del(`PolicySpeedControl_tutti`);
    return savedPolicySpeedControl;
  }

  // Aggiorna un PolicySpeedControl esistente
  async updatePolicySpeedControl(
    id: number,
    cod: string,
    descrizione: string,
    tipo: enumPolicyTipo,
    stato: enumStato,
    meteo: enumMeteoTipo,
    veicolo: enumVeicoloTipo,
    speed_limit: number,
  ): Promise<void> {
    const redisClient = await databaseCache.getInstance();

    const PolicySpeedControl = new ePolicySpeedControl(
      id,
      cod,
      descrizione,
      tipo,
      stato,
      meteo,
      veicolo,
      speed_limit,
    );
    await repositoryPolicy.updatePolicySpeedControl(PolicySpeedControl);

    // Invalida la cache dell'PolicySpeedControl aggiornato e la cache generale
    await redisClient.del(`PolicySpeedControl_${PolicySpeedControl.get_id()}`);
    await redisClient.del('PolicySpeedControl_tutti');
  }

  // Elimina un PolicySpeedControl
  async deletePolicySpeedControl(id: number): Promise<void> {
    const redisClient = await databaseCache.getInstance();

    const PolicySpeedControlDaEliminare = new ePolicySpeedControl(
      id,
      null,
      null,
      null,
      null,
      enumMeteoTipo.sereno,
      enumVeicoloTipo.autoveicoli,
      0,
    );
    await repositoryPolicy.deletePolicySpeedControl(
      PolicySpeedControlDaEliminare,
    );

    // Invalida la cache dell'PolicySpeedControl eliminato e la cache generale
    await redisClient.del(`PolicySpeedControl_${id}`);
    await redisClient.del('PolicySpeedControl_tutti');
  }
}

export const servicePolicySpeedControl =
  new servicePolicySpeedControlImplementation();
