import { ormProfilo } from '../../../models/utente/ormProfilo';
import { daoUtenteImplementation } from './daoUtente';
import { eProfilo } from '../../../entity/utente/eProfilo';
import { ormUtenteProfilo } from '../../../models/utente/ormUtenteProfilo';
import { eUtente } from '../../../entity/utente/eUtente';
import { ormProfiloUtente } from '../../../models/utente/ormProfiloUtente';
import { ormUtente } from '../../../models/utente/ormUtente';

export class daoUtenteProfiloImplementation extends daoUtenteImplementation {
  // Metodo per ottenere i profili associati all'utente
  async getProfili(idUtente: number): Promise<eProfilo[]> {
    const obj = await ormUtente.findByPk(idUtente);
    if (!obj) {
      throw new Error('Utente non trovato');
    } else {
      const objProfili: ormProfilo[] = await obj.getProfili(); // Metodo Sequelize

      return objProfili.map((a) => {
        return new eProfilo(a.id, a.cod, a.descrizione, a.stato);
      });
    }
  }
  // Metodo per ottenere gli utenti associati ad un profilo
  async getUtenti(idProfilo: number): Promise<eUtente[]> {
    const obj = await ormProfiloUtente.findByPk(idProfilo);
    if (!obj) {
      throw new Error('Profilo non trovato');
    } else {
      const objUtenti: ormUtente[] = await obj.getUtenti(); // Metodo Sequelize

      return objUtenti.map((a) => {
        return new eUtente(a.id, a.codice_fiscale, a.stato);
      });
    }
  }
}

// Esporta il DAO per l'uso nei servizi o nei controller
export const daoUtenteProfilo = new daoUtenteProfiloImplementation();
