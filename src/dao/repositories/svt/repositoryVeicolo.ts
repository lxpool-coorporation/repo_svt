import { Transaction } from 'sequelize';
import { DaoInterfaceGeneric } from '../../interfaces/generic/daoInterfaceGeneric';
import { eUtente } from '../../../entity/utente/eUtente';
import { eVeicolo } from '../../../entity/svt/eVeicolo';
import { daoVeicolo, daoVeicoloImplementation } from '../../dao/svt/daoVeicolo';
import {
  daoVeicoloUtente,
  daoVeicoloUtenteImplementation,
} from '../../dao/svt/daoVeicoloUtente';

class repositoryVeicoloImplementation implements DaoInterfaceGeneric<eVeicolo> {
  private daoVeicolo: daoVeicoloImplementation;
  private daoVeicoloUtente: daoVeicoloUtenteImplementation;

  constructor() {
    this.daoVeicolo = daoVeicolo;
    this.daoVeicoloUtente = daoVeicoloUtente;
  }
  get(id: number): Promise<eVeicolo | null> {
    return this.daoVeicolo.get(id);
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
  getUtenti(idVeicolo: number): Promise<eUtente[] | null> {
    return this.daoVeicoloUtente.getUtenti(idVeicolo);
  }
}

// Esporta il DAO per l'uso nei servizi o nei controller
export const repositoryVeicolo = new repositoryVeicoloImplementation();
