import { enumMeteoTipo } from '../../entity/enum/enumMeteoTipo';
import database from '../../utils/database';
import { DataTypes, Model, Sequelize } from 'sequelize';
import { enumTransitoStato } from '../../entity/enum/enumTransitoStato';

/**
 * Instanziazione della connessione verso il RDBMS
 */
const sequelize: Sequelize = database.getInstance();

export class ormTransito extends Model {
  public id!: number;
  public data_transito!: Date;
  public speed!: number | null;
  public speed_real!: number | null;
  public id_varco!: number;
  public meteo!: enumMeteoTipo | null;
  public id_veicolo!: number | null;
  public immagine!: string | null;
  public stato!: enumTransitoStato;
}

// Definizione del modello
ormTransito.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    data_transito: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    speed: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    speed_real: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    id_varco: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    meteo: {
      type: DataTypes.ENUM(...Object.values(enumMeteoTipo)),
      allowNull: true,
    },
    id_veicolo: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    immagine: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    stato: {
      type: DataTypes.ENUM(...Object.values(enumTransitoStato)),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'vst_transito',
    tableName: 'vst_transito',
  },
);
