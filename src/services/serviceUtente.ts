import { enumStato } from '../entity/enum/enumStato';
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
    async createUtente(codice_fiscale: string, stato: enumStato): Promise<eUtente|null> {
        const nuovoUtente = new eUtente(0, codice_fiscale, stato);
        return await daoUtente.save(nuovoUtente);
    }

    // Aggiorna un utente esistente
    async updateUtente(id: number, codice_fiscale: string, stato: enumStato): Promise<void> {
        const utente = new eUtente(id,  codice_fiscale,stato);
        await daoUtente.update(utente);
    }

    // Elimina un utente
    async deleteUtente(id: number): Promise<void> {
        const utenteDaEliminare = new eUtente(id, '', enumStato.attivo);
        await daoUtente.delete(utenteDaEliminare);
    }
}

export const utenteService = new UtenteService();
