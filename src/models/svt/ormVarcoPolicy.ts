import database from '../../utils/database';
import { DataTypes, Sequelize } from 'sequelize';
import { ormVarco } from './ormVarco';
import { ormPolicy } from './ormPolicy';

/**
 * Instanziazione della connessione verso il RDBMS
 */
const sequelize: Sequelize = database.getInstance();

export class ormVarcoPolicy extends ormVarco {
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
ormVarcoPolicy.init(
  {
    id_varco: {
      type: DataTypes.INTEGER,
      references: {
        model: ormVarco,
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
    modelName: 'svt_varco_policy',
    tableName: 'svt_varco_policy',
  },
);
