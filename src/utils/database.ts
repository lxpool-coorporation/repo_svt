// src/utils/database.ts
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import logger from './logger-winston.js';

dotenv.config();

class Database {
  private static instance: Sequelize;

  private constructor() {
    // Il costruttore è privato per impedire l'istanziazione diretta
  }

  public static getInstance(): Sequelize {
    if (!Database.instance) {
      Database.instance = new Sequelize(
        process.env.DB_NAME || 'svt_db',
        process.env.DB_USER || 'user',
        process.env.DB_PASSWORD || 'password',
        {
          host: process.env.DB_HOST || 'localhost',
          port: parseInt(process.env.DB_PORT || '3306'),
          dialect: 'mysql',
          logging: process.env.NODE_ENV === 'development' ? console.log : false,
          define: {
            timestamps: true,
            freezeTableName: true,
          },
          pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000,
          },
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
