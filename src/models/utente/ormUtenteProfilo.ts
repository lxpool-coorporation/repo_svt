import Database from "../../utils/database";
import { DataTypes, Sequelize, Model } from 'sequelize';
import { enumStato } from "../../entity/enum/enumStato";

/**
 * Instanziazione della connessione verso il RDBMS
 */
const sequelize: Sequelize = Database.getInstance();

export class ormUtenteProfilo extends Model {
  public id!:number
  public id_utente!:number
  public id_profilo!:number
  public id_stato!: enumStato
}

// Definizione del modello
ormUtenteProfilo.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    id_profilo: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_utente: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_stato: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'utente_profilo',
    tableName: 'utn_utente_profilo'
  });
