import { eProfilo } from '../entity/utente/eProfilo';
import { enumStato } from '../entity/enum/enumStato';
import { eUtente } from '../entity/utente/eUtente';
import { repositoryUtente } from '../dao/repositories/repositoryUtente';

// classe che gestisce la logica di business dell'utente
class serviceUtenteImplementation {
  // Recupera un utente per ID
  async getUtenteById(id: number): Promise<eUtente | null> {
    return await repositoryUtente.get(id);
  }

  // Recupera tutti gli utenti
  async getAllUtenti(): Promise<eUtente[]> {
    return await repositoryUtente.getAll();
  }

  // Crea un nuovo utente
  async createUtente(
    codice_fiscale: string,
    stato: enumStato,
  ): Promise<eUtente | null> {
    const nuovoUtente = new eUtente(0, codice_fiscale, stato);
    return await repositoryUtente.save(nuovoUtente);
  }

  // Aggiorna un utente esistente
  async updateUtente(
    id: number,
    codice_fiscale: string,
    stato: enumStato,
  ): Promise<void> {
    const utente = new eUtente(id, codice_fiscale, stato);
    await repositoryUtente.update(utente);
  }

  // Elimina un utente
  async deleteUtente(id: number): Promise<void> {
    const utenteDaEliminare = new eUtente(id, '', enumStato.attivo);
    await repositoryUtente.delete(utenteDaEliminare);
  }

  // Ottieni profili di un utente
  async getProfiliByIdUtente(id: number): Promise<eProfilo[] | null> {
    return await repositoryUtente.getProfili(id);
  }

  // Inizializza struttura db utente
  async initStrutturaUtente(options?: {
    force?: boolean;
    alter?: boolean;
    logging?: boolean;
  }): Promise<boolean> {
    return await repositoryUtente.init(options);
  }
}

export const serviceUtente = new serviceUtenteImplementation();
