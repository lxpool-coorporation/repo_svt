import database from '../../utils/database';
import { DataTypes, Model, Sequelize } from 'sequelize';
import { ormProfilo } from './ormProfilo';
import { ormPermesso } from './ormPermesso';

/**
 * Instanziazione della connessione verso il RDBMS
 */
const sequelize: Sequelize = database.getInstance();

export class ormProfiloPermesso extends Model {
  // Metodi di associazione profili -> permessi
  public addPermesso!: (
    utente: ormPermesso | ormPermesso[],
    options?: any,
  ) => Promise<void>;
  public getPermessi!: (options?: any) => Promise<ormPermesso[]>;
  public setPermessi!: (
    permessi: ormPermesso[],
    options?: any,
  ) => Promise<void>;
  public removePermessi!: (
    permessi: ormPermesso[],
    options?: any,
  ) => Promise<void>;
}

// Definizione del modello
ormProfiloPermesso.init(
  {
    id_profilo: {
      type: DataTypes.INTEGER,
      references: {
        model: ormProfilo,
        key: 'id',
      },
    },
    id_permesso: {
      type: DataTypes.INTEGER,
      references: {
        model: ormPermesso,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'utn_profilo_permesso',
    tableName: 'utn_profilo_permesso',
  },
);
