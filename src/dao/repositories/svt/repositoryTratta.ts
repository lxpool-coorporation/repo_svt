import { Transaction } from 'sequelize';
import { DaoInterfaceGeneric } from '../../interfaces/generic/daoInterfaceGeneric';
import { eTratta } from '../../../entity/svt/eTratta';
import {
  daoTratta,
  daoTrattaImplementation,
} from '../../../dao/dao/svt/daoTratta';
import {
  daoInitSvt,
  daoInitSvtImplementation,
} from '../../../dao/dao/svt/daoInitSvt';
import { eVarco } from '../../../entity/svt/eVarco';
import {
  daoTrattaVarco,
  daoTrattaVarcoImplementation,
} from '../../../dao/dao/svt/daoTrattaVarco';

class repositoryTrattaImplementation implements DaoInterfaceGeneric<eTratta> {
  private daoTratta: daoTrattaImplementation;
  private daoTrattaVarco: daoTrattaVarcoImplementation;
  private daoInitSvt: daoInitSvtImplementation;

  constructor() {
    this.daoTratta = daoTratta;
    this.daoTrattaVarco = daoTrattaVarco;
    this.daoInitSvt = daoInitSvt;
  }
  get(id: number): Promise<eTratta | null> {
    return this.daoTratta.get(id);
  }
  getAll(options?: object): Promise<eTratta[]> {
    return this.daoTratta.getAll(options);
  }
  save(
    t: eTratta,
    options?: { transaction?: Transaction },
  ): Promise<eTratta | null> {
    return this.daoTratta.save(t, options);
  }
  update(t: eTratta, options?: object): Promise<void> {
    return this.daoTratta.update(t, options);
  }
  delete(t: eTratta, options?: { transaction?: Transaction }): Promise<void> {
    return this.daoTratta.delete(t, options);
  }
  getVarchi(idTratta: number): Promise<eVarco[] | null> {
    return this.daoTrattaVarco.getVarchi(idTratta);
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
export const repositoryTratta = new repositoryTrattaImplementation();
