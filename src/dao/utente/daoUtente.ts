import { eUtente } from "../../entity/utente/eUtente";
import { ormUtente } from "../../models/utente/ormUtente"

// Implementazione del DAO per l'entità `Utente`
class daoUtenteImplementation implements DaoInterfaceGeneric<eUtente> {
    // Trova un utente per ID usando Sequelize
    async get(id: number): Promise<eUtente | null> {
        const ormObj = await ormUtente.findByPk(id);
        if (!ormObj) {
            throw new Error(`utente non trovato per l'id ${id}`);
        }
        return new eUtente(ormObj.id, ormObj.id_profilo, ormObj.codice_fiscale, ormObj.id_stato);
    }

    // Trova tutti gli utenti usando Sequelize
    async getAll(): Promise<eUtente[]> {
        const objs = await ormUtente.findAll();
        return objs.map(ormObj => new eUtente(ormObj.id, ormObj.id_profilo, ormObj.codice_fiscale, ormObj.id_stato));
    }

    // Salva un nuovo utente nel database usando Sequelize
    async save(t: eUtente): Promise<eUtente|null> {
        const existingUtente = await ormUtente.findByPk(t.get_id());
        if (existingUtente) {
            throw new Error("A User with the specified id already exists");
        }
        const ormObj = await ormUtente.create({
            id: t.get_id(),
            id_profilo: t.get_idProfilo(),
            codice_fiscale: t.get_codiceFiscale(),
            id_stato: t.get_idStato()
        });
        return new eUtente(ormObj.id, ormObj.id_profilo, ormObj.codice_fiscale, ormObj.id_stato);
    }

    // Aggiorna un utente esistente nel database
    async update(t: eUtente, ...params: string[]): Promise<void> {
        const ormObj = await ormUtente.findByPk(t.get_id());
        if (!ormObj) {
            throw new Error("Utente not found");
        }
        await ormObj.update(
            {
                id_profilo: t.get_idProfilo(),
                codice_fiscale: t.get_codiceFiscale(),
                id_stato: t.get_idStato()
                // Aggiungi altri campi che devono essere aggiornati
            },
            {
                where: { id: t.get_id() }
            }
        );
    }

    // Elimina un utente dal database usando Sequelize
    async delete(t: eUtente): Promise<void> {
        const ormObj = await ormUtente.findByPk(t.get_id());
        if (!ormObj) {
            throw new Error("Utente not found");
        }
        await ormObj.destroy();
    }
}

// Esporta il DAO per l'uso nel repository
export {daoUtenteImplementation};

// Esporta il DAO per l'uso nei servizi o nei controller
export const daoUtente = new daoUtenteImplementation();

