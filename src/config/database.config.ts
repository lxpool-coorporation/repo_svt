import { Dialect } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config(); // Per caricare le variabili d'ambiente da un file .env (se necessario)

interface IDatabaseConfig {
  username: string;
  password: string | null;
  database: string;
  host: string;
  port?: number;
  dialect: Dialect;
  define?: {
    timestamps: boolean;
    freezeTableName: boolean;
  };
  pool?: {
    max: number;
    min: number;
    acquire: number;
    idle: number;
  };
}

interface IConfig {
  development: IDatabaseConfig;
  test: IDatabaseConfig;
  production: IDatabaseConfig;
}

const config: IConfig = {
  development: {
    username: process.env.DB_USER || 'svt-db',
    password: process.env.DB_PASS || 'xxxx',
    database: process.env.DB_NAME || 'svt-db',
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '3306'),
    dialect: 'mysql',
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
  test: {
    username: process.env.DB_USER || 'svt',
    password: process.env.DB_PASS || 'xxx',
    database: process.env.DB_NAME || 'svt-db',
    host: process.env.DB_HOST || 'svt-db',
    port: parseInt(process.env.DB_PORT || '3306'),
    dialect: 'mysql',
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
  production: {
    username: process.env.DB_USERNAME!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT || '3306'),
    dialect: 'mysql',
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
};

export default config;
