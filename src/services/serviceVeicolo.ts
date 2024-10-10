import { enumStato } from '../entity/enum/enumStato';
import { eVeicolo } from '../entity/svt/eVeicolo';
import { repositoryVeicolo } from '../dao/repositories/svt/repositoryVeicolo';
import databaseCache from '../utils/database-cache';
import logger from '../utils/logger-winston';
import { enumVeicoloTipo } from '../entity/enum/enumVeicoloTipo';
import { eUtente } from '../entity/utente/eUtente';

// classe che gestisce la logica di business dell'Veicolo
class serviceSvtImplementation {
  // Recupera un Veicolo per ID
  async getVeicoloById(id: number): Promise<eVeicolo | null> {
    try {
      const redisClient = await databaseCache.getInstance();

      const cacheKey = `Veicolo_${id}`;

      // Controlla se l'Veicolo è in cache
      const jsonData = await redisClient.get(cacheKey);
      if (jsonData) {
        const data = JSON.parse(jsonData); // Restituisce l'Veicolo dalla cache
        const cacheObject = eVeicolo.fromJSON(data); // Assumendo che tu abbia una classe Veicolo
        return cacheObject;
      }

      // Se non è in cache, recupera dal repository
      const Veicolo = await repositoryVeicolo.get(id);
      if (Veicolo) {
        // Memorizza l'Veicolo in cache per 1 ora
        await redisClient.set(cacheKey, JSON.stringify(Veicolo), {
          EX: parseInt(process.env.REDIS_CACHE_TIMEOUT || '3600'),
        });
      }

      return Veicolo;
    } catch (err) {
      logger.error('serviceSvt - err:', err);
      return null;
    }
  }

  // Recupera tutti gli Veicoli
  async getAllVeicoli(options?: object): Promise<eVeicolo[]> {
    const redisClient = await databaseCache.getInstance();

    const cacheKey = 'Veicoli_tutti';

    // Controlla se gli Veicoli sono in cache
    const cachedVeicoli = await redisClient.get(cacheKey);
    if (cachedVeicoli) {
      return JSON.parse(cachedVeicoli); // Restituisce gli Veicoli dalla cache
    }

    // Se non sono in cache, recupera dal repository
    const Veicoli = await repositoryVeicolo.getAll(options);
    if (Veicoli) {
      // Memorizza gli Veicoli in cache per 1 ora
      await redisClient.set(cacheKey, JSON.stringify(Veicoli), {
        EX: parseInt(process.env.REDIS_CACHE_TIMEOUT || '3600'),
      });
    }
    return Veicoli;
    //return await repositoryVeicolo.getAll();
  }

  // Crea un nuovo Veicolo
  async createVeicolo(
    tipo: enumVeicoloTipo,
    targa: string,
    stato: enumStato,
  ): Promise<eVeicolo | null> {
    const redisClient = await databaseCache.getInstance();

    const nuovoVeicolo = new eVeicolo(0, tipo, targa, stato);
    const savedVeicolo = await repositoryVeicolo.save(nuovoVeicolo);

    // Invalida la cache degli Veicoli
    await redisClient.del(`Veicoli_tutti`);
    return savedVeicolo;
  }

  // Aggiorna un Veicolo esistente
  async updateVeicolo(
    id: number,
    tipo: enumVeicoloTipo,
    targa: string,
    stato: enumStato,
  ): Promise<void> {
    const redisClient = await databaseCache.getInstance();

    const Veicolo = new eVeicolo(id, tipo, targa, stato);
    await repositoryVeicolo.update(Veicolo);

    // Invalida la cache dell'Veicolo aggiornato e la cache generale
    await redisClient.del(`Veicolo_${id}`);
    await redisClient.del('Veicoli_tutti');
  }

  // Elimina un Veicolo
  async deleteVeicolo(id: number): Promise<void> {
    const redisClient = await databaseCache.getInstance();

    const VeicoloDaEliminare = new eVeicolo(
      id,
      enumVeicoloTipo.autoveicoli,
      '',
      enumStato.attivo,
    );
    await repositoryVeicolo.delete(VeicoloDaEliminare);

    // Invalida la cache dell'Veicolo eliminato e la cache generale
    await redisClient.del(`Veicolo_${id}`);
    await redisClient.del('Veicoli_tutti');
  }

  // Ottieni Utenti di un Veicolo
  async getUtentiByIdVeicolo(idVeicolo: number): Promise<eUtente[] | null> {
    const redisClient = await databaseCache.getInstance();

    const cacheKey = `Utenti_Veicolo_${idVeicolo}`;

    // Controlla se i Utenti sono in cache
    const jsonData = await redisClient.get(cacheKey);
    if (jsonData) {
      const dataArray = JSON.parse(jsonData); // dataArray è un array di oggetti plain
      const cacheObjectArray = dataArray.map((data: any) =>
        eUtente.fromJSON(data),
      );
      return cacheObjectArray;
    }

    // Se non sono in cache, recupera dal repository
    const Utenti = await repositoryVeicolo.getUtentiByIdVeicolo(idVeicolo);
    if (Utenti) {
      // Memorizza i Utenti in cache per 1 ora
      await redisClient.set(cacheKey, JSON.stringify(Utenti), {
        EX: parseInt(process.env.REDIS_CACHE_TIMEOUT || '3600'),
      });
    }
    return Utenti;
  }
}

export const serviceVeicolo = new serviceSvtImplementation();
