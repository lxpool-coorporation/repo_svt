import database from '../../utils/database';
import { DataTypes, Model, Sequelize } from 'sequelize';
import { ormTratta } from './ormTratta';
import { ormPolicy } from './ormPolicy';

/**
 * Instanziazione della connessione verso il RDBMS
 */
const sequelize: Sequelize = database.getInstance();

export class ormTrattaPolicy extends Model {
  // Metodi di associazione utente -> profili
  public addPolicy!: (
    profilo: ormPolicy | ormPolicy[],
    options?: any,
  ) => Promise<void>;
  public getPolicies!: (options?: any) => Promise<ormPolicy[]>;
  public setPolicies!: (profili: ormPolicy[], options?: any) => Promise<void>;
  public removePolicies!: (
    profili: ormPolicy[],
    options?: any,
  ) => Promise<void>;
}

// Definizione del modello
ormTrattaPolicy.init(
  {
    id_tratta: {
      type: DataTypes.INTEGER,
      references: {
        model: ormTratta,
        key: 'id',
      },
    },
    id_policy: {
      type: DataTypes.INTEGER,
      references: {
        model: ormPolicy,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'svt_tratta_policy',
    tableName: 'svt_tratta_policy',
  },
);
