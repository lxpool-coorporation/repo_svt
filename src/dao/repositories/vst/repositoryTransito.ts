import { Transaction } from 'sequelize';
import { DaoInterfaceGeneric } from '../../interfaces/generic/daoInterfaceGeneric';
import { eTransito } from '../../../entity/vst/eTransito';
import {
  daoTransito,
  daoTransitoImplementation,
} from '../../dao/vst/daoTransito';

class repositoryTransitoImplementation
  implements DaoInterfaceGeneric<eTransito>
{
  private daoTransito: daoTransitoImplementation;

  constructor() {
    this.daoTransito = daoTransito;
  }
  get(id: number): Promise<eTransito | null> {
    return this.daoTransito.get(id);
  }
  getAll(options?: object): Promise<eTransito[]> {
    return this.daoTransito.getAll(options);
  }
  save(
    t: eTransito,
    options?: { transaction?: Transaction },
  ): Promise<eTransito | null> {
    return this.daoTransito.save(t, options);
  }
  update(t: eTransito, options?: object): Promise<void> {
    return this.daoTransito.update(t, options);
  }
  delete(t: eTransito, options?: { transaction?: Transaction }): Promise<void> {
    return this.daoTransito.delete(t, options);
  }
}

// Esporta il DAO per l'uso nei servizi o nei controller
export const repositoryTransito = new repositoryTransitoImplementation();
