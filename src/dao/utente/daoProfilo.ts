import { eProfilo } from "../../entity/utente/eProfilo";
import { ormProfilo } from "../../models/utente/ormProfilo"
import { Transaction } from 'sequelize';

// Implementazione del DAO per l'entità `Profilo`
class daoProfiloImplementation implements DaoInterfaceGeneric<eProfilo> {
    // Trova un profilo per ID usando Sequelize
    async get(id: number): Promise<eProfilo | null> {
        const ormObj = await ormProfilo.findByPk(id);
        if (!ormObj) {
            throw new Error(`profilo non trovato per l'id ${id}`);
        }
        return new eProfilo(ormObj.id, ormObj.cod, ormObj.descrizione, ormObj.stato);
    }

    // Trova tutti gli utenti usando Sequelize
    async getAll(): Promise<eProfilo[]> {
        const objs = await ormProfilo.findAll();
        return objs.map(ormObj => new eProfilo(ormObj.id, ormObj.cod, ormObj.descrizione, ormObj.stato));
    }

    // Salva un nuovo profilo nel database usando Sequelize
    async save(t: eProfilo, options?: { transaction?: Transaction }): Promise<eProfilo|null> {
        const existingProfilo = await ormProfilo.findByPk(t.get_id());
        if (existingProfilo) {
            throw new Error("A User with the specified id already exists");
        }
        const ormObj = await ormProfilo.create({
            id: t.get_id(),
            cod: t.get_cod(),
            descrizione: t.get_descrizione(),
            stato: t.get_stato()
        });
        return new eProfilo(ormObj.id, ormObj.cod, ormObj.descrizione, ormObj.stato);
    }

    // Aggiorna un profilo esistente nel database
    async update(t: eProfilo, ...params: string[]): Promise<void> {
        const ormObj = await ormProfilo.findByPk(t.get_id());
        if (!ormObj) {
            throw new Error("Profilo not found");
        }
        await ormObj.update(
            {
                cod: t.get_cod(),
                descrizione: t.get_descrizione(),
                stato: t.get_stato()
                // Aggiungi altri campi che devono essere aggiornati
            },
            {
                where: { id: t.get_id() }
            }
        );
    }

    // Elimina un profilo dal database usando Sequelize
    async delete(t: eProfilo, options?: { transaction?: Transaction }): Promise<void> {
        const ormObj = await ormProfilo.findByPk(t.get_id());
        if (!ormObj) {
            throw new Error("Profilo not found");
        }
        await ormObj.destroy();
    }
}

// Esporta il DAO per l'uso nel repository
export {daoProfiloImplementation};

// Esporta il DAO per l'uso nei servizi o nei controller
export const daoProfilo = new daoProfiloImplementation();