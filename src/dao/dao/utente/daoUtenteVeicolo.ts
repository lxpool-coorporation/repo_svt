import { ormVeicolo } from '../../../models/svt/ormVeicolo';
import { daoUtenteImplementation } from './daoUtente';
import { eVeicolo } from '../../../entity/svt/eVeicolo';
import { ormUtente } from '../../../models/utente/ormUtente';
import { ormUtenteVeicolo } from '../../../models/utente/ormUtenteVeicolo';

export class daoUtenteVeicoloImplementation extends daoUtenteImplementation {
  // Metodo per ottenere i Veicoli associati all'utente
  async getVeicoli(idUtente: number): Promise<eVeicolo[]> {
    const obj = await ormUtente.findByPk(idUtente);
    if (!obj) {
      throw new Error('Utente non trovato');
    } else {
      const objOrmUtenteVeicolo = obj as ormUtenteVeicolo;
      const objVeicoli: ormVeicolo[] = await objOrmUtenteVeicolo.getVeicoli(); // Metodo Sequelize

      return objVeicoli.map((a) => {
        return new eVeicolo(a.id, a.tipo, a.targa, a.stato);
      });
    }
  }
}

// Esporta il DAO per l'uso nei servizi o nei controller
export const daoUtenteVeicolo = new daoUtenteVeicoloImplementation();
