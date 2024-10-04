import { Transaction } from 'sequelize';
import { DaoInterfaceGeneric } from '../../interfaces/generic/daoInterfaceGeneric';
import { eTransito } from '../../../entity/svt/eTransito';
import {
  daoTransito,
  daoTransitoImplementation,
} from '../../dao/svt/daoTransito';
import { daoInitSvt, daoInitSvtImplementation } from '../../dao/svt/daoInitSvt';

class repositoryTransitoImplementation
  implements DaoInterfaceGeneric<eTransito>
{
  private daoTransito: daoTransitoImplementation;
  private daoInitSvt: daoInitSvtImplementation;

  constructor() {
    this.daoTransito = daoTransito;
    this.daoInitSvt = daoInitSvt;
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
  init(options?: {
    force?: boolean;
    alter?: boolean;
    logging?: boolean;
  }): Promise<boolean> {
    return this.daoInitSvt.init(options);
  }
}

// Esporta il DAO per l'uso nei servizi o nei controller
export const repositoryTransito = new repositoryTransitoImplementation();
