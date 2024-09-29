import { enumProfilo } from "../../entity/enum/enumProfilo";
import { enumStato } from "../../entity/enum/enumStato";
import Database from "../../utils/database";
import { DataTypes, Sequelize, Model } from 'sequelize';

/**
 * Instanziazione della connessione verso il RDBMS
 */
const sequelize: Sequelize = Database.getInstance();

export class ormUtente extends Model {
    public id!:number
    public id_profilo!:number
    public codice_fiscale!:string
    public id_stato!: enumStato
}

// Definizione del modello
ormUtente.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_profilo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isIn: [[enumProfilo.operatore, enumProfilo.automobilista]]  // Restringi i valori validi usando l'enum
        }
    },
    codice_fiscale: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    id_stato: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isIn: [[enumStato.attivo, enumStato.disattivo]]  // Restringi i valori validi usando l'enum
        }
    }
}, {
    sequelize,
    modelName: "utente",
    tableName: 'utn_utente'
})


