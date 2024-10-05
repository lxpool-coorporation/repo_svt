import { enumStato } from '../../entity/enum/enumStato';
import { enumVeicoloTipo } from '../../entity/enum/enumVeicoloTipo';
import database from '../../utils/database';
import { DataTypes, Model, Sequelize } from 'sequelize';

/**
 * Instanziazione della connessione verso il RDBMS
 */
const sequelize: Sequelize = database.getInstance();

export class ormVeicolo extends Model {
  public id!: number;
  public tipo!: enumVeicoloTipo;
  public targa!: string;
  public stato!: enumStato;
}

// Definizione del modello
ormVeicolo.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    tipo: {
      type: DataTypes.ENUM(...Object.values(enumVeicoloTipo)),
      allowNull: false,
      unique: true,
    },
    targa: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    stato: {
      type: DataTypes.ENUM(...Object.values(enumStato)),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'vst_veicolo',
    tableName: 'vst_veicolo',
  },
);
