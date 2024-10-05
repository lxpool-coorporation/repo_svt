import { enumStato } from '../../entity/enum/enumStato';
import database from '../../utils/database';
import { DataTypes, Model, Sequelize } from 'sequelize';

/**
 * Instanziazione della connessione verso il RDBMS
 */
const sequelize: Sequelize = database.getInstance();

export class ormVarco extends Model {
  public id!: number;
  public cod!: string;
  public descrizione!: string;
  public latitudine!: number;
  public longitudine!: number;
  public stato!: enumStato;
}

// Definizione del modello
ormVarco.init(
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
    latitudine: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: false,
    },
    longitudine: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: false,
    },
    stato: {
      type: DataTypes.ENUM(...Object.values(enumStato)),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'vst_varco',
    tableName: 'vst_varco',
  },
);
