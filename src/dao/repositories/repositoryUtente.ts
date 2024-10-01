import { daoUtenteProfilo, daoUtenteProfiloImplementation } from '../dao/utente/daoUtenteProfilo';
import { daoUtente, daoUtenteImplementation } from '../dao/utente/daoUtente';
import { eUtente } from '../../entity/utente/eUtente';
import { Transaction } from 'sequelize';
import { eProfilo } from '../../entity/utente/eProfilo';
import { daoInitUtente, daoInitUtenteImplementation } from '../dao/utente/daoInitUtente';

class repositoryUtenteImplementation implements DaoInterfaceGeneric<eUtente> {
    private daoUtente: daoUtenteImplementation
    private daoUtenteProfilo: daoUtenteProfiloImplementation
    private daoInitUtente: daoInitUtenteImplementation

    constructor() {
        this.daoUtente = daoUtente;
        this.daoUtenteProfilo = daoUtenteProfilo;
        this.daoInitUtente = daoInitUtente;
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
    getProfili(id: number): Promise<eProfilo[] | null> {
        return this.daoUtenteProfilo.getProfili(id)
    }
    init(options?: { force?: boolean; alter?: boolean; logging?: boolean }): Promise<boolean> {
        return this.daoInitUtente.init(options)
    }

}

// Esporta il DAO per l'uso nei servizi o nei controller
export const repositoryUtente = new repositoryUtenteImplementation();
