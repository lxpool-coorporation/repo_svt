// ormPolicySpeedControl.ts
import database from '../../utils/database';
import { DataTypes, Model, Sequelize } from 'sequelize';
import { ormPolicySanction } from './ormPolicySanction';
import { enumMeteoTipo } from '../../entity/enum/enumMeteoTipo';

const sequelize: Sequelize = database.getInstance();

export class ormPolicySanctionSpeedControl extends Model {
  public id_policy_sanction!: number;
  public meteo!: enumMeteoTipo;
  public speed_min!: number;
  public speed_max!: number;

  // Associazione per accedere ai dati della policy base
  public policySanction?: ormPolicySanction;

  // Definisci le associazioni
  static associate(models: any) {
    ormPolicySanctionSpeedControl.belongsTo(models.ormPolicySanction, {
      foreignKey: 'id_policy_sanction',
      as: 'policySanction',
    });
  }
}

ormPolicySanctionSpeedControl.init(
  {
    id_policy_sanction: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: ormPolicySanction,
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    speed_min: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    speed_max: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'ormPolicySanctionSpeedControl',
    tableName: 'svt_plc_sanction_speed_control',
  },
);
