import { Transaction } from 'sequelize';
import { DaoInterfaceGeneric } from '../../interfaces/generic/daoInterfaceGeneric';
import { eTratta } from '../../../entity/vst/eTratta';
import { daoTratta, daoTrattaImplementation } from '../../dao/vst/daoTratta';
import { eVarco } from '../../../entity/vst/eVarco';
import {
  daoTrattaVarco,
  daoTrattaVarcoImplementation,
} from '../../dao/vst/daoTrattaVarco';

class repositoryTrattaImplementation implements DaoInterfaceGeneric<eTratta> {
  private daoTratta: daoTrattaImplementation;
  private daoTrattaVarco: daoTrattaVarcoImplementation;

  constructor() {
    this.daoTratta = daoTratta;
    this.daoTrattaVarco = daoTrattaVarco;
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
}

// Esporta il DAO per l'uso nei servizi o nei controller
export const repositoryTratta = new repositoryTrattaImplementation();
