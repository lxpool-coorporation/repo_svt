import { Transaction } from 'sequelize';
import { daoProfilo, daoProfiloImplementation } from '../dao/utente/daoProfilo';
import { eProfilo } from '../../entity/utente/eProfilo';

class repositoryProfiloImplementation implements DaoInterfaceGeneric<eProfilo> {
  private daoProfilo: daoProfiloImplementation;

  constructor() {
    this.daoProfilo = daoProfilo;
  }
  get(id: number): Promise<eProfilo | null> {
    return this.daoProfilo.get(id);
  }
  getAll(): Promise<eProfilo[]> {
    return this.daoProfilo.getAll();
  }
  save(
    t: eProfilo,
    options?: { transaction?: Transaction },
  ): Promise<eProfilo | null> {
    return this.daoProfilo.save(t, options);
  }
  update(t: eProfilo, ...params: string[]): Promise<void> {
    return this.daoProfilo.update(t, ...params);
  }
  delete(t: eProfilo, options?: { transaction?: Transaction }): Promise<void> {
    return this.daoProfilo.delete(t, options);
  }
}

// Esporta il DAO per l'uso nei servizi o nei controller
export const repositoryProfilo = new repositoryProfiloImplementation();
