import {
  daoUtenteProfilo,
  daoUtenteProfiloImplementation,
} from '../../dao/utente/daoUtenteProfilo';
import { daoUtente, daoUtenteImplementation } from '../../dao/utente/daoUtente';
import { eUtente } from '../../../entity/utente/eUtente';
import { Transaction } from 'sequelize';
import { eProfilo } from '../../../entity/utente/eProfilo';
import { DaoInterfaceGeneric } from '../../interfaces/generic/daoInterfaceGeneric';
import { ePermesso } from '../../../entity/utente/ePermesso';
import {
  daoProfiloPermesso,
  daoProfiloPermessoImplementation,
} from '../../dao/utente/daoProfiloPermesso';
import { eVeicolo } from '../../../entity/svt/eVeicolo';
import {
  daoUtenteVeicolo,
  daoUtenteVeicoloImplementation,
} from '../../dao/utente/daoUtenteVeicolo';

class repositoryUtenteImplementation implements DaoInterfaceGeneric<eUtente> {
  private daoUtente: daoUtenteImplementation;
  private daoUtenteProfilo: daoUtenteProfiloImplementation;
  private daoUtenteVeicolo: daoUtenteVeicoloImplementation;
  private daoProfiloPermesso: daoProfiloPermessoImplementation;

  constructor() {
    this.daoUtente = daoUtente;
    this.daoUtenteProfilo = daoUtenteProfilo;
    this.daoUtenteVeicolo = daoUtenteVeicolo;
    this.daoProfiloPermesso = daoProfiloPermesso;
  }

  get(id: number): Promise<eUtente | null> {
    return this.daoUtente.get(id);
  }
  getByIdentificativo(cf: string): Promise<eUtente | null> {
    return this.daoUtente.getByIdentificativo(cf);
  }
  getAll(options?: object): Promise<eUtente[]> {
    return this.daoUtente.getAll(options);
  }
  save(
    t: eUtente,
    options?: { transaction?: Transaction },
  ): Promise<eUtente | null> {
    return this.daoUtente.save(t, options);
  }
  update(t: eUtente, options?: object): Promise<void> {
    return this.daoUtente.update(t, options);
  }
  delete(t: eUtente, options?: { transaction?: Transaction }): Promise<void> {
    return this.daoUtente.delete(t, options);
  }
  getProfili(idUtente: number): Promise<eProfilo[] | null> {
    return this.daoUtenteProfilo.getProfili(idUtente);
  }
  getVeicoli(idUtente: number): Promise<eVeicolo[] | null> {
    return this.daoUtenteVeicolo.getVeicoli(idUtente);
  }
  async getPermessi(id: number): Promise<ePermesso[] | null> {
    const objProfili = await this.daoUtenteProfilo.getProfili(id);
    if (objProfili && objProfili.length > 0) {
      const objPermessi = await Promise.all(
        objProfili.map(async (profilo) => {
          return this.daoProfiloPermesso.getPermessi(profilo.get_id());
        }),
      );
      // Appiattisce l'array, se `getPermessi` restituisce array di permessi per ogni profilo
      return objPermessi.flat();
    }

    return null;
  }
}

// Esporta il DAO per l'uso nei servizi o nei controller
export const repositoryUtente = new repositoryUtenteImplementation();
