import { enumPolicyTipo } from '../../entity/enum/enumPolicyTipo';
import { enumStato } from '../../entity/enum/enumStato';
import database from '../../utils/database';
import { DataTypes, Model, Sequelize } from 'sequelize';

/**
 * Instanziazione della connessione verso il RDBMS
 */
const sequelize: Sequelize = database.getInstance();

export class ormPolicy extends Model {
  public id!: number;
  public cod!: string;
  public descrizione!: string;
  public tipo!: enumPolicyTipo;
  public stato!: enumStato;
}

// Definizione del modello
ormPolicy.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    cod: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    descrizione: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    tipo: {
      type: DataTypes.ENUM(...Object.values(enumPolicyTipo)),
      allowNull: false,
    },
    stato: {
      type: DataTypes.ENUM(...Object.values(enumStato)),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'ormPolicy',
    tableName: 'svt_plc_policy',
  },
);
