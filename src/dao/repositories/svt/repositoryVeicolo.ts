import { Transaction } from 'sequelize';
import { DaoInterfaceGeneric } from '../../interfaces/generic/daoInterfaceGeneric';
import { eUtente } from '../../../entity/utente/eUtente';
import { eVeicolo } from '../../../entity/svt/eVeicolo';
import { daoVeicolo, daoVeicoloImplementation } from '../../../dao/dao/svt/daoVeicolo';
import { daoVeicoloUtente, daoVeicoloUtenteImplementation } from '../../../dao/dao/svt/daoVeicoloUtente';
import { daoInitSvt, daoInitSvtImplementation } from '../../../dao/dao/svt/daoInitSvt';


class repositoryVeicoloImplementation implements DaoInterfaceGeneric<eVeicolo> {
  private daoVeicolo: daoVeicoloImplementation;
  private daoVeicoloUtente: daoVeicoloUtenteImplementation;
  private daoInitSvt: daoInitSvtImplementation;

  constructor() {
    this.daoVeicolo = daoVeicolo;
    this.daoVeicoloUtente = daoVeicoloUtente;
    this.daoInitSvt = daoInitSvt;
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
  init(options?: {
    force?: boolean;
    alter?: boolean;
    logging?: boolean;
  }): Promise<boolean> {
    return this.daoInitSvt.init(options);
  }
}

// Esporta il DAO per l'uso nei servizi o nei controller
export const repositoryVeicolo = new repositoryVeicoloImplementation();