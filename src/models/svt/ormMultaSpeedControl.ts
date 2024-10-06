// ormPolicySpeedControl.ts
import database from '../../utils/database';
import { DataTypes, Model, Sequelize } from 'sequelize';
import { ormMulta } from './ormMulta';

const sequelize: Sequelize = database.getInstance();

export class ormMultaSpeedControl extends Model {
  public id_multa!: number;
  public speed!: number;
  public speed_real!: number;
  public speed_limit!: number;
  public speed_delta!: number;

  // Associazione per accedere ai dati della policy base
  public multa?: ormMulta;
}

ormMultaSpeedControl.init(
  {
    id_multa: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    speed: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    speed_real: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    speed_limit: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    speed_delta: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'svt_multa_speed_control',
    tableName: 'svt_multa_speed_control',
  },
);
