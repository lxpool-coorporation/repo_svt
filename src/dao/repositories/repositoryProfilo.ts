import { Transaction } from 'sequelize';
import { daoProfilo, daoProfiloImplementation } from '../dao/utente/daoProfilo';
import { eProfilo } from '../../entity/utente/eProfilo';
import { DaoInterfaceGeneric } from '../interfaces/generic/daoInterfaceGeneric';
import { ePermesso } from '../../entity/utente/ePermesso';
import {
  daoProfiloPermesso,
  daoProfiloPermessoImplementation,
} from '../dao/utente/daoProfiloPermesso';
import { eUtente } from '@/entity/utente/eUtente';
import {
  daoUtenteProfilo,
  daoUtenteProfiloImplementation,
} from '../dao/utente/daoUtenteProfilo';

class repositoryProfiloImplementation implements DaoInterfaceGeneric<eProfilo> {
  private daoProfilo: daoProfiloImplementation;
  private daoUtenteProfilo: daoUtenteProfiloImplementation;
  private daoProfiloPermesso: daoProfiloPermessoImplementation;

  constructor() {
    this.daoProfilo = daoProfilo;
    this.daoUtenteProfilo = daoUtenteProfilo;
    this.daoProfiloPermesso = daoProfiloPermesso;
  }
  get(id: number): Promise<eProfilo | null> {
    return this.daoProfilo.get(id);
  }
  getAll(options?: object): Promise<eProfilo[]> {
    return this.daoProfilo.getAll(options);
  }
  save(
    t: eProfilo,
    options?: { transaction?: Transaction },
  ): Promise<eProfilo | null> {
    return this.daoProfilo.save(t, options);
  }
  update(t: eProfilo, options?: object): Promise<void> {
    return this.daoProfilo.update(t, options);
  }
  delete(t: eProfilo, options?: { transaction?: Transaction }): Promise<void> {
    return this.daoProfilo.delete(t, options);
  }
  getUtenti(id: number): Promise<eUtente[] | null> {
    return this.daoUtenteProfilo.getUtenti(id);
  }
  getPermessi(id: number): Promise<ePermesso[] | null> {
    return this.daoProfiloPermesso.getPermessi(id);
  }
  getProfili(id: number): Promise<eProfilo[] | null> {
    return this.daoProfiloPermesso.getProfili(id);
  }
}

// Esporta il DAO per l'uso nei servizi o nei controller
export const repositoryProfilo = new repositoryProfiloImplementation();
