import { eMultaSpeedControl } from '../entity/svt/eMultaSpeedControl';
import { repositoryMulta } from '../dao/repositories/svt/repositoryMulta';
import databaseCache from '../utils/database-cache';
import logger from '../utils/logger-winston';
import { enumPolicyTipo } from '../entity/enum/enumPolicyTipo';
import { enumMultaStato } from '../entity/enum/enumMultaStato';
import { eTransito } from '../entity/svt/eTransito';
import { eMulta } from '../entity/svt/eMulta';
import { repositoryPolicy } from '../dao/repositories/svt/repositoryPolicy';
import { ePolicySpeedControl } from '../entity/svt/ePolicySpeedControl';
import { eUtente } from '../entity/utente/eUtente';
import { repositoryVeicolo } from '../dao/repositories/svt/repositoryVeicolo';
import { eTratta } from '../entity/svt/eTratta';
import { repositoryTratta } from '../dao/repositories/svt/repositoryTratta';
import { repositoryTransito } from '../dao/repositories/svt/repositoryTransito';
import { eBollettino } from '../entity/svt/eBollettino';
import { enumBollettinoStato } from '../entity/enum/enumBollettinoStato';
import { enumMessengerCoda } from '../entity/enum/enumMessengerCoda';
import { v4 as uuidv4 } from 'uuid';
import messenger from '../utils/messenger';
import { serviceUtente } from './serviceUtente';
import { eProfilo } from '../entity/utente/eProfilo';
import { serviceVarco } from './serviceVarco';
import { serviceTransito } from './serviceTransito';
import { eVarco } from '../entity/svt/eVarco';
import { eVistaTratta } from '../entity/vista/eVistaTratta';
import { serviceVeicolo } from './serviceVeicolo';
import { eVeicolo } from '../entity/svt/eVeicolo';
import { eVistaMulta } from '../entity/vista/eVistaMulta';
import { enumMeteoTipo } from '../entity/enum/enumMeteoTipo';
import { eVistaTransito } from '../entity/vista/eVistaTransito';
import { enumExportFormato } from '../entity/enum/enumExportFormato';

/**
 *classe che gestisce la logica di business dell'MultaSpeedControl
 *
 * @class serviceMultaSpeedControlImplementation
 */
class serviceMultaSpeedControlImplementation {
  /**
   *Recupera un MultaSpeedControl per ID
   *
   * @param {number} id
   * @return {*}  {(Promise<eMultaSpeedControl | null>)}
   * @memberof serviceMultaSpeedControlImplementation
   */
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
      logger.error('serviceMulta - err:', err);
      return null;
    }
  }

  /**
   *Crea un nuovo MultaSpeedControl
   *
   * @param {(number | null)} id_transito
   * @param {(number | null)} id_policy
   * @param {(enumPolicyTipo | null)} id_policy_type
   * @param {(number | null)} id_veicolo
   * @param {(number | null)} id_automobilista
   * @param {(boolean | null)} is_notturno
   * @param {(boolean | null)} is_recidivo
   * @param {(enumMultaStato | null)} stato
   * @param {number} speed
   * @param {number} speed_real
   * @param {number} speed_limit
   * @param {number} speed_delta
   * @return {*}  {(Promise<eMultaSpeedControl | null>)}
   * @memberof serviceMultaSpeedControlImplementation
   */
  async createMultaSpeedControl(
    id_transito: number | null,
    id_policy: number | null,
    id_policy_type: enumPolicyTipo | null,
    id_veicolo: number | null,
    id_automobilista: number | null,
    is_notturno: boolean | null,
    is_recidivo: boolean | null,
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
      id_veicolo,
      id_automobilista,
      is_notturno,
      is_recidivo,
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

  /**
   *Aggiorna un MultaSpeedControl esistente
   *
   * @param {number} id
   * @param {(number | null)} id_transito
   * @param {(number | null)} id_policy
   * @param {(enumPolicyTipo | null)} id_policy_type
   * @param {(number | null)} id_veicolo
   * @param {(number | null)} id_automobilista
   * @param {(boolean | null)} is_notturno
   * @param {(boolean | null)} is_recidivo
   * @param {(enumMultaStato | null)} stato
   * @param {number} speed
   * @param {number} speed_real
   * @param {number} speed_limit
   * @param {number} speed_delta
   * @return {*}  {Promise<void>}
   * @memberof serviceMultaSpeedControlImplementation
   */
  async updateMultaSpeedControl(
    id: number,
    id_transito: number | null,
    id_policy: number | null,
    id_policy_type: enumPolicyTipo | null,
    id_veicolo: number | null,
    id_automobilista: number | null,
    is_notturno: boolean | null,
    is_recidivo: boolean | null,
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
      id_veicolo,
      id_automobilista,
      is_notturno,
      is_recidivo,
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

  /**
   *Elimina un MultaSpeedControl
   *
   * @param {number} id
   * @return {*}  {Promise<void>}
   * @memberof serviceMultaSpeedControlImplementation
   */
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

  /**
   *
   *
   * @param {eMulta} objMulta
   * @param {(Partial<{
   *       id_transito: number | null;
   *       id_policy: number | null;
   *       tipo_policy: enumPolicyTipo | null;
   *       id_veicolo: number | null;
   *       id_automobilista: number | null;
   *       is_notturno: boolean | null;
   *       is_recidivo: boolean | null;
   *       stato: enumMultaStato | null;
   *     }>)} fieldsToUpdate
   * @return {*}  {Promise<void>}
   * @memberof serviceMultaSpeedControlImplementation
   */
  async updateFieldsMulta(
    objMulta: eMulta,
    fieldsToUpdate: Partial<{
      id_transito: number | null;
      id_policy: number | null;
      tipo_policy: enumPolicyTipo | null;
      id_veicolo: number | null;
      id_automobilista: number | null;
      is_notturno: boolean | null;
      is_recidivo: boolean | null;
      stato: enumMultaStato | null;
    }>,
  ): Promise<void> {
    try {
      const redisClient = await databaseCache.getInstance();

      await repositoryMulta.updateFieldsMulta(objMulta, fieldsToUpdate);
      await this.refreshMultaStato(objMulta);

      // Invalida la cache dell'Multa aggiornato e la cache generale
      await redisClient.del(`Multa_${objMulta.get_id()}`);
      await redisClient.del('Multa_tutte');
    } catch (err) {
      throw new Error(`serviceMulta - updateFields: ${err}`);
    }
  }

  /**
   *Funzione per calcolare la differenza di tempo in ore
   *
   * @param {Date} transitoIn
   * @param {Date} transitoOut
   * @return {*}  {number}
   * @memberof serviceMultaSpeedControlImplementation
   */
  calcolaDifferenzaOre(transitoIn: Date, transitoOut: Date): number {
    const diffInMillis = transitoOut.getTime() - transitoIn.getTime(); // Differenza in millisecondi
    const diffInHours = diffInMillis / (1000 * 60 * 60); // Converti in ore
    return diffInHours;
  }

  /**
   *Funzione per calcolare la velocità media
   *
   * @param {number} distanza
   * @param {number} ore
   * @return {*}  {number}
   * @memberof serviceMultaSpeedControlImplementation
   */
  calcolaVelocitaMedia(distanza: number, ore: number): number {
    if (ore === 0) {
      throw new Error('Il tempo di viaggio non può essere zero');
    }
    return distanza / ore; // Velocità media = distanza / tempo
  }

  /**
   *Funzione per calcolare la tolleranza
   *
   * @param {number} velocita
   * @return {*}  {number}
   * @memberof serviceMultaSpeedControlImplementation
   */
  calcolaTolleranza(velocita: number): number {
    const tolleranzaPercentuale = velocita * 0.05; // 5% della velocità
    return tolleranzaPercentuale > 5 ? tolleranzaPercentuale : 5; // Usa il massimo tra 5 km/h e il 5% della velocità
  }

  /**
   *Funzione per calcolare la velocità media con tolleranza
   *
   * @param {number} distanza
   * @param {number} ore
   * @return {*}  {number}
   * @memberof serviceMultaSpeedControlImplementation
   */
  calcolaVelocitaConTolleranza(distanza: number, ore: number): number {
    if (ore === 0) {
      throw new Error('Il tempo di viaggio non può essere zero');
    }

    const velocitaMedia = distanza / ore; // Velocità media = distanza / tempo
    const tolleranza = this.calcolaTolleranza(velocitaMedia); // Calcola la tolleranza

    return velocitaMedia - tolleranza; // Sottrai la tolleranza dalla velocità media
  }

  /**
   *
   *
   * @param {eTransito} transitoUscita
   * @return {*}  {(Promise<eMulta | null>)}
   * @memberof serviceMultaSpeedControlImplementation
   */
  async verificaMulta(transitoUscita: eTransito): Promise<eMulta | null> {
    let result = null;

    try {
      // Verifica che il transito abbia meteo e id_veicolo
      if (transitoUscita.get_meteo() && transitoUscita.get_id_veicolo()) {
        const meteo = transitoUscita.get_meteo()!;
        const id_varco = transitoUscita.get_id_varco()!;
        const id_veicolo = transitoUscita.get_id_veicolo()!;

        const tratta: eTratta | null =
          await repositoryTratta.getTrattaByIdVarcoUscita(
            transitoUscita.get_id_varco(),
          );
        if (!tratta) {
          logger.warn(
            `tratta nulla per transito uscita: ${transitoUscita.get_data_transito()}`,
          );
          return null;
        }

        const transitoIngresso: eTransito | null =
          await repositoryTransito.getTransitoIngressoByTransitoUscita(
            transitoUscita.get_id(),
          );
        if (!transitoIngresso) {
          logger.warn(
            `transito ingresso nullo per transito uscita: ${transitoUscita.get_data_transito()}`,
          );
          return null;
        }

        const data_in = new Date(transitoIngresso.get_data_transito());
        const data_ot = new Date(transitoUscita.get_data_transito());

        // Calcola la differenza in ore tra i due transiti
        const differenzaOre = this.calcolaDifferenzaOre(data_in, data_ot);

        // Calcola la velocità media
        const speed_real = this.calcolaVelocitaMedia(
          tratta.get_distanza(),
          differenzaOre,
        );

        const tolleranza = this.calcolaTolleranza(speed_real); // Calcola la tolleranza

        const speed = speed_real - tolleranza; // Sottrai la tolleranza dalla velocità media

        const policies: ePolicySpeedControl[] | null =
          await repositoryPolicy.getPoliciesByVarcoMeteoVeicolo(
            id_varco,
            meteo,
            id_veicolo,
          );
        if (!policies) {
          logger.warn(
            `non sono state trovate polocy per il transito in uscita: ${transitoUscita.get_data_transito()}`,
          );
          return null;
        }

        let idAutomobilista: number | null = null;
        const automobilista: eUtente | null =
          await repositoryVeicolo.getUtenteByIdVeicolo(id_veicolo);
        if (!!automobilista) {
          idAutomobilista = automobilista.get_id();
        }

        // Itera su tutte le policy trovate per il varco
        for (const policy of policies) {
          if (policy && speed !== null && speed > policy.get_speed_limit()) {
            // Calcola la differenza di velocità
            const speedDelta = speed - policy.get_speed_limit();

            const isNotturno: boolean = this.checkIfNotturno(
              transitoUscita.get_data_transito(),
            );
            const isRecidivo: boolean = false;
            if (idAutomobilista) {
              await this.checkIfRecidivo(idAutomobilista);
            }

            // Crea la multa se la velocità è maggiore del limite
            const objMulta = await this.createMultaSpeedControl(
              transitoUscita.get_id(),
              policy.get_id(),
              enumPolicyTipo.speed_control,
              id_veicolo,
              idAutomobilista,
              isNotturno, // Implementa la logica notturna
              isRecidivo, // Implementa la logica recidiva
              enumMultaStato.in_attesa,
              speed,
              speed_real,
              policy.get_speed_limit(),
              speedDelta,
            );

            if (objMulta) {
              result = objMulta;
            }
          } else {
            logger.info(`speed: ${speed} < ${policy.get_speed_limit()}`);
          }
        }
      } else {
        logger.warn(
          `impossibile procedere a controllo multa per transito: ${transitoUscita.get_data_transito()} check meteo o id_veicolo`,
        );
      }
    } catch (_error) {}

    return result;
  }

  async checkAutorizzazioneUtenteBollettino(
    objBollettino: eBollettino,
    idUtente: number,
  ): Promise<Boolean> {
    let result: Boolean = false;

    try {
      if (objBollettino) {
        const objUtente: eUtente | null =
          await serviceUtente.getUtenteById(idUtente);
        if (objUtente) {
          const objMulta: eMulta | null = await this.getMultaSpeedControlById(
            objBollettino.get_id_multa(),
          );
          if (objMulta) {
            if (objUtente.get_id() == objMulta.get_id_automobilista()) {
              result = true;
            } else {
              const objProfili: eProfilo[] | null =
                await serviceUtente.getProfiliByIdUtente(idUtente);
              if (objProfili) {
                let isOperatore: Boolean = false;
                const indexOperatore = objProfili.findIndex((obj) => {
                  return obj.get_id() === 1;
                });
                if (indexOperatore > -1) {
                  isOperatore = true;
                }

                if (isOperatore) {
                  result = true;
                }
              }
            }
          }
        }
      }
    } catch (_error) {
      throw new Error('errore in check autorizzazioni bollettino:' + _error);
    }

    return result;
  }

  /**
   *Funzione per verificare se il transito è notturno (ad esempio tra le 22:00 e le 6:00)
   *
   * @param {Date} dataTransito
   * @return {*}  {boolean}
   * @memberof serviceMultaSpeedControlImplementation
   */
  checkIfNotturno(dataTransito: Date): boolean {
    const hour = dataTransito.getHours();
    return hour >= 22 || hour < 6;
  }

  /**
   *Funzione per verificare se l'automobilista è recidivo
   *
   * @param {number} idAutomobilista
   * @return {*}  {Promise<boolean>}
   * @memberof serviceMultaSpeedControlImplementation
   */
  async checkIfRecidivo(idAutomobilista: number): Promise<boolean> {
    // Implementa la logica per controllare se l'automobilista ha avuto altre sanzioni recentemente
    const result =
      await repositoryMulta.getAllMulteSpeedControlByIdAutomobilista(
        idAutomobilista,
      );
    return result;
  }

  /**
   *
   *
   * @param {string} targa
   * @return {*}  {(Promise<eMulta[] | null>)}
   * @memberof serviceMultaSpeedControlImplementation
   */
  getAllMultePendingByTarga(targa: string): Promise<eMulta[] | null> {
    return repositoryMulta.getAllMultePendingByTarga(targa);
  }

  // METODI BOLLETTINO

  /**
   *
   *
   * @param {number} id
   * @return {*}  {(Promise<eBollettino | null>)}
   * @memberof serviceMultaSpeedControlImplementation
   */
  getBollettinoById(id: number): Promise<eBollettino | null> {
    return repositoryMulta.getBollettinoById(id);
  }
  /**
   *
   *
   * @param {string} uuid
   * @return {*}  {(Promise<eBollettino | null>)}
   * @memberof serviceMultaSpeedControlImplementation
   */
  getBollettinoByUUID(uuid: string): Promise<eBollettino | null> {
    return repositoryMulta.getBollettinoByUUID(uuid);
  }
  /**
   *
   *
   * @param {number} id
   * @return {*}  {(Promise<eBollettino | null>)}
   * @memberof serviceMultaSpeedControlImplementation
   */
  getBollettinoByIdMulta(id: number): Promise<eBollettino | null> {
    return repositoryMulta.getBollettinoByIdMulta(id);
  }
  /**
   *
   *
   * @param {object} [options]
   * @return {*}  {Promise<eBollettino[]>}
   * @memberof serviceMultaSpeedControlImplementation
   */
  getAllBollettini(options?: object): Promise<eBollettino[]> {
    return repositoryMulta.getAllBollettini(options);
  }
  /**
   *
   *
   * @param {eBollettino} t
   * @return {*}  {(Promise<eBollettino | null>)}
   * @memberof serviceMultaSpeedControlImplementation
   */
  async saveBollettino(t: eBollettino): Promise<eBollettino | null> {
    return repositoryMulta.saveBellettino(t);
  }
  /**
   *
   *
   * @param {eBollettino} t
   * @return {*}  {Promise<void>}
   * @memberof serviceMultaSpeedControlImplementation
   */
  async updateBollettino(t: eBollettino): Promise<void> {
    return repositoryMulta.updateBollettino(t);
  }
  /**
   *
   *
   * @param {eBollettino} t
   * @return {*}  {Promise<void>}
   * @memberof serviceMultaSpeedControlImplementation
   */
  deleteBollettino(t: eBollettino): Promise<void> {
    return repositoryMulta.deleteBollettino(t);
  }

  /**
   *
   *
   * @param {number} idMulta
   * @return {*}  {(Promise<eBollettino | null>)}
   * @memberof serviceMultaSpeedControlImplementation
   */
  async richiediBollettino(idMulta: number): Promise<eBollettino | null> {
    let result: eBollettino | null = null;

    try {
      const multa: eMultaSpeedControl | null =
        await repositoryMulta.getMultaSpeedControl(idMulta);
      if (!multa) {
        throw new Error(
          `errore in richiesta bollettino: multa con id ${idMulta}`,
        );
      } else {
        const obj: eBollettino | null =
          await this.getBollettinoByIdMulta(idMulta);
        if (!obj) {
          const uuidPagamento: string = uuidv4(); // Genera UUID univoco per il pagamento
          const importo: number | null = await repositoryMulta.getImportoMulta(
            multa.get_id(),
          );
          if (!importo) {
            throw new Error(
              `errore in richiesta bollettino: importo non calcolato per multa: ${multa.get_id()}`,
            );
          }

          const bollettino = new eBollettino(
            0,
            multa.get_id(),
            uuidPagamento,
            importo,
            null,
            enumBollettinoStato.richiesto,
          );
          result = await this.saveBollettino(bollettino);
          if (!result) {
            throw new Error(
              `errore in richiesta bollettino: errore in generazione per multa: ${multa.get_id()}`,
            );
          } else {
            const rabbitMQ = messenger.getInstance();

            // Connessione a RabbitMQ
            await rabbitMQ.connect();

            // Invia un messaggio alla coda 'tasks_queue'
            await rabbitMQ.sendToQueue(
              enumMessengerCoda.queueGeneraBollettino,
              JSON.stringify(result),
            );
          }
        } else {
          logger.warn(`bollettino gia presente per id multa: ${idMulta}`);
        }
      }
    } catch (err) {
      throw new Error('errore in richiesta bollettino:' + err);
    }

    return result;
  }

  /**
   *
   *
   * @param {eMulta} multa
   * @memberof serviceMultaSpeedControlImplementation
   */
  public getMultaStato = (multa: eMulta): enumMultaStato => {
    let result = enumMultaStato.indefinito;

    try {
      // Definizione delle regole come array di funzioni
      const rules: Array<() => enumMultaStato | null> = [
        () => {
          // "non processabile" se manca id_veicolo e path_immagine è null
          if (!multa.get_id_automobilista()) {
            return enumMultaStato.in_attesa;
          } else {
            return null;
          }
        },
        () => {
          // "non processabile" se manca id_veicolo e path_immagine è null
          if (multa.get_id_automobilista()) {
            return enumMultaStato.elaborato;
          } else {
            return null;
          }
        },
      ];

      // Trova la prima regola che soddisfa la condizione
      let sub_result = rules
        .map((rule) => rule())
        .find((stato) => stato !== null);

      if (sub_result) {
        result = sub_result;
      }

      // Se uno stato è stato determinato, aggiorna il multa
      //if (nuovoStato) {
      //multa.set_stato(nuovoStato);
      //}
    } catch (err) {
      logger.error('serviceMulta - err:', err);
    }

    return result;
  };

  /**
   *
   *
   * @param {eMulta} objMulta
   * @return {*}  {Promise<void>}
   * @memberof serviceMultaSpeedControlImplementation
   */
  async refreshMultaStato(objMulta: eMulta): Promise<void> {
    try {
      const statoUpdated: enumMultaStato = this.getMultaStato(objMulta);
      await repositoryMulta.updateFieldsMulta(objMulta, {
        stato: statoUpdated,
      });
      switch (statoUpdated) {
        case enumMultaStato.in_attesa:
          if (!objMulta.get_id_automobilista()) {
            const rabbitMQ = messenger.getInstance();
            // Connessione a RabbitMQ
            await rabbitMQ.connect();
            // Invia un messaggio alla coda 'tasks_queue'
            await rabbitMQ.sendToQueue(
              enumMessengerCoda.queueCheckMultaAutomobilista,
              JSON.stringify(objMulta),
            );
          }
          break;
        case enumMultaStato.elaborato:
          if (objMulta.get_id_automobilista()) {
            const objBollettino: eBollettino | null =
              await this.getBollettinoByIdMulta(objMulta.get_id());
            if (!objBollettino) {
              const rabbitMQ = messenger.getInstance();
              // Connessione a RabbitMQ
              await rabbitMQ.connect();
              // Invia un messaggio alla coda 'tasks_queue'
              await rabbitMQ.sendToQueue(
                enumMessengerCoda.queueCheckMultaBollettino,
                JSON.stringify(objMulta),
              );
            }
          }
          break;

        default:
          break;
      }
    } catch (err) {
      throw new Error(`refreshMultaStato: ${err}`);
    }
  }

  /**
   *
   *
   * @param {eBollettino} objBollettino
   * @param {(Partial<{
   *       id_multa: number | null;
   *       uuid: string | null;
   *       importo: number | null;
   *       path_bollettino: string | null;
   *       stato: enumBollettinoStato | null;
   *     }>)} fieldsToUpdate
   * @return {*}  {Promise<void>}
   * @memberof serviceMultaSpeedControlImplementation
   */
  async updateFieldsBollettino(
    objBollettino: eBollettino,
    fieldsToUpdate: Partial<{
      id_multa: number | null;
      uuid: string | null;
      importo: number | null;
      path_bollettino: string | null;
      stato: enumBollettinoStato | null;
    }>,
  ): Promise<void> {
    try {
      const redisClient = await databaseCache.getInstance();

      await repositoryMulta.updateFieldsBollettino(
        objBollettino,
        fieldsToUpdate,
      );

      // Invalida la cache dell'Bollettino aggiornato e la cache generale
      await redisClient.del(`Bollettino_${objBollettino.get_id()}`);
      await redisClient.del('Bollettino_tutti');
    } catch (err) {
      throw new Error(`serviceMulta - updateFields: ${err}`);
    }
  }

  /**
   *
   *
   * @param {enumExportFormato} formato
   * @param {Date} dataInizio
   * @param {Date} dataFine
   * @param {string[]} arrayTarghe
   * @param {number} idUtente
   * @return {*}  {(Promise<string | null>)}
   * @memberof serviceMultaSpeedControlImplementation
   */
  async getAllMulteExport(
    formato: enumExportFormato,
    dataInizio: Date,
    dataFine: Date,
    arrayTarghe: string[],
    idUtente: number,
  ): Promise<string | null> {
    let result: string | null = null;

    try {
      const objProfili: eProfilo[] | null =
        await serviceUtente.getProfiliByIdUtente(idUtente);
      if (objProfili) {
        let isOperatore: Boolean = false;
        const indexOperatore = objProfili.findIndex((obj) => {
          return obj.get_id() === 1;
        });
        if (indexOperatore > -1) {
          isOperatore = true;
        }

        let arrayMulte: eMultaSpeedControl[] | null = null;
        if (isOperatore) {
          arrayMulte = await repositoryMulta.getAllMulteSpeedControlToOperatore(
            dataInizio,
            dataFine,
            arrayTarghe,
          );
        } else {
          arrayMulte =
            await repositoryMulta.getAllMulteSpeedControlToAutomobilista(
              dataInizio,
              dataFine,
              arrayTarghe,
              idUtente,
            );
        }

        if (arrayMulte && arrayMulte.length > 0) {
          const arrayVistaMulte: eVistaMulta[] = []; // Inizializza l'array vuoto

          //(tratta: varco in, varco out, velocità media, delta rispetto al limite, condizioni ambientali)
          for (const objMulta of arrayMulte) {
            const idTransitoUscita: number | null = objMulta.get_id_transito();
            if (idTransitoUscita) {
              const objTransitoUscita: eTransito | null =
                await serviceTransito.getTransitoById(idTransitoUscita);
              if (!objTransitoUscita) {
                throw new Error(`transito null: `);
              }

              const objTransitoIngresso: eTransito | null =
                await repositoryTransito.getTransitoIngressoByTransitoUscita(
                  objTransitoUscita.get_id(),
                );
              if (!objTransitoIngresso) {
                throw new Error(`transito ingresso null: `);
              }

              const idVeicolo: number | null = objMulta.get_id_veicolo();
              if (!idVeicolo) {
                throw new Error(`Id veicolo null: `);
              }
              const objVeicolo: eVeicolo | null =
                await serviceVeicolo.getVeicoloById(idVeicolo);
              if (!objVeicolo) {
                throw new Error(`veicolo null: `);
              }

              const objTratta: eTratta | null =
                await repositoryTratta.getTrattaByIdVarcoUscita(
                  objTransitoUscita.get_id_varco(),
                );
              if (!objTratta) {
                throw new Error(`tratta null: `);
              }

              const objVarcoIngresso: eVarco | null =
                await serviceVarco.getVarcoById(
                  objTratta.get_id_varco_ingresso(),
                );
              if (!objVarcoIngresso) {
                throw new Error(`varco ingresso null: `);
              }
              const objVarcoUscita: eVarco | null =
                await serviceVarco.getVarcoById(
                  objTratta.get_id_varco_uscita(),
                );
              if (!objVarcoUscita) {
                throw new Error(`varco uscita null: `);
              }
              const objMeteo: enumMeteoTipo | null =
                objTransitoUscita.get_meteo();
              if (!objMeteo) {
                throw new Error(`meteo null: `);
              }

              const vistaTransitoIngresso: eVistaTransito = new eVistaTransito(
                objTransitoIngresso.get_id(),
                objTransitoIngresso.get_data_transito(),
                objTransitoIngresso.get_speed(),
                objTransitoIngresso.get_speed_real(),
                objVarcoIngresso,
                objTransitoIngresso.get_meteo(),
                objVeicolo,
                objTransitoIngresso.get_path_immagine(),
                objTransitoIngresso.get_stato(),
              );
              const vistaTransitoUscita: eVistaTransito = new eVistaTransito(
                objTransitoIngresso.get_id(),
                objTransitoIngresso.get_data_transito(),
                objTransitoIngresso.get_speed(),
                objTransitoIngresso.get_speed_real(),
                objVarcoIngresso,
                objTransitoIngresso.get_meteo(),
                objVeicolo,
                objTransitoIngresso.get_path_immagine(),
                objTransitoIngresso.get_stato(),
              );
              const vistaTratta: eVistaTratta = new eVistaTratta(
                objTratta.get_id(),
                objTratta.get_cod(),
                objTratta.get_descrizione(),
                vistaTransitoIngresso,
                vistaTransitoUscita,
                objTratta.get_distanza(),
                objTratta.get_stato(),
              );
              const vistaMulta: eVistaMulta = new eVistaMulta(
                objMulta.get_id(),
                vistaTratta,
                objVeicolo,
                objMeteo,
                objMulta.get_speed(),
                objMulta.get_speed_delta(),
              );

              arrayVistaMulte.push(vistaMulta);
            }
          }
          switch (formato) {
            case enumExportFormato.JSON:
              result = JSON.stringify(arrayVistaMulte);
              break;
          }
        }
      }
    } catch (err) {
      throw new Error(`errore in getAllMulteExport ${err}`);
    }

    return result;
  }
}

export const serviceMulta = new serviceMultaSpeedControlImplementation();
