import { eUtenteProfilo } from "../../entity/utente/eUtenteProfilo";
import { ormUtenteProfilo } from "../../models/utente/ormUtenteProfilo"

// Implementazione del DAO per l'entità `UtenteProfilo`
class daoUtenteProfiloImplementation implements DaoInterfaceGeneric<eUtenteProfilo> {
    // Trova un UtenteProfilo per ID usando Sequelize
    async get(id: number): Promise<eUtenteProfilo | null> {
        const ormObj = await ormUtenteProfilo.findByPk(id);
        if (!ormObj) {
            throw new Error(`UtenteProfilo non trovato per l'id ${id}`);
        }
        return new eUtenteProfilo(ormObj.id, ormObj.id_utente, ormObj.id_profilo, ormObj.id_stato);
    }

    // Trova tutti gli utenti usando Sequelize
    async getAll(): Promise<eUtenteProfilo[]> {
        const objs = await ormUtenteProfilo.findAll();
        return objs.map(ormObj => new eUtenteProfilo(ormObj.id, ormObj.id_utente, ormObj.id_profilo, ormObj.id_stato));
    }

    // Trova tutti i record per idUtente usando Sequelize
    async getAllByIdUtente(id: number): Promise<eUtenteProfilo[]> {
        const objs = await ormUtenteProfilo.findAll({
            where: { id_utente: id }
        });
        return objs.map(ormObj => new eUtenteProfilo(ormObj.id, ormObj.id_utente, ormObj.id_profilo, ormObj.id_stato));
    }

    // Trova tutti i record per idProfilo usando Sequelize
    async getAllByIdProfilo(id: number): Promise<eUtenteProfilo[]> {
        const objs = await ormUtenteProfilo.findAll({
            where: { id_profilo: id }
        });
        return objs.map(ormObj => new eUtenteProfilo(ormObj.id, ormObj.id_utente, ormObj.id_profilo, ormObj.id_stato));
    }

    // Salva un nuovo UtenteProfilo nel database usando Sequelize
    async save(t: eUtenteProfilo): Promise<eUtenteProfilo|null> {
        const existingUtenteProfilo = await ormUtenteProfilo.findByPk(t.get_id());
        if (existingUtenteProfilo) {
            throw new Error("A User with the specified id already exists");
        }
        const ormObj = await ormUtenteProfilo.create({
            id: t.get_id(),
            id_UtenteProfilo: t.get_id_utente(),
            id_utenteice_fiscale: t.get_id_profilo(),
            id_stato: t.get_idStato()
        });
        return new eUtenteProfilo(ormObj.id, ormObj.id_utente, ormObj.id_profilo, ormObj.id_stato);
    }

    // Aggiorna un UtenteProfilo esistente nel database
    async update(t: eUtenteProfilo, ...params: string[]): Promise<void> {
        const ormObj = await ormUtenteProfilo.findByPk(t.get_id());
        if (!ormObj) {
            throw new Error("UtenteProfilo not found");
        }
        await ormObj.update(
            {
                id_utente: t.get_id_utente(),
                id_profilo: t.get_id_profilo(),
                id_stato: t.get_idStato()
                // Aggiungi altri campi che devono essere aggiornati
            },
            {
                where: { id: t.get_id() }
            }
        );
    }

    // Elimina un UtenteProfilo dal database usando Sequelize
    async delete(t: eUtenteProfilo): Promise<void> {
        const ormObj = await ormUtenteProfilo.findByPk(t.get_id());
        if (!ormObj) {
            throw new Error("UtenteProfilo not found");
        }
        await ormObj.destroy();
    }
}

// Esporta il DAO per l'uso nel repository
export {daoUtenteProfiloImplementation};

// Esporta il DAO per l'uso nei servizi o nei controller
export const daoUtenteProfilo = new daoUtenteProfiloImplementation();