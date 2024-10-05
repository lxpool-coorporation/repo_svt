import { Transaction } from 'sequelize';
import { DaoInterfaceGeneric } from '../../interfaces/generic/daoInterfaceGeneric';
import { eVarco } from '../../../entity/svt/eVarco';
import { daoVarco, daoVarcoImplementation } from '../../dao/svt/daoVarco';
import {
  daoVarcoTransito,
  daoVarcoTransitoImplementation,
} from '../../dao/svt/daoVarcoTransito';
import { eTransito } from '../../../entity/svt/eTransito';
import {
  daoVarcoPolicy,
  daoVarcoPolicyImplementation,
} from '../../../dao/dao/svt/daoVarcoPolicy';
import { ePolicy } from '../../../entity/svt/ePolicy';

class repositoryVarcoImplementation implements DaoInterfaceGeneric<eVarco> {
  private daoVarco: daoVarcoImplementation;
  private daoVarcoTransito: daoVarcoTransitoImplementation;
  private daoVarcoPolicy: daoVarcoPolicyImplementation;

  constructor() {
    this.daoVarco = daoVarco;
    this.daoVarcoTransito = daoVarcoTransito;
    this.daoVarcoPolicy = daoVarcoPolicy;
  }
  get(id: number): Promise<eVarco | null> {
    return this.daoVarco.get(id);
  }
  getAll(options?: object): Promise<eVarco[]> {
    return this.daoVarco.getAll(options);
  }
  save(
    t: eVarco,
    options?: { transaction?: Transaction },
  ): Promise<eVarco | null> {
    return this.daoVarco.save(t, options);
  }
  update(t: eVarco, options?: object): Promise<void> {
    return this.daoVarco.update(t, options);
  }
  delete(t: eVarco, options?: { transaction?: Transaction }): Promise<void> {
    return this.daoVarco.delete(t, options);
  }
  getTransiti(idVarco: number): Promise<eTransito[] | null> {
    return this.daoVarcoTransito.getTransiti(idVarco);
  }
  getPolicies(idVarco: number): Promise<ePolicy[] | null> {
    return this.daoVarcoPolicy.getPolicies(idVarco);
  }
}

// Esporta il DAO per l'uso nei servizi o nei controller
export const repositoryVarco = new repositoryVarcoImplementation();
