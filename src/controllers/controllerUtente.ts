import { Request, Response } from 'express';
import { daoUtente } from '../dao/dao/utente/daoUtente'; // Il DAO
import { eUtente } from '../entity/utente/eUtente';
import { enumStato } from '../entity/enum/enumStato';

// Controller per gestire le operazioni su `Utente`

/**
 *Recupera un utente per ID
 *
 * @export
 * @param {Request} req
 * @param {Response} res
 * @return {*}
 */
export async function getUtenteById(req: Request, res: Response) {
  try {
    const id = Number(req.params.id); // Ottieni l'ID dalla richiesta
    const utente = await daoUtente.get(id);
    if (!utente) {
      return res
        .status(404)
        .json({ message: `Utente con ID ${id} non trovato` });
    }
    return res.json(utente);
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({ message: err.message });
  }
}

/**
 *Recupera tutti gli utenti
 *
 * @export
 * @param {Request} _req
 * @param {Response} res
 * @return {*}
 */
export async function getAllUtenti(_req: Request, res: Response) {
  try {
    const utenti = await daoUtente.getAll();
    return res.json(utenti);
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({ message: err.message });
  }
}

/**
 *Crea un nuovo utente
 *
 * @export
 * @param {Request} req
 * @param {Response} res
 * @return {*}
 */
export async function createUtente(req: Request, res: Response) {
  try {
    const { codice_fiscale, stato } = req.body; // Ottieni i campi dal body della richiesta
    const nuovoUtente = new eUtente(0, codice_fiscale, stato); // Passa 0 o null per l'ID
    const utenteCreato = await daoUtente.save(nuovoUtente);
    return res.status(201).json(utenteCreato);
  } catch (error) {
    const err = error as Error;
    return res.status(400).json({ message: err.message });
  }
}

/**
 *Aggiorna un utente esistente
 *
 * @export
 * @param {Request} req
 * @param {Response} res
 * @return {*}
 */
export async function updateUtente(req: Request, res: Response) {
  try {
    const id = Number(req.params.id); // Ottieni l'ID dalla richiesta
    const { codice_fiscale, stato } = req.body; // Ottieni i campi dal body
    const utenteAggiornato = new eUtente(id, codice_fiscale, stato);
    await daoUtente.update(utenteAggiornato);
    return res.json({ message: `Utente con ID ${id} aggiornato con successo` });
  } catch (error) {
    const err = error as Error;
    return res.status(400).json({ message: err.message });
  }
}

/**
 *Elimina un utente
 *
 * @export
 * @param {Request} req
 * @param {Response} res
 * @return {*}
 */
export async function deleteUtente(req: Request, res: Response) {
  try {
    const id = Number(req.params.id); // Ottieni l'ID dalla richiesta
    const utenteDaEliminare = new eUtente(id, '', enumStato.attivo); // Crei un oggetto con ID solo per eliminarlo
    await daoUtente.delete(utenteDaEliminare);
    return res.json({ message: `Utente con ID ${id} eliminato con successo` });
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({ message: err.message });
  }
}
