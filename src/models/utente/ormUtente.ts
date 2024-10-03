import database from '../../utils/database';
import { DataTypes, Sequelize, Model } from 'sequelize';
import { enumStato } from '../../entity/enum/enumStato';

/**
 * Instanziazione della connessione verso il RDBMS
 */
const sequelize: Sequelize = database.getInstance();

export class ormUtente extends Model {
  public id!: number;
  public identificativo!: string;
  public stato!: enumStato;
}

// Definizione del modello
ormUtente.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    identificativo: {
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
    modelName: 'utente',
    tableName: 'utn_utente',
  },
);
