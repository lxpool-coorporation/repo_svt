import { Transaction } from 'sequelize';
import { DaoInterfaceGeneric } from '../../interfaces/generic/daoInterfaceGeneric';
import { eVarco } from '../../../entity/vst/eVarco';
import { daoVarco, daoVarcoImplementation } from '../../dao/vst/daoVarco';
import {
  daoVarcoTransito,
  daoVarcoTransitoImplementation,
} from '../../dao/vst/daoVarcoTransito';
import { daoInitSvt, daoInitSvtImplementation } from '../../dao/vst/daoInitSvt';
import { eTransito } from '../../../entity/vst/eTransito';

class repositoryVarcoImplementation implements DaoInterfaceGeneric<eVarco> {
  private daoVarco: daoVarcoImplementation;
  private daoVarcoTransito: daoVarcoTransitoImplementation;
  private daoInitSvt: daoInitSvtImplementation;

  constructor() {
    this.daoVarco = daoVarco;
    this.daoVarcoTransito = daoVarcoTransito;
    this.daoInitSvt = daoInitSvt;
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
  init(options?: {
    force?: boolean;
    alter?: boolean;
    logging?: boolean;
  }): Promise<boolean> {
    return this.daoInitSvt.init(options);
  }
}

// Esporta il DAO per l'uso nei servizi o nei controller
export const repositoryVarco = new repositoryVarcoImplementation();
