import { eProfilo } from '../entity/utente/eProfilo';
import { enumStato } from '../entity/enum/enumStato';
import { eUtente } from '../entity/utente/eUtente';
import { repositoryUtente } from '../dao/repositories/utente/repositoryUtente';
import { ePermesso } from '../entity/utente/ePermesso';
import databaseCache from '../utils/database-cache';
import logger from '../utils/logger-winston';
import { enumPermessoTipo } from '../entity/enum/enumPermessoTipo';
import { enumPermessoCategoria } from '../entity/enum/enumPermessoCategoria';
import { enumProfiloTipo } from '../entity/enum/enumProfiloTipo';
import { eVeicolo } from '../entity/svt/eVeicolo';

/**
 *classe che gestisce la logica di business dell'utente
 *
 * @class serviceUtenteImplementation
 */
class serviceUtenteImplementation {
  /**
   *Recupera un utente per ID
   *
   * @param {number} id
   * @return {*}  {(Promise<eUtente | null>)}
   * @memberof serviceUtenteImplementation
   */
  async getUtenteById(id: number): Promise<eUtente | null> {
    try {
      const redisClient = await databaseCache.getInstance();

      const cacheKey = `utente_${id}`;

      // Controlla se l'utente è in cache
      const jsonData = await redisClient.get(cacheKey);
      if (jsonData) {
        const data = JSON.parse(jsonData); // Restituisce l'utente dalla cache
        const cacheObject = eUtente.fromJSON(data); // Assumendo che tu abbia una classe Utente
        return cacheObject;
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

  /**
   *
   *
   * @param {string} identificativo
   * @return {*}  {(Promise<eUtente | null>)}
   * @memberof serviceUtenteImplementation
   */
  async getUtenteByIdentificativo(
    identificativo: string,
  ): Promise<eUtente | null> {
    return await repositoryUtente.getByIdentificativo(identificativo);
  }

  /**
   *Recupera tutti gli utenti
   *
   * @param {object} [options]
   * @return {*}  {Promise<eUtente[]>}
   * @memberof serviceUtenteImplementation
   */
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

  /**
   *Crea un nuovo utente
   *
   * @param {string} codice_fiscale
   * @param {eProfilo[]} profili
   * @param {enumStato} stato
   * @return {*}  {(Promise<eUtente | null>)}
   * @memberof serviceUtenteImplementation
   */
  async createUtente(
    codice_fiscale: string,
    profili: eProfilo[],
    stato: enumStato,
  ): Promise<eUtente | null> {
    const redisClient = await databaseCache.getInstance();

    const nuovoUtente = new eUtente(0, codice_fiscale, stato);
    const savedUtente = await repositoryUtente.saveUtenteProfili(
      nuovoUtente,
      profili,
    );

    // Invalida la cache degli utenti
    await redisClient.del(`utenti_tutti`);
    return savedUtente;
  }

  /**
   *Crea un nuovo utente
   *
   * @param {eUtente} t
   * @param {eVeicolo[]} veicoli
   * @return {*}  {Promise<Boolean>}
   * @memberof serviceUtenteImplementation
   */
  async createAssociazioneUtenteVeicoli(
    t: eUtente,
    veicoli: eVeicolo[],
  ): Promise<Boolean> {
    const result = await repositoryUtente.saveAssociazioneUtenteVeicoli(
      t,
      veicoli,
    );
    return result;
  }

  /**
   *Aggiorna un utente esistente
   *
   * @param {number} id
   * @param {string} codice_fiscale
   * @param {enumStato} stato
   * @return {*}  {Promise<void>}
   * @memberof serviceUtenteImplementation
   */
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

  /**
   *Elimina un utente
   *
   * @param {number} id
   * @return {*}  {Promise<void>}
   * @memberof serviceUtenteImplementation
   */
  async deleteUtente(id: number): Promise<void> {
    const redisClient = await databaseCache.getInstance();

    const utenteDaEliminare = new eUtente(id, '', enumStato.attivo);
    await repositoryUtente.delete(utenteDaEliminare);

    // Invalida la cache dell'utente eliminato e la cache generale
    await redisClient.del(`utente_${id}`);
    await redisClient.del('utenti_tutti');
  }

  /**
   *Ottieni profili di un utente
   *
   * @param {number} idUtente
   * @return {*}  {(Promise<eProfilo[] | null>)}
   * @memberof serviceUtenteImplementation
   */
  async getProfiliByIdUtente(idUtente: number): Promise<eProfilo[] | null> {
    const redisClient = await databaseCache.getInstance();

    const cacheKey = `profili_utente_${idUtente}`;

    // Controlla se i profili sono in cache
    const jsonData = await redisClient.get(cacheKey);
    if (jsonData) {
      const dataArray = JSON.parse(jsonData); // dataArray è un array di oggetti plain
      const cacheObjectArray = dataArray.map((data: any) =>
        eProfilo.fromJSON(data),
      );
      return cacheObjectArray;
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

  /**
   *Ottieni permessi di un utente
   *
   * @param {number} id
   * @return {*}  {(Promise<ePermesso[] | null>)}
   * @memberof serviceUtenteImplementation
   */
  async getPermessiByIdUtente(id: number): Promise<ePermesso[] | null> {
    const redisClient = await databaseCache.getInstance();

    const cacheKey = `permessi_utente_${id}`;

    // Controlla se i profili sono in cache
    const jsonData = await redisClient.get(cacheKey);
    if (jsonData) {
      const dataArray = JSON.parse(jsonData); // dataArray è un array di oggetti plain
      const cacheObjectArray = dataArray.map((data: any) =>
        ePermesso.fromJSON(data),
      );
      return cacheObjectArray;
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

  /**
   *
   *
   * @param {number} id
   * @param {enumPermessoCategoria} categoriaPermesso
   * @param {enumPermessoTipo} tipoPermesso
   * @return {*}  {Promise<boolean>}
   * @memberof serviceUtenteImplementation
   */
  async hasPermessoByIdUtente(
    id: number,
    categoriaPermesso: enumPermessoCategoria,
    tipoPermesso: enumPermessoTipo,
  ): Promise<boolean> {
    // Ottieni i permessi dell'utente (dalla cache o dal database)
    const permessi = await this.getPermessiByIdUtente(id);

    if (!permessi) {
      return false;
    }

    // Verifica se tra i permessi c'è quello del tipo specificato
    const hasPermesso = permessi.some(
      (permesso) =>
        permesso.get_tipo() === tipoPermesso &&
        permesso.get_categoria() === categoriaPermesso &&
        permesso.get_stato() === enumStato.attivo,
    );

    return hasPermesso;
  }

  /**
   *
   *
   * @param {enumProfiloTipo} enumProfilo
   * @return {*}  {(Promise<eProfilo[] | null>)}
   * @memberof serviceUtenteImplementation
   */
  async getAllProfiliByEnum(
    enumProfilo: enumProfiloTipo,
  ): Promise<eProfilo[] | null> {
    return await repositoryUtente.getAllProfiliByEnum(enumProfilo);
  }

  /**
   *
   *
   * @param {number} idUtente
   * @param {number} idVeicolo
   * @return {*}  {Promise<void>}
   * @memberof serviceUtenteImplementation
   */
  async deleteAssociazioneUtenteVeicolo(
    idUtente: number,
    idVeicolo: number,
  ): Promise<void> {
    await repositoryUtente.deleteAssociazioneUtenteVeicolo(idUtente, idVeicolo);
  }
}

export const serviceUtente = new serviceUtenteImplementation();
