// src/utils/database.ts
import { Sequelize } from 'sequelize';
import config from '../config/database.config';
import dotenv from 'dotenv';
import logger from './logger-winston';

dotenv.config();

class Database {
  private static instance: Sequelize;

  private constructor() {
    // Il costruttore è privato per impedire l'istanziazione diretta
  }

  public static getInstance(): Sequelize {
    if (!Database.instance) {
      const currentEnv =
        (process.env.NODE_ENV as 'development' | 'test' | 'production') ||
        'development';
      const dbConfig = config[currentEnv]; // Usa config.ts per gestire i diversi ambienti

      Database.instance = new Sequelize(
        process.env.DB_NAME || 'svt_db',
        process.env.DB_USER || 'user',
        process.env.DB_PASS || 'password',
        {
          host: dbConfig.host,
          port: parseInt(process.env.DB_PORT || '3306'),
          dialect: dbConfig.dialect,
          logging: process.env.NODE_ENV === 'development' ? console.log : false,
          define: dbConfig.define,
          pool: dbConfig.pool,
        },
      );

      // Test della connessione
      Database.instance
        .authenticate()
        .then(() => {
          logger.info('Connessione al database riuscita.');
        })
        .catch((err: Error) => {
          logger.error('Errore nella connessione al database:', err);
        });
    }

    return Database.instance;
  }
}

export default Database;
