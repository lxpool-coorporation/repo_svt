import { ormPermesso } from '../../../models/utente/ormPermesso';
import { daoProfiloImplementation } from './daoProfilo';
import { ePermesso } from '../../../entity/utente/ePermesso';
import { ormProfiloPermesso } from '../../../models/utente/ormProfiloPermesso';
import { eProfilo } from '../../../entity/utente/eProfilo';
import { ormPermessoProfilo } from '../../../models/utente/ormPermessoProfilo';

export class daoProfiloPermessoImplementation extends daoProfiloImplementation {
  // Metodo per ottenere i profili associati all'utente
  async getPermessi(idProfilo: number): Promise<ePermesso[]> {
    const obj = await ormProfiloPermesso.findByPk(idProfilo);
    if (!obj) {
      throw new Error('Profilo non trovato');
    } else {
      const objProfili: ormPermesso[] = await obj.getPermessi(); // Metodo Sequelize

      return objProfili.map((a) => {
        return new ePermesso(a.id, a.cod, a.descrizione, a.stato);
      });
    }
  }

  // Metodo per ottenere i profili associati al permesso
  async getProfili(idPermesso: number): Promise<eProfilo[]> {
    const obj = await ormPermessoProfilo.findByPk(idPermesso);
    if (!obj) {
      throw new Error('Profilo non trovato');
    } else {
      const objProfili: ormPermesso[] = await obj.getProfili(); // Metodo Sequelize

      return objProfili.map((a) => {
        return new eProfilo(a.id, a.cod, a.descrizione, a.stato);
      });
    }
  }
}

// Esporta il DAO per l'uso nei servizi o nei controller
export const daoProfiloPermesso = new daoProfiloPermessoImplementation();
