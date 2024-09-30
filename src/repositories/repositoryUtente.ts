import { daoUtente, daoUtenteImplementation } from '../dao/utente/daoUtente';
import { eUtente } from '../entity/utente/eUtente';
import { Transaction } from 'sequelize';

class repositoryUtente implements DaoInterfaceGeneric<eUtente> {
    private daoUtente: daoUtenteImplementation;

    constructor() {
        this.daoUtente = daoUtente;
    }
    get(id: number): Promise<eUtente | null> {
        return this.daoUtente.get(id);
    }
    getAll(): Promise<eUtente[]> {
        return this.daoUtente.getAll();
    }
    save(t: eUtente, options?: { transaction?: Transaction }): Promise<eUtente | null> {
        return this.daoUtente.save(t);
    }
    update(t: eUtente, ...params: string[]): Promise<void> {
        return this.daoUtente.update(t, ...params);
    }
    delete(t: eUtente, options?: { transaction?: Transaction }): Promise<void> {
        return this.daoUtente.delete(t);
    }

    
     
}

// Esporta il DAO per l'uso nei servizi o nei controller
export const repoUtente = new repositoryUtente();
