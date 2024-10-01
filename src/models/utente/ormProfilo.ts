import { enumStato } from '../../entity/enum/enumStato';
import Database from '../../utils/database';
import { DataTypes, Model, Sequelize } from 'sequelize';
import { ormUtente } from './ormUtente';

/**
 * Instanziazione della connessione verso il RDBMS
 */
const sequelize: Sequelize = Database.getInstance();

export class ormProfilo extends Model {
  public id!: number;
  public cod!: string;
  public descrizione!: string;
  public stato!: enumStato;

  // Metodi di associazione manuale per la tipizzazione
  public addUtente!: (
    utente: ormUtente | ormUtente[],
    options?: any,
  ) => Promise<void>;
  public getUtenti!: (options?: any) => Promise<ormUtente[]>;
  public setUtenti!: (utenti: ormUtente[], options?: any) => Promise<void>;
  public removeUtenti!: (utenti: ormUtente[], options?: any) => Promise<void>;
}

// Definizione del modello
ormProfilo.init(
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
    stato: {
      type: DataTypes.ENUM(...Object.values(enumStato)),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'profilo',
    tableName: 'utn_profilo',
  },
);
