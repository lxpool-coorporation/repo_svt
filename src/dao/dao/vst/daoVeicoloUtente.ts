import { ormVeicolo } from '../../../models/vst/ormVeicolo';
import { eUtente } from '../../../entity/utente/eUtente';
import { ormUtente } from '../../../models/utente/ormUtente';
import { ormVeicoloUtente } from '../../../models/vst/ormVeicoloUtente';
import { daoVeicoloImplementation } from './daoVeicolo';

export class daoVeicoloUtenteImplementation extends daoVeicoloImplementation {
  // Metodo per ottenere gli utenti associati ad un Veicolo
  async getUtenti(idVeicolo: number): Promise<eUtente[]> {
    const obj = await ormVeicolo.findByPk(idVeicolo);
    if (!obj) {
      throw new Error('Veicolo non trovato');
    } else {
      const objOrmVeicoloUtente = obj as ormVeicoloUtente;
      const objUtenti: ormUtente[] = await objOrmVeicoloUtente.getUtenti(); // Metodo Sequelize

      return objUtenti.map((a) => {
        return new eUtente(a.id, a.identificativo, a.stato);
      });
    }
  }
}

// Esporta il DAO per l'uso nei servizi o nei controller
export const daoVeicoloUtente = new daoVeicoloUtenteImplementation();
