import { ormProfilo } from '../../../models/utente/ormProfilo';
import { eUtente } from '../../../entity/utente/eUtente';
import { ormUtente } from '../../../models/utente/ormUtente';
import { ormProfiloUtente } from '../../../models/utente/ormProfiloUtente';
import { daoProfiloImplementation } from './daoProfilo';

export class daoProfiloUtenteImplementation extends daoProfiloImplementation {
  // Metodo per ottenere gli utenti associati ad un profilo
  async getUtenti(idProfilo: number): Promise<eUtente[]> {
    const obj = await ormProfilo.findByPk(idProfilo);
    if (!obj) {
      throw new Error('Profilo non trovato');
    } else {
      const objOrmProfiloUtente = obj as ormProfiloUtente;
      const objUtenti: ormUtente[] = await objOrmProfiloUtente.getUtenti(); // Metodo Sequelize

      return objUtenti.map((a) => {
        return new eUtente(a.id, a.identificativo, a.stato);
      });
    }
  }
}

// Esporta il DAO per l'uso nei servizi o nei controller
export const daoProfiloUtente = new daoProfiloUtenteImplementation();
