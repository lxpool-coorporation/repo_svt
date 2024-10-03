import { Transaction } from 'sequelize';
import { ePermesso } from '../../../entity/utente/ePermesso';
import { DaoInterfaceGeneric } from '../../interfaces/generic/daoInterfaceGeneric';
import { eProfilo } from '../../../entity/utente/eProfilo';
import {
  daoPermesso,
  daoPermessoImplementation,
} from '../../dao/utente/daoPermesso';
import {
  daoPermessoProfilo,
  daoPermessoProfiloImplementation,
} from '../../dao/utente/daoPermessoProfilo';
import { eUtente } from '../../../entity/utente/eUtente';
import {
  daoProfiloUtente,
  daoProfiloUtenteImplementation,
} from '../../dao/utente/daoProfiloUtente';

class repositoryPermessoImplementation
  implements DaoInterfaceGeneric<ePermesso>
{
  private daoPermesso: daoPermessoImplementation;
  private daoPermessoProfilo: daoPermessoProfiloImplementation;
  private daoProfiloUtente: daoProfiloUtenteImplementation;

  constructor() {
    this.daoPermesso = daoPermesso;
    this.daoPermessoProfilo = daoPermessoProfilo;
    this.daoProfiloUtente = daoProfiloUtente;
  }
  get(id: number): Promise<ePermesso | null> {
    return this.daoPermesso.get(id);
  }
  getAll(options?: object): Promise<ePermesso[]> {
    return this.daoPermesso.getAll(options);
  }
  save(
    t: ePermesso,
    options?: { transaction?: Transaction },
  ): Promise<ePermesso | null> {
    return this.daoPermesso.save(t, options);
  }
  update(t: ePermesso, options?: object): Promise<void> {
    return this.daoPermesso.update(t, options);
  }
  delete(t: ePermesso, options?: { transaction?: Transaction }): Promise<void> {
    return this.daoPermesso.delete(t, options);
  }
  getProfili(id_permesso: number): Promise<eProfilo[] | null> {
    return this.daoPermessoProfilo.getProfili(id_permesso);
  }
  async getUtenti(idPermesso: number): Promise<eUtente[] | null> {
    const objProfili = await this.daoPermessoProfilo.getProfili(idPermesso);
    if (objProfili && objProfili.length > 0) {
      const objUtenti = await Promise.all(
        objProfili.map(async (profilo) => {
          return this.daoProfiloUtente.getUtenti(profilo.get_id());
        }),
      );
      // Appiattisce l'array, se `getPermessi` restituisce array di permessi per ogni profilo
      return objUtenti.flat();
    }

    return null;
  }
}

// Esporta il DAO per l'uso nei servizi o nei controller
export const repositoryPermesso = new repositoryPermessoImplementation();
