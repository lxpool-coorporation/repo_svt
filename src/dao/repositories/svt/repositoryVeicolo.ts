import { Transaction } from 'sequelize';
import { DaoInterfaceGeneric } from '../../interfaces/generic/daoInterfaceGeneric';
import { eUtente } from '../../../entity/utente/eUtente';
import { eVeicolo } from '../../../entity/svt/eVeicolo';
import { daoVeicolo, daoVeicoloImplementation } from '../../dao/svt/daoVeicolo';

class repositoryVeicoloImplementation implements DaoInterfaceGeneric<eVeicolo> {
  private daoVeicolo: daoVeicoloImplementation;

  constructor() {
    this.daoVeicolo = daoVeicolo;
  }
  get(id: number): Promise<eVeicolo | null> {
    return this.daoVeicolo.get(id);
  }
  getByTarga(targa: string): Promise<eVeicolo | null> {
    return this.daoVeicolo.getByTarga(targa);
  }
  getAll(options?: object): Promise<eVeicolo[]> {
    return this.daoVeicolo.getAll(options);
  }
  save(
    t: eVeicolo,
    options?: { transaction?: Transaction },
  ): Promise<eVeicolo | null> {
    return this.daoVeicolo.save(t, options);
  }
  update(t: eVeicolo, options?: object): Promise<void> {
    return this.daoVeicolo.update(t, options);
  }
  delete(t: eVeicolo, options?: { transaction?: Transaction }): Promise<void> {
    return this.daoVeicolo.delete(t, options);
  }
  getUtenteByIdVeicolo(idVeicolo: number): Promise<eUtente | null> {
    return this.daoVeicolo.getUtenteByIdVeicolo(idVeicolo);
  }
}

// Esporta il DAO per l'uso nei servizi o nei controller
export const repositoryVeicolo = new repositoryVeicoloImplementation();
