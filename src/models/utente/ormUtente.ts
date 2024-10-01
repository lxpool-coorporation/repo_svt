import Database from "../../utils/database";
import { DataTypes, Sequelize, Model } from 'sequelize';
import { enumStato } from "../../entity/enum/enumStato";
import { ormProfilo } from "./ormProfilo";

/**
 * Instanziazione della connessione verso il RDBMS
 */
const sequelize: Sequelize = Database.getInstance();

export class ormUtente extends Model {
    public id!:number
    public codice_fiscale!:string
    public stato!: enumStato

       // Dichiarazione manuale della proprietà 'profili' per risolvere l'errore di TypeScript
       public profili?: ormProfilo[];  // Associazione many-to-many con profili

       // Metodi di associazione generati da Sequelize
       public addProfilo!: (profilo: ormProfilo | ormProfilo[], options?: any) => Promise<void>;
       public getProfili!: (options?: any) => Promise<ormProfilo[]>;
       public setProfili!: (profili: ormProfilo[], options?: any) => Promise<void>;
       public removeProfili!: (profili: ormProfilo[], options?: any) => Promise<void>;
}

// Definizione del modello
ormUtente.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    codice_fiscale: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    stato: {
        type: DataTypes.ENUM(...Object.values(enumStato)),
        allowNull: false
    }
}, {
    sequelize,
    modelName: "utente",
    tableName: 'utn_utente'
})


