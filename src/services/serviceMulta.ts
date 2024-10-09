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

  // Funzione per calcolare la differenza di tempo in ore
  calcolaDifferenzaOre(transitoIn: Date, transitoOut: Date): number {
    const diffInMillis = transitoOut.getTime() - transitoIn.getTime(); // Differenza in millisecondi
    const diffInHours = diffInMillis / (1000 * 60 * 60); // Converti in ore
    return diffInHours;
  }

  // Funzione per calcolare la velocità media
  calcolaVelocitaMedia(distanza: number, ore: number): number {
    if (ore === 0) {
      throw new Error('Il tempo di viaggio non può essere zero');
    }
    return distanza / ore; // Velocità media = distanza / tempo
  }

  // Funzione per calcolare la tolleranza
  calcolaTolleranza(velocita: number): number {
    const tolleranzaPercentuale = velocita * 0.05; // 5% della velocità
    return tolleranzaPercentuale > 5 ? tolleranzaPercentuale : 5; // Usa il massimo tra 5 km/h e il 5% della velocità
  }

  // Funzione per calcolare la velocità media con tolleranza
  calcolaVelocitaConTolleranza(distanza: number, ore: number): number {
    if (ore === 0) {
      throw new Error('Il tempo di viaggio non può essere zero');
    }

    const velocitaMedia = distanza / ore; // Velocità media = distanza / tempo
    const tolleranza = this.calcolaTolleranza(velocitaMedia); // Calcola la tolleranza

    return velocitaMedia - tolleranza; // Sottrai la tolleranza dalla velocità media
  }

  async verificaSanzione(transitoUscita: eTransito): Promise<eMulta | null> {
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
          console.log(
            `Nessuna tratta trovata per il varco di uscita con id ${transitoUscita.get_id_varco()}`,
          );
          return null;
        }

        const transitoIngresso: eTransito | null =
          await repositoryTransito.getTransitoIngressoByTransitoUscita(
            transitoUscita.get_id(),
          );
        if (!transitoIngresso) {
          console.log(
            `Nessun transito di ingresso trovato per il varco di uscita con id ${transitoUscita.get_id()}`,
          );
          return null;
        }

        // Calcola la differenza in ore tra i due transiti
        const differenzaOre = this.calcolaDifferenzaOre(
          transitoIngresso.get_data_transito(),
          transitoUscita.get_data_transito(),
        );

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
          console.log(`Nessuna policy trovata per il varco con id ${id_varco}`);
          return null;
        }

        const automobilista: eUtente[] | null =
          await repositoryVeicolo.getUtentiByIdVeicolo(id_veicolo);
        if (!automobilista) {
          console.log(
            `Nessuna automobilista trovata per il veicolo con id ${id_veicolo}`,
          );
          return null;
        }
        // Itera su tutte le policy trovate per il varco
        for (const policy of policies) {
          console.log(policy);

          console.log(
            'speed: ' +
              speed +
              ' speed real: ' +
              speed_real +
              ' speed limit: ' +
              policy.get_speed_limit(),
          );

          if (policy && speed !== null && speed > policy.get_speed_limit()) {
            // Calcola la differenza di velocità
            const speedDelta = speed - policy.get_speed_limit();

            console.log('LIMITE SUPERATO! +' + speedDelta + ' km/h');

            const isNotturno: boolean = this.checkIfNotturno(
              transitoUscita.get_data_transito(),
            );
            const isRecidivo: boolean = await this.checkIfRecidivo(
              automobilista[0].get_id(),
            );

            // Crea la multa se la velocità è maggiore del limite
            const multa = await this.createMultaSpeedControl(
              transitoUscita.get_id(),
              policy.get_id(),
              enumPolicyTipo.speed_control,
              automobilista[0].get_id(),
              isNotturno, // Implementa la logica notturna
              isRecidivo, // Implementa la logica recidiva
              enumMultaStato.in_attesa,
              speed,
              speed_real,
              policy.get_speed_limit(),
              speedDelta,
            );

            console.log(
              `Multa generata per transito ${transitoUscita.get_id()} con id multa: ${multa?.get_id()}`,
            );
          } else {
            console.log('limite non superato!');
          }
        }
      }
    } catch (error) {
      console.error('Errore durante la verifica delle sanzioni: ', error);
    }

    return result;
  }

  // Funzione per verificare se il transito è notturno (ad esempio tra le 22:00 e le 6:00)
  checkIfNotturno(dataTransito: Date): boolean {
    const hour = dataTransito.getHours();
    return hour >= 22 || hour < 6;
  }

  // Funzione per verificare se l'automobilista è recidivo
  async checkIfRecidivo(idAutomobilista: number): Promise<boolean> {
    // Implementa la logica per controllare se l'automobilista ha avuto altre sanzioni recentemente
    const result =
      await repositoryMulta.getAllMulteSpeedControlByIdAutomobilista(
        idAutomobilista,
      );
    return result;
  }

  // METODI BOLLETTINO

  getBollettinoById(id: number): Promise<eBollettino | null> {
    return repositoryMulta.getBollettinoById(id);
  }
  getAllBollettini(options?: object): Promise<eBollettino[]> {
    return repositoryMulta.getAllBollettini(options);
  }
  async saveBellettino(t: eBollettino): Promise<eBollettino | null> {
    try {
      const objMulta: eMulta | null = await this.getMultaSpeedControlById(
        t.get_id_multa(),
      );
      if (objMulta) {
        //const importo = '150.50';
        //const uuidPagamento = uuidv4(); // Genera UUID univoco per il pagamento
        console.log(objMulta);
      }
    } catch (error) {
      throw new Error('errore: in save Bollettino:' + error);
    }

    return repositoryMulta.saveBellettino(t);
  }
  async updateBollettino(t: eBollettino): Promise<void> {
    return repositoryMulta.updateBollettino(t);
  }
  deleteBollettino(t: eBollettino): Promise<void> {
    return repositoryMulta.deleteBollettino(t);
  }
}

export const serviceMulta = new serviceMultaSpeedControlImplementation();
