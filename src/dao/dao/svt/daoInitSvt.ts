import logger from '../../../utils/logger-winston';
import { sequelize, models } from '../../../models/svt/ormInitSvt';

// classe che gestisce la logica di business dell'Svt
export class daoInitSvtImplementation {
  // Inizializza il database per la classe Svt
  async init(options?: {
    force?: boolean;
    alter?: boolean;
    logging?: boolean;
  }): Promise<boolean> {
    try {
      const syncOptions = {
        force: options?.force ?? false, // Valorizza `force`, default false
        alter: options?.alter ?? false, // Valorizza `alter`, default false
        logging: options?.logging ?? false, // Valorizza `logging`, default false
      };
      await sequelize.sync(syncOptions); // Usa `force: true` se vuoi ricreare le tabelle ogni volta
      logger.info(models);
      logger.info('Database synchronized');
      return true;
    } catch (error) {
      logger.error(
        'daoInitSvt - Errore durante la sincronizzazione del database:',
        error,
      );
      return false;
    }
  }
}

// Esporta il DAO per l'uso nei servizi o repository
export const daoInitSvt = new daoInitSvtImplementation();