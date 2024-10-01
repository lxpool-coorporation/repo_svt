import logger from '../../../utils/logger-winston';
import { sequelize, models } from '../../../models/utente/ormInitUtente';

// classe che gestisce la logica di business dell'utente
export class daoInitUtenteImplementation {

    // Inizializza il database per la classe utente
    async init(options?: { force?: boolean; alter?: boolean; logging?: boolean }): Promise<boolean>{
        try{
            const syncOptions = {
                force: options?.force ?? false,   // Valorizza `force`, default false
                alter: options?.alter ?? false,   // Valorizza `alter`, default false
                logging: options?.logging ?? false,  // Valorizza `logging`, default false
            };
            await sequelize.sync(syncOptions)  // Usa `force: true` se vuoi ricreare le tabelle ogni volta
            logger.info('Database synchronized');
            return true
        }    
        catch(error){
            logger.error('daoInitUtente - Errore durante la sincronizzazione del database:', error);
            return false
        }  
    }   
}

// Esporta il DAO per l'uso nei servizi o repository
export const daoInitUtente = new daoInitUtenteImplementation()