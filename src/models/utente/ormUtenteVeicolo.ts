import database from '../../utils/database';
import { DataTypes, Model, Sequelize } from 'sequelize';
import { ormUtente } from './ormUtente';
import { ormVeicolo } from '../svt/ormVeicolo';

/**
 * Instanziazione della connessione verso il RDBMS
 */
const sequelize: Sequelize = database.getInstance();

export class ormUtenteVeicolo extends Model {
  // Metodi di associazione utente -> Veicoli
  public addVeicolo!: (
    Veicolo: ormVeicolo | ormVeicolo[],
    options?: any,
  ) => Promise<void>;
  public getVeicoli!: (options?: any) => Promise<ormVeicolo[]>;
  public setVeicoli!: (Veicoli: ormVeicolo[], options?: any) => Promise<void>;
  public removeVeicoli!: (
    Veicoli: ormVeicolo[],
    options?: any,
  ) => Promise<void>;
}

// Definizione del modello
ormUtenteVeicolo.init(
  {
    id_utente: {
      type: DataTypes.INTEGER,
      references: {
        model: ormUtente,
        key: 'id',
      },
    },
    id_veicolo: {
      type: DataTypes.INTEGER,
      references: {
        model: ormVeicolo,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'utente_veicolo',
    tableName: 'utn_utente_veicolo',
  },
);
