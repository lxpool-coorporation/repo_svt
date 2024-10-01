import { eUtente } from "../../../entity/utente/eUtente";
import { ormUtente } from "../../../models/utente/ormUtente"
import { Transaction } from 'sequelize';

// Implementazione del DAO per l'entità `Utente`
export class daoUtenteImplementation implements DaoInterfaceGeneric<eUtente> {
    // Trova un utente per ID usando Sequelize
    async get(id: number): Promise<eUtente | null> {
        const ormObj = await ormUtente.findByPk(id);
        if (!ormObj) {
            throw new Error(`utente non trovato per l'id ${id}`);
        }
        return new eUtente(ormObj.id, ormObj.codice_fiscale, ormObj.stato);
    }

    // Trova tutti gli utenti usando Sequelize
    async getAll(): Promise<eUtente[]> {
        const objs = await ormUtente.findAll();
        return objs.map(ormObj => new eUtente(ormObj.id, ormObj.codice_fiscale, ormObj.stato));
    }

    // Salva un nuovo utente nel database usando Sequelize
    async save(t: eUtente, options?: { transaction?: Transaction }): Promise<eUtente|null> {
        const existingUtente = await ormUtente.findByPk(t.get_id());
        if (existingUtente) {
            throw new Error("A User with the specified id already exists");
        }
        const ormObj = await ormUtente.create({
            id: t.get_id(),
            codice_fiscale: t.get_codiceFiscale(),
            stato: t.get_stato()
        });
        return new eUtente(ormObj.id, ormObj.codice_fiscale, ormObj.stato);
    }

    // Aggiorna un utente esistente nel database
    async update(t: eUtente, ...params: string[]): Promise<void> {
        const ormObj = await ormUtente.findByPk(t.get_id());
        if (!ormObj) {
            throw new Error("Utente not found");
        }
        await ormObj.update(
            {
                codice_fiscale: t.get_codiceFiscale(),
                id_stato: t.get_stato()
                // Aggiungi altri campi che devono essere aggiornati
            },
            {
                where: { id: t.get_id() }
            }
        );
    }

    // Elimina un utente dal database usando Sequelize
    async delete(t: eUtente, options?: { transaction?: Transaction }): Promise<void> {
        const ormObj = await ormUtente.findByPk(t.get_id());
        if (!ormObj) {
            throw new Error("Utente not found");
        }
        await ormObj.destroy();
    }



}

// Esporta il DAO per l'uso nei servizi o nei controller
export const daoUtente = new daoUtenteImplementation();

