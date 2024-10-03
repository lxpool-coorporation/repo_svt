import database from '../../utils/database';
import { DataTypes, Sequelize } from 'sequelize';
import { ormUtente } from './ormUtente';
import { ormProfilo } from './ormProfilo';

/**
 * Instanziazione della connessione verso il RDBMS
 */
const sequelize: Sequelize = database.getInstance();

export class ormUtenteProfilo extends ormUtente {
  // Metodi di associazione utente -> profili
  public addProfilo!: (
    profilo: ormProfilo | ormProfilo[],
    options?: any,
  ) => Promise<void>;
  public getProfili!: (options?: any) => Promise<ormProfilo[]>;
  public setProfili!: (profili: ormProfilo[], options?: any) => Promise<void>;
  public removeProfili!: (
    profili: ormProfilo[],
    options?: any,
  ) => Promise<void>;
}

// Definizione del modello
ormUtenteProfilo.init(
  {
    id_utente: {
      type: DataTypes.INTEGER,
      references: {
        model: ormUtente,
        key: 'id',
      },
    },
    id_profilo: {
      type: DataTypes.INTEGER,
      references: {
        model: ormProfilo,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'utente_profilo',
    tableName: 'utn_utente_profilo',
  },
);
