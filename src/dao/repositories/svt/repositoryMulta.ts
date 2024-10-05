import { DaoInterfaceGeneric } from '../../interfaces/generic/daoInterfaceGeneric';
import { daoMulta, daoMultaImplementation } from '../../dao/svt/daoMulta';
import { eMulta } from '../../../entity/svt/eMulta';

class repositoryMultaImplementation implements DaoInterfaceGeneric<eMulta> {
  private daoMulta: daoMultaImplementation;

  constructor() {
    this.daoMulta = daoMulta;
  }
  get(id: number): Promise<eMulta | null> {
    return this.daoMulta.get(id);
  }
  getAll(options?: object): Promise<eMulta[]> {
    return this.daoMulta.getAll(options);
  }
  async save(t: eMulta): Promise<eMulta | null> {
    return daoMulta.save(t);
  }
  update(t: eMulta): Promise<void> {
    return this.daoMulta.update(t);
  }
  delete(t: eMulta): Promise<void> {
    return this.daoMulta.delete(t);
  }
}

// Esporta il DAO per l'uso nei servizi o nei controller
export const repositoryMulta = new repositoryMultaImplementation();
