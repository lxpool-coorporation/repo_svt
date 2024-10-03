import { eProfilo } from '../entity/utente/eProfilo';
import { enumStato } from '../entity/enum/enumStato';
import { eUtente } from '../entity/utente/eUtente';
import { repositoryUtente } from '../dao/repositories/repositoryUtente';
import { ePermesso } from '../entity/utente/ePermesso';
import databaseCache from '../utils/database-cache';
import logger from '../utils/logger-winston';

// classe che gestisce la logica di business dell'utente
class serviceUtenteImplementation {
  // Recupera un utente per ID
  async getUtenteById(id: number): Promise<eUtente | null> {
    try {
      const redisClient = await databaseCache.getInstance();

      const cacheKey = `utente_${id}`;

      // Controlla se l'utente è in cache
      const cachedUtente = await redisClient.get(cacheKey);
      if (cachedUtente) {
        return JSON.parse(cachedUtente); // Restituisce l'utente dalla cache
      }

      // Se non è in cache, recupera dal repository
      const utente = await repositoryUtente.get(id);
      if (utente) {
        // Memorizza l'utente in cache per 1 ora
        await redisClient.set(cacheKey, JSON.stringify(utente), {
          EX: parseInt(process.env.REDIS_CACHE_TIMEOUT || '3600'),
        });
      }

      return utente;
    } catch (err) {
      logger.error('serviceUtente - err:', err);
      return null;
    }
  }

  // Recupera tutti gli utenti
  async getAllUtenti(options?: object): Promise<eUtente[]> {
    const redisClient = await databaseCache.getInstance();

    const cacheKey = 'utenti_tutti';

    // Controlla se gli utenti sono in cache
    const cachedUtenti = await redisClient.get(cacheKey);
    if (cachedUtenti) {
      return JSON.parse(cachedUtenti); // Restituisce gli utenti dalla cache
    }

    // Se non sono in cache, recupera dal repository
    const utenti = await repositoryUtente.getAll(options);
    if (utenti) {
      // Memorizza gli utenti in cache per 1 ora
      await redisClient.set(cacheKey, JSON.stringify(utenti), {
        EX: parseInt(process.env.REDIS_CACHE_TIMEOUT || '3600'),
      });
    }
    return utenti;
    //return await repositoryUtente.getAll();
  }

  // Crea un nuovo utente
  async createUtente(
    codice_fiscale: string,
    stato: enumStato,
  ): Promise<eUtente | null> {
    const redisClient = await databaseCache.getInstance();

    const nuovoUtente = new eUtente(0, codice_fiscale, stato);
    const savedUtente = await repositoryUtente.save(nuovoUtente);

    // Invalida la cache degli utenti
    await redisClient.del(`utenti_tutti`);
    return savedUtente;
  }

  // Aggiorna un utente esistente
  async updateUtente(
    id: number,
    codice_fiscale: string,
    stato: enumStato,
  ): Promise<void> {
    const redisClient = await databaseCache.getInstance();

    const utente = new eUtente(id, codice_fiscale, stato);
    await repositoryUtente.update(utente);

    // Invalida la cache dell'utente aggiornato e la cache generale
    await redisClient.del(`utente_${id}`);
    await redisClient.del('utenti_tutti');
  }

  // Elimina un utente
  async deleteUtente(id: number): Promise<void> {
    const redisClient = await databaseCache.getInstance();

    const utenteDaEliminare = new eUtente(id, '', enumStato.attivo);
    await repositoryUtente.delete(utenteDaEliminare);

    // Invalida la cache dell'utente eliminato e la cache generale
    await redisClient.del(`utente_${id}`);
    await redisClient.del('utenti_tutti');
  }

  // Ottieni profili di un utente
  async getProfiliByIdUtente(idUtente: number): Promise<eProfilo[] | null> {
    const redisClient = await databaseCache.getInstance();

    const cacheKey = `profili_utente_${idUtente}`;

    // Controlla se i profili sono in cache
    const cachedProfili = await redisClient.get(cacheKey);
    if (cachedProfili) {
      return JSON.parse(cachedProfili); // Restituisce i profili dalla cache
    }

    // Se non sono in cache, recupera dal repository
    const profili = await repositoryUtente.getProfili(idUtente);
    if (profili) {
      // Memorizza i profili in cache per 1 ora
      await redisClient.set(cacheKey, JSON.stringify(profili), {
        EX: parseInt(process.env.REDIS_CACHE_TIMEOUT || '3600'),
      });
    }
    return profili;
  }

  // Ottieni profili di un utente
  async getPermessiByIdUtente(id: number): Promise<ePermesso[] | null> {
    const redisClient = await databaseCache.getInstance();

    const cacheKey = `permessi_utente_${id}`;

    // Controlla se i permessi sono in cache
    const cachedPermessi = await redisClient.get(cacheKey);
    if (cachedPermessi) {
      return JSON.parse(cachedPermessi); // Restituisce i permessi dalla cache
    }

    // Se non sono in cache, recupera dal repository
    const permessi = await repositoryUtente.getPermessi(id);
    if (permessi) {
      // Memorizza i permessi in cache per 1 ora
      await redisClient.set(cacheKey, JSON.stringify(permessi), {
        EX: parseInt(process.env.REDIS_CACHE_TIMEOUT || '3600'),
      });
    }
    return permessi;
  }

  // Inizializza struttura db utente
  async initStrutturaUtente(options?: {
    force?: boolean;
    alter?: boolean;
    logging?: boolean;
  }): Promise<boolean> {
    return await repositoryUtente.init(options);
  }
}

export const serviceUtente = new serviceUtenteImplementation();
