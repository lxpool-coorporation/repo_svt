import Database from "../../utils/database";
import { DataTypes, Sequelize, Model } from 'sequelize';
import { ormUtente } from "./ormUtente";
import { ormProfilo } from "./ormProfilo";

/**
 * Instanziazione della connessione verso il RDBMS
 */
const sequelize: Sequelize = Database.getInstance();

export class ormUtenteProfilo extends Model {}

// Definizione del modello
ormUtenteProfilo.init({    
    id_utente: {
        type: DataTypes.INTEGER,
        references: {
            model: ormUtente,
            key: 'id'
        }
    },
    id_profilo: {
      type: DataTypes.INTEGER,
      references: {
          model: ormProfilo,
          key: 'id'
      }
    }
}, {
    sequelize,
    modelName: 'utente_profilo',
    tableName: 'utn_utente_profilo'
});


