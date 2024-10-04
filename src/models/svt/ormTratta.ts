import { enumStato } from '../../entity/enum/enumStato';
import database from '../../utils/database';
import { DataTypes, Model, Sequelize } from 'sequelize';

/**
 * Instanziazione della connessione verso il RDBMS
 */
const sequelize: Sequelize = database.getInstance();

export class ormTratta extends Model {
  public id!: number;
  public cod!: string;
  public descrizione!: string;
  public id_varco_ingresso!: number;
  public id_varco_uscita!: number;
  public distanza!: number;
  public stato!: enumStato;
}

// Definizione del modello
ormTratta.init(
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
    id_varco_ingresso: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_varco_uscita: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    distanza: {
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
    modelName: 'vst_tratta',
    tableName: 'vst_tratta',
  },
);
