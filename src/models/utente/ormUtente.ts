import database from '../../utils/database';
import { DataTypes, Sequelize, Model, NonAttribute } from 'sequelize';
import { enumStato } from '../../entity/enum/enumStato';
import { ormVeicolo } from '../svt/ormVeicolo';
import { ormProfilo } from './ormProfilo';

/**
 * Instanziazione della connessione verso il RDBMS
 */
const sequelize: Sequelize = database.getInstance();

export class ormUtente extends Model {
  public id!: number;
  public identificativo!: string;
  public stato!: enumStato;

  // Definisci una proprietà per i permessi associati
  public utente_profili?: NonAttribute<ormProfilo[]>; // Sequelize riempirà questo campo dinamicamente
  public utente_veicoli?: NonAttribute<ormVeicolo[]>; // Sequelize riempirà questo campo dinamicamente

  // Definisci le associazioni
  static associate(models: any) {
    ormUtente.belongsToMany(models.ormProfilo, {
      through: models.ormUtenteProfilo,
      foreignKey: 'id_utente',
      as: 'utente_profili',
    });
    ormUtente.belongsToMany(models.ormVeicolo, {
      through: models.ormUtenteVeicolo,
      foreignKey: 'id_utente',
      as: 'utente_veicoli',
    });
  }
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
