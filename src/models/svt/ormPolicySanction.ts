// ormPolicySpeedControl.ts
import { enumStato } from '../../entity/enum/enumStato';
import database from '../../utils/database';
import { DataTypes, Model, Sequelize } from 'sequelize';
import { ormPolicySanctionSpeedControl } from './ormPolicySanctionSpeedControl';
import { enumPolicyTipo } from '../../entity/enum/enumPolicyTipo';

const sequelize: Sequelize = database.getInstance();

export class ormPolicySanction extends Model {
  public id!: number;
  public tipo_policy!: enumPolicyTipo;
  public cod!: string;
  public descrizione!: string;
  public costo_min!: number;
  public costo_max!: number;
  public costo_punti_patente!: number;
  public stato!: enumStato;

  public getPolicySanctionSpeedControls!: (
    options?: any,
  ) => Promise<ormPolicySanctionSpeedControl[]>;
}

ormPolicySanction.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    tipo_policy: {
      type: DataTypes.ENUM(...Object.values(enumPolicyTipo)),
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
    costo_min: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    costo_max: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    costo_punti_patente: {
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
    modelName: 'ormPolicySanction',
    tableName: 'svt_plc_sanction',
  },
);
