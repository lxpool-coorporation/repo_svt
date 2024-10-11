import { enumVeicoloStato } from '../entity/enum/enumVeicoloStato';
import { enumStato } from '../entity/enum/enumStato';
import { eVeicolo } from '../entity/svt/eVeicolo';
import { repositoryVeicolo } from '../dao/repositories/svt/repositoryVeicolo';
import databaseCache from '../utils/database-cache';
import logger from '../utils/logger-winston';
import { enumVeicoloTipo } from '../entity/enum/enumVeicoloTipo';
import { eUtente } from '../entity/utente/eUtente';
import { serviceUtente } from './serviceUtente';
import { enumProfiloTipo } from '../entity/enum/enumProfiloTipo';
import { enumMessengerCoda } from '../entity/enum/enumMessengerCoda';
import messenger from '../utils/messenger';
import { serviceMulta } from './serviceMulta';
import { eMulta } from '../entity/svt/eMulta';

// classe che gestisce la logica di business dell'Veicolo
class serviceVeicoloImplementation {
  // Recupera un Veicolo per ID
  async getVeicoloById(id: number): Promise<eVeicolo | null> {
    try {
      const redisClient = await databaseCache.getInstance();
      console.log("PASSO IRA")
      const cacheKey = `Veicolo_${id}`;

      // Controlla se l'Veicolo è in cache
      
      const jsonData = await redisClient.get(cacheKey);
      if (jsonData) {
        console.log("FROM CACHE VEICOLO!")
        const data = JSON.parse(jsonData); // Restituisce l'Veicolo dalla cache
        const cacheObject = eVeicolo.fromJSON(data); // Assumendo che tu abbia una classe Veicolo
        return cacheObject;
      }

      // Se non è in cache, recupera dal repository
      const Veicolo = await repositoryVeicolo.get(id);
      if (Veicolo) {
        console.log(Veicolo)
        // Memorizza l'Veicolo in cache per 1 ora
        await redisClient.set(cacheKey, JSON.stringify(Veicolo), {
          EX: parseInt(process.env.REDIS_CACHE_TIMEOUT || '3600'),
        });
      }

      return Veicolo;
    } catch (err) {
      logger.error('serviceVeicolo - err:', err);
      return null;
    }
  }

  async getVeicoloByTarga(targa: string): Promise<eVeicolo | null> {
    let result: eVeicolo | null = null;
    try {
      // Se non è in cache, recupera dal repository
      const Veicolo = await repositoryVeicolo.getByTarga(targa);

      result = Veicolo;
    } catch (err) {
      logger.error('serviceVeicolo - err:', err);
    }
    return result;
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
    stato: enumVeicoloStato,
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
    stato: enumVeicoloStato,
  ): Promise<void> {

    try{
      const redisClient = await databaseCache.getInstance();

      const objVeicolo = new eVeicolo(id, tipo, targa, stato);
      await repositoryVeicolo.update(objVeicolo);
  
      await this.refreshStatoVeicolo(objVeicolo);
  
      // Invalida la cache dell'Veicolo aggiornato e la cache generale
      await redisClient.del(`Veicolo_${id}`);
      await redisClient.del('Veicoli_tutti');
    }catch(error){
      throw new Error('errore: ' + error);
    }
    
  }

  // Elimina un Veicolo
  async deleteVeicolo(id: number): Promise<void> {
    const redisClient = await databaseCache.getInstance();

    const VeicoloDaEliminare = new eVeicolo(
      id,
      enumVeicoloTipo.autoveicoli,
      '',
      enumVeicoloStato.in_attesa,
    );
    await repositoryVeicolo.delete(VeicoloDaEliminare);

    // Invalida la cache dell'Veicolo eliminato e la cache generale
    await redisClient.del(`Veicolo_${id}`);
    await redisClient.del('Veicoli_tutti');
  }

  // Ottieni Utenti di un Veicolo
  async getUtenteByIdVeicolo(idVeicolo: number): Promise<eUtente | null> {
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
    const Utente = await repositoryVeicolo.getUtenteByIdVeicolo(idVeicolo);
    if (Utente) {
      // Memorizza i Utenti in cache per 1 ora
      await redisClient.set(cacheKey, JSON.stringify(Utente), {
        EX: parseInt(process.env.REDIS_CACHE_TIMEOUT || '3600'),
      });
    }
    return Utente;
  }

  // Ottieni Utenti di un Veicolo
  async getAutomobilistaByTarga(targa: string): Promise<eUtente | null> {
    let result: eUtente | null = null;

    try {
      const veicolo: eVeicolo | null =
        await repositoryVeicolo.getByTarga(targa);
      if (!veicolo) {
        throw new Error(`targa non trovata: ${targa}`);
      }

      // Se non sono in cache, recupera dal repository
      const automobilista = await repositoryVeicolo.getUtenteByIdVeicolo(
        veicolo.get_id(),
      );
      if (automobilista) {
        result = automobilista;
      }
    } catch (err) {
      throw new Error(`error: ${err}`);
    }

    return result;
  }

  // add automobilista/targa
  async checkAddAutomobilistaTarga(
    targa: string,
    cf: string,
  ): Promise<eUtente | null> {
    let automobilista: eUtente | null = null;

    try {
      const veicoloTarga: eVeicolo | null = await this.getVeicoloByTarga(targa);
      if (!veicoloTarga) {
        throw new Error(`targa non trovata: ${targa}`);
      }

      const profiliAutomobilista = await serviceUtente.getAllProfiliByEnum(
        enumProfiloTipo.automobilista,
      );
      if (!profiliAutomobilista) {
        throw new Error(`tipo profilo automobilista non trovato`);
      }

      const automobilistaTarga: eUtente | null =
        await this.getAutomobilistaByTarga(targa);
      if (!automobilistaTarga) {
          automobilista = await serviceUtente.getUtenteByIdentificativo(cf);
          if (!automobilista) {
            automobilista = await serviceUtente.createUtente(
              cf,
              profiliAutomobilista,
              enumStato.attivo,
            );
          } else {
          }
          if (!automobilista) {
            throw new Error(`automobilista non creato/trovato`);
          }

          const veicoli: eVeicolo[] = [veicoloTarga];
          await serviceUtente.createAssociazioneUtenteVeicoli(
              automobilista,
              veicoli,
            );
        } else {
          automobilista = await serviceUtente.getUtenteById(
            automobilistaTarga.get_id(),
          );
          if (!automobilista) {
            throw new Error(`automobilista from targa non trovato`);
          }
          if (automobilista.get_identificativo() !== cf) {
            console.log(
              `alert: cf: ${cf} diverso da ${automobilista.get_identificativo} -> necessario aggiornamento`,
            );

            // TO DO -> delete vecchia associazione
            await serviceUtente.deleteAssociazioneUtenteVeicolo(
              automobilista.get_id(),
              veicoloTarga.get_id(),
            );

            // TO DO -> crea nuova associazione
            const veicoli: eVeicolo[] = [veicoloTarga];
            await serviceUtente.createAssociazioneUtenteVeicoli(
              automobilista,
              veicoli,
            );
          }
        }

        const objMulte:eMulta[]|null = await serviceMulta.getAllMultePendingByTarga(targa);
        if(objMulte && automobilista){

          objMulte.forEach(async(multa:eMulta) => {

            if(automobilista)
            {
              multa.set_id_automobilista(automobilista.get_id());
              await serviceMulta.updateFieldsMulta(multa, {id_automobilista: automobilista.get_id()});
              serviceMulta.refreshMultaStato(multa);
            }
            
          });

        }


    } catch (err) {
      throw new Error(`error: ${err}`);
    }

    return automobilista;
  }

  public getVeicoloStato = (veicolo: eVeicolo): enumVeicoloStato => {
    let result = enumVeicoloStato.in_attesa;

    try {
      // Definizione delle regole come array di funzioni
      const rules: Array<() => enumVeicoloStato | null> = [
        () => {
          // "non processabile" se manca id_veicolo e path_immagine è null
          if (veicolo.get_tipo() == enumVeicoloTipo.indefinito) {
            return enumVeicoloStato.in_attesa;
          } else {
            return null;
          }
        },
        () => {
          // "non processabile" se manca id_veicolo e path_immagine è null
          if (veicolo.get_tipo() !== enumVeicoloTipo.indefinito) {
            return enumVeicoloStato.acquisito;
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

      // Se uno stato è stato determinato, aggiorna il veicolo
      //if (nuovoStato) {
      //veicolo.set_stato(nuovoStato);
      //}
    } catch (err) {
      logger.error('serviceVeicolo - err:', err);
    }

    return result;
  };

  async refreshStatoVeicolo(objVeicolo: eVeicolo): Promise<void> {
    try {
      const statoUpdated: enumVeicoloStato = this.getVeicoloStato(objVeicolo);
      objVeicolo.set_stato(statoUpdated);
      await repositoryVeicolo.update(objVeicolo);
      
      switch (statoUpdated) {
        case enumVeicoloStato.in_attesa:
          if (objVeicolo.get_tipo()==enumVeicoloTipo.indefinito) {
            
              const rabbitMQ = messenger.getInstance();
              // Connessione a RabbitMQ
              await rabbitMQ.connect();
              // Invia un messaggio alla coda 'tasks_queue'
              await rabbitMQ.sendToQueue(
                enumMessengerCoda.queueTransitoVeicoloTipo,
                JSON.stringify(objVeicolo),
              );
            }

        case enumVeicoloStato.acquisito:
          if (objVeicolo.get_tipo()!==enumVeicoloTipo.indefinito) {

            const objMulte:eMulta[]|null = await serviceMulta.getAllMultePendingByTarga(objVeicolo.get_targa());
            if(objMulte){

              objMulte.forEach(async(multa:eMulta) => {

                await serviceMulta.refreshMultaStato(multa);
                
              });

            }
          }
      }
    } catch (err) {
      throw new Error(`refreshVeicoloStato: ${err}`);
    }
  }

}

export const serviceVeicolo = new serviceVeicoloImplementation();
