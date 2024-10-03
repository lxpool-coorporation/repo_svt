import { ormPermesso } from '../../../models/utente/ormPermesso';
import { eProfilo } from '../../../entity/utente/eProfilo';
import { ormPermessoProfilo } from '../../../models/utente/ormPermessoProfilo';
import { ormProfilo } from '../../../models/utente/ormProfilo';
import { daoPermessoImplementation } from './daoPermesso';

export class daoPermessoProfiloImplementation extends daoPermessoImplementation {
  // Metodo per ottenere i profili associati al permesso
  async getProfili(idPermesso: number): Promise<eProfilo[]> {
    const obj = await ormPermesso.findByPk(idPermesso);
    if (!obj) {
      throw new Error('Permesso non trovato');
    } else {
      const objOrmPermessoProfilo = obj as ormPermessoProfilo;
      const objProfili: ormProfilo[] = await objOrmPermessoProfilo.getProfili(); // Metodo Sequelize

      return objProfili.map((a) => {
        return new eProfilo(a.id, a.cod, a.descrizione, a.stato);
      });
    }
  }
}

// Esporta il DAO per l'uso nei servizi o nei controller
export const daoPermessoProfilo = new daoPermessoProfiloImplementation();
