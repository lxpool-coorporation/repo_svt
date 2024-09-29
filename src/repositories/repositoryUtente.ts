import { daoUtente, daoUtenteImplementation } from '../dao/utente/daoUtente';
import { daoUtenteProfilo, daoUtenteProfiloImplementation } from '../dao/utente/daoUtenteProfilo';
import { eUtente } from '../entity/utente/eUtente';
import { enumProfilo } from '../entity/enum/enumProfilo';
import { eUtenteProfilo } from '@/entity/utente/eUtenteProfilo';

class repositoryUtente implements DaoInterfaceGeneric<eUtente> {
    private daoUtente: daoUtenteImplementation;
    private daoUtenteProfilo: daoUtenteProfiloImplementation;

    constructor() {
        this.daoUtente = daoUtente;
        this.daoUtenteProfilo = daoUtenteProfilo;
    }
    get(id: number): Promise<eUtente | null> {
        return this.daoUtente.get(id);
    }
    getAll(): Promise<eUtente[]> {
        return this.daoUtente.getAll();
    }
    save(t: eUtente): Promise<eUtente | null> {
        return this.daoUtente.save(t);
    }
    update(t: eUtente, ...params: string[]): Promise<void> {
        return this.daoUtente.update(t, ...params);
    }
    delete(t: eUtente): Promise<void> {
        return this.daoUtente.delete(t);
    }

    async getAllUserProfiles(id: number): Promise<string[]> {
        try{
            // Usa await per attendere la risoluzione della Promise
            const objUtenteProfili: eUtenteProfilo[] = await this.daoUtenteProfilo.getAllByIdUtente(id);

            if (objUtenteProfili && objUtenteProfili.length > 0) {
                // Mappa l'id_profilo in enumProfilo
                const profili = objUtenteProfili.map(profiloRecord => {
                    // Usa la proprietà id_profilo direttamente, non un metodo getter
                    return enumProfilo[profiloRecord.get_id_profilo()];  // Restituisci l'enum castato correttamente
                });
                return profili;
            } else {
                return [];  // Se non ci sono profili, restituisci un array vuoto
            }
        } catch (error) {
            console.error('Errore durante il caricamento dei profili:', error);
            throw new Error('Errore durante il caricamento dei profili');
        }
    }
     
}

// Esporta il DAO per l'uso nei servizi o nei controller
export const repoUtente = new repositoryUtente();
