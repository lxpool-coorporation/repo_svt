import { ormProfilo } from '../../../models/utente/ormProfilo';
import { eUtente } from '../../../entity/utente/eUtente';
import { ormUtente } from '../../../models/utente/ormUtente';
import { daoProfiloImplementation } from './daoProfilo';

import dbOrm from '../../../models'; // Importa tutti i modelli e l'istanza Sequelize

export class daoProfiloUtenteImplementation extends daoProfiloImplementation {
  // Metodo per ottenere gli utenti associati ad un profilo
  async getUtenti(idProfilo: number): Promise<eUtente[]> {
    const obj = await ormProfilo.findByPk(idProfilo);
    if (!obj) {
      throw new Error('Profilo non trovato');
    } else {
      const objUtenti: ormUtente[] =
        await dbOrm.objOrmProfiloUtente.getUtenti(); // Metodo Sequelize

      return objUtenti.map((a) => {
        return new eUtente(a.id, a.identificativo, a.stato);
      });
    }
  }
}

// Esporta il DAO per l'uso nei servizi o nei controller
export const daoProfiloUtente = new daoProfiloUtenteImplementation();
