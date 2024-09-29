import { Request, Response } from 'express';
import { daoUtente } from '../dao/utente/daoUtente';  // Il DAO
import { eUtente } from '../entity/utente/eUtente';

// Controller per gestire le operazioni su `Utente`

// Recupera un utente per ID
export async function getUtenteById(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);  // Ottieni l'ID dalla richiesta
        const utente = await daoUtente.get(id);
        if (!utente) {
            return res.status(404).json({ message: `Utente con ID ${id} non trovato` });
        }
        return res.json(utente);
    } catch (error) {
        const err = error as Error;
        return res.status(500).json({ message: err.message });
    }
}

// Recupera tutti gli utenti
export async function getAllUtenti(req: Request, res: Response) {
    try {
        const utenti = await daoUtente.getAll();
        return res.json(utenti);
    } catch (error) {
        const err = error as Error;
        return res.status(500).json({ message: err.message });
    }
}

// Crea un nuovo utente
export async function createUtente(req: Request, res: Response) {
    try {
        const { id_profilo, codice_fiscale, id_stato } = req.body;  // Ottieni i campi dal body della richiesta
        const nuovoUtente = new eUtente(0, id_profilo, codice_fiscale, id_stato);  // Passa 0 o null per l'ID
        const utenteCreato = await daoUtente.save(nuovoUtente);
        return res.status(201).json(utenteCreato);
    } catch (error) {
        const err = error as Error;
        return res.status(400).json({ message: err.message });
    }
}

// Aggiorna un utente esistente
export async function updateUtente(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);  // Ottieni l'ID dalla richiesta
        const { id_profilo, codice_fiscale, id_stato } = req.body;  // Ottieni i campi dal body
        const utenteAggiornato = new eUtente(id, id_profilo, codice_fiscale, id_stato);
        await daoUtente.update(utenteAggiornato);
        return res.json({ message: `Utente con ID ${id} aggiornato con successo` });
    } catch (error) {
        const err = error as Error;
        return res.status(400).json({ message: err.message });
    }
}

// Elimina un utente
export async function deleteUtente(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);  // Ottieni l'ID dalla richiesta
        const utenteDaEliminare = new eUtente(id, 0, '', 0);  // Crei un oggetto con ID solo per eliminarlo
        await daoUtente.delete(utenteDaEliminare);
        return res.json({ message: `Utente con ID ${id} eliminato con successo` });
    } catch (error) {
        const err = error as Error;
        return res.status(500).json({ message: err.message });
    }
}
