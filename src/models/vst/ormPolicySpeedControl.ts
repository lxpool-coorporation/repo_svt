// ormPolicySpeedControl.ts
import { enumStato } from '../../entity/enum/enumStato';
import database from '../../utils/database';
import { DataTypes, Model, Sequelize } from 'sequelize';
import { ormPolicy } from './ormPolicy';
import { enumMeteoTipo } from '@/entity/enum/enumMeteoTipo';
import { enumVeicoloTipo } from '@/entity/enum/enumVeicoloTipo';

const sequelize: Sequelize = database.getInstance();

export class ormPolicySpeedControl extends Model {
  public id_policy!: number;
  public meteo!: enumMeteoTipo;
  public veicolo!: enumVeicoloTipo;
  public speed_limit!: number;
  public stato!: enumStato;

  // Associazione per accedere ai dati della policy base
  public policy?: ormPolicy;
}

ormPolicySpeedControl.init(
  {
    id_policy: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: ormPolicy,
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    meteo: {
      type: DataTypes.ENUM(...Object.values(enumMeteoTipo)),
      allowNull: false,
    },
    veicolo: {
      type: DataTypes.ENUM(...Object.values(enumVeicoloTipo)),
      allowNull: false,
    },
    speed_limit: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'ormPolicySpeedControl',
    tableName: 'vst_plc_speed_control',
  },
);
