import { ormPermesso } from '../../../models/utente/ormPermesso';
import { daoProfiloImplementation } from './daoProfilo';
import { ePermesso } from '../../../entity/utente/ePermesso';
import { ormProfiloPermesso } from '../../../models/utente/ormProfiloPermesso';
import { ormProfilo } from '../../../models/utente/ormProfilo';

export class daoProfiloPermessoImplementation extends daoProfiloImplementation {
  // Metodo per ottenere i profili associati all'utente
  async getPermessi(idProfilo: number): Promise<ePermesso[]> {
    const obj = await ormProfilo.findByPk(idProfilo);
    if (!obj) {
      throw new Error('Profilo non trovato');
    } else {
      const objOrmProfiloPermesso = obj as ormProfiloPermesso;
      const objProfili: ormPermesso[] =
        await objOrmProfiloPermesso.getPermessi(); // Metodo Sequelize

      return objProfili.map((a) => {
        return new ePermesso(
          a.id,
          a.categoria,
          a.tipo,
          a.cod,
          a.descrizione,
          a.stato,
        );
      });
    }
  }
}

// Esporta il DAO per l'uso nei servizi o nei controller
export const daoProfiloPermesso = new daoProfiloPermessoImplementation();
