import { ormVeicolo } from '../../../models/svt/ormVeicolo';
import { eUtente } from '../../../entity/utente/eUtente';
import { ormUtente } from '../../../models/utente/ormUtente';
import { daoVeicoloImplementation } from './daoVeicolo';

import dbOrm from '../../../models'; // Importa tutti i modelli e l'istanza Sequelize

export class daoVeicoloUtenteImplementation extends daoVeicoloImplementation {
  // Metodo per ottenere gli utenti associati ad un Veicolo
  async getUtenti(idVeicolo: number): Promise<eUtente[]> {
    const obj = await ormVeicolo.findByPk(idVeicolo);
    if (!obj) {
      throw new Error('Veicolo non trovato');
    } else {
      const objUtenti: ormUtente[] =
        await dbOrm.objOrmVeicoloUtente.getUtenti(); // Metodo Sequelize

      return objUtenti.map((a) => {
        return new eUtente(a.id, a.identificativo, a.stato);
      });
    }
  }
}

// Esporta il DAO per l'uso nei servizi o nei controller
export const daoVeicoloUtente = new daoVeicoloUtenteImplementation();
