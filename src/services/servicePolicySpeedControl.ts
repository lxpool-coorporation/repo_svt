import { enumStato } from '../entity/enum/enumStato';
import { ePolicySpeedControl } from '../entity/svt/ePolicySpeedControl';
import { repositoryPolicySpeedControl } from '../dao/repositories/svt/repositoryPolicySpeedControl';
import databaseCache from '../utils/database-cache';
import logger from '../utils/logger-winston';
import { enumPolicyTipo } from '../entity/enum/enumPolicyTipo';
import { enumMeteoTipo } from '@/entity/enum/enumMeteoTipo';
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
      const PolicySpeedControl = await repositoryPolicySpeedControl.get(id);
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

  // Recupera tutti gli Varchi
  async getAllVarchi(options?: object): Promise<ePolicySpeedControl[]> {
    const redisClient = await databaseCache.getInstance();

    const cacheKey = 'Varchi_tutti';

    // Controlla se gli Varchi sono in cache
    const cachedVarchi = await redisClient.get(cacheKey);
    if (cachedVarchi) {
      return JSON.parse(cachedVarchi); // Restituisce gli Varchi dalla cache
    }

    // Se non sono in cache, recupera dal repository
    const Varchi = await repositoryPolicySpeedControl.getAll(options);
    if (Varchi) {
      // Memorizza gli Varchi in cache per 1 ora
      await redisClient.set(cacheKey, JSON.stringify(Varchi), {
        EX: parseInt(process.env.REDIS_CACHE_TIMEOUT || '3600'),
      });
    }
    return Varchi;
    //return await repositoryPolicySpeedControl.getAll();
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
    const savedPolicySpeedControl = await repositoryPolicySpeedControl.save(
      nuovoPolicySpeedControl,
    );

    // Invalida la cache degli Varchi
    await redisClient.del(`PolicySpeedControl_tutti`);
    return savedPolicySpeedControl;
  }

  // Aggiorna un PolicySpeedControl esistente
  async updatePolicySpeedControl(
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
      0,
      cod,
      descrizione,
      tipo,
      stato,
      meteo,
      veicolo,
      speed_limit,
    );
    await repositoryPolicySpeedControl.update(PolicySpeedControl);

    // Invalida la cache dell'PolicySpeedControl aggiornato e la cache generale
    await redisClient.del(`PolicySpeedControl_${PolicySpeedControl.get_id()}`);
    await redisClient.del('PolicySpeedControl_tutti');
  }

  // Elimina un PolicySpeedControl
  async deletePolicySpeedControl(id: number): Promise<void> {
    const redisClient = await databaseCache.getInstance();

    const PolicySpeedControlDaEliminare = new ePolicySpeedControl(
      id,
      '',
      '',
      enumPolicyTipo.tutor,
      enumStato.attivo,
      enumMeteoTipo.sereno,
      enumVeicoloTipo.autoveicoli,
      0,
    );
    await repositoryPolicySpeedControl.delete(PolicySpeedControlDaEliminare);

    // Invalida la cache dell'PolicySpeedControl eliminato e la cache generale
    await redisClient.del(`PolicySpeedControl_${id}`);
    await redisClient.del('PolicySpeedControl_tutti');
  }

  // Inizializza struttura db Svt
  async initStruttura(options?: {
    force?: boolean;
    alter?: boolean;
    logging?: boolean;
  }): Promise<boolean> {
    return await repositoryPolicySpeedControl.init(options);
  }
}

export const servicePolicySpeedControl =
  new servicePolicySpeedControlImplementation();
