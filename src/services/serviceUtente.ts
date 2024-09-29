import { daoUtente } from '../dao/utente/daoUtente';
import { eUtente } from '../entity/utente/eUtente';

class UtenteService {
    // Recupera un utente per ID
    async getUtenteById(id: number): Promise<eUtente | null> {
        return await daoUtente.get(id);
    }

    // Recupera tutti gli utenti
    async getAllUtenti(): Promise<eUtente[]> {
        return await daoUtente.getAll();
    }

    // Crea un nuovo utente
    async createUtente(id_profilo: number, codice_fiscale: string, id_stato: number): Promise<eUtente|null> {
        const nuovoUtente = new eUtente(0, id_profilo, codice_fiscale, id_stato);
        return await daoUtente.save(nuovoUtente);
    }

    // Aggiorna un utente esistente
    async updateUtente(id: number, id_profilo: number, codice_fiscale: string, id_stato: number): Promise<void> {
        const utente = new eUtente(id, id_profilo, codice_fiscale, id_stato);
        await daoUtente.update(utente);
    }

    // Elimina un utente
    async deleteUtente(id: number): Promise<void> {
        const utenteDaEliminare = new eUtente(id, 0, '', 0);
        await daoUtente.delete(utenteDaEliminare);
    }
}

export const utenteService = new UtenteService();
