import { Transaction } from 'sequelize';
import { ePermesso } from '../../../entity/utente/ePermesso';
import { DaoInterfaceGeneric } from '../../interfaces/generic/daoInterfaceGeneric';
import {
  daoPermesso,
  daoPermessoImplementation,
} from '../../dao/utente/daoPermesso';

class repositoryPermessoImplementation
  implements DaoInterfaceGeneric<ePermesso>
{
  private daoPermesso: daoPermessoImplementation;

  constructor() {
    this.daoPermesso = daoPermesso;
  }
  get(id: number): Promise<ePermesso | null> {
    return this.daoPermesso.get(id);
  }
  getAll(options?: object): Promise<ePermesso[]> {
    return this.daoPermesso.getAll(options);
  }
  save(
    t: ePermesso,
    options?: { transaction?: Transaction },
  ): Promise<ePermesso | null> {
    return this.daoPermesso.save(t, options);
  }
  update(t: ePermesso, options?: object): Promise<void> {
    return this.daoPermesso.update(t, options);
  }

  delete(t: ePermesso, options?: { transaction?: Transaction }): Promise<void> {
    return this.daoPermesso.delete(t, options);
  }
}

// Esporta il DAO per l'uso nei servizi o nei controller
export const repositoryPermesso = new repositoryPermessoImplementation();
