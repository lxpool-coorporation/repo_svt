import { ormProfilo } from '../../../models/utente/ormProfilo';
import { daoUtenteImplementation } from './daoUtente';
import { eProfilo } from '../../../entity/utente/eProfilo';
import { ormUtente } from '../../../models/utente/ormUtente';
import { ormUtenteProfilo } from '../../../models/utente/ormUtenteProfilo';

export class daoUtenteProfiloImplementation extends daoUtenteImplementation {
  // Metodo per ottenere i profili associati all'utente
  async getProfili(idUtente: number): Promise<eProfilo[]> {
    const obj = await ormUtente.findByPk(idUtente);
    if (!obj) {
      throw new Error('Utente non trovato');
    } else {
      const objOrmUtenteProfilo = obj as ormUtenteProfilo;
      const objProfili: ormProfilo[] = await objOrmUtenteProfilo.getProfili(); // Metodo Sequelize

      return objProfili.map((a) => {
        return new eProfilo(a.id, a.cod, a.descrizione, a.stato);
      });
    }
  }
}

// Esporta il DAO per l'uso nei servizi o nei controller
export const daoUtenteProfilo = new daoUtenteProfiloImplementation();
