// ormPolicySpeedControl.ts
import { enumStato } from '../../entity/enum/enumStato';
import database from '../../utils/database';
import { DataTypes, Model, Sequelize } from 'sequelize';
import { ormPolicy } from './ormPolicy';
import { enumVeicoloTipo } from '@/entity/enum/enumVeicoloTipo';
import { ormPolicySpeedControl } from './ormPolicySpeedControl';

const sequelize: Sequelize = database.getInstance();

export class ormPolicySpeedControlSanction extends Model {
  public id!: number;
  public id_policy!: number;
  public veicolo!: enumVeicoloTipo;
  public cod!: string;
  public descrizione!: string;
  public speed_min!: number;
  public speed_max!: number;
  public costo_min!: number;
  public costo_max!: number;
  public licenza_punti!: number;
  public stato!: enumStato;

  public getPolicySpeedControls!: (
    options?: any,
  ) => Promise<ormPolicySpeedControl[]>;
}

ormPolicySpeedControlSanction.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_policy: {
      type: DataTypes.INTEGER,
      references: {
        model: ormPolicy,
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    veicolo: {
      type: DataTypes.ENUM(...Object.values(enumVeicoloTipo)),
      allowNull: false,
    },
    cod: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descrizione: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    speed_min: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    speed_max: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    costo_min: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    costo_max: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    licenza_punti: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    stato: {
      type: DataTypes.ENUM(...Object.values(enumStato)),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'ormPolicySpeedControlSanction',
    tableName: 'utn_plc_speed_control_sanction',
  },
);
