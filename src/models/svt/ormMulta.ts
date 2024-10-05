import database from '../../utils/database';
import { DataTypes, Model, Sequelize } from 'sequelize';
import { ormPolicy } from './ormPolicy';
import { ormTransito } from './ormTransito';

/**
 * Instanziazione della connessione verso il RDBMS
 */
const sequelize: Sequelize = database.getInstance();

export class ormMulta extends Model {
  public id!: number;
  public id_transito!: number;
  public id_policy!: number;
  public speed_delta!: number;
  public path_bollettino!: string;
}

// Definizione del modello
ormMulta.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_transito: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ormTransito,
        key: 'id',
      },
    },
    id_policy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ormPolicy,
        key: 'id',
      },
    },
    speed_delta: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    path_bollettino: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'ormMulta',
    tableName: 'svt_multa',
  },
);
