import { enumStato } from '../../entity/enum/enumStato';
import database from '../../utils/database';
import { DataTypes, Model, NonAttribute, Sequelize } from 'sequelize';
import { ormPermesso } from './ormPermesso';
import { enumProfiloTipo } from '../../entity/enum/enumProfiloTipo';

/**
 * Instanziazione della connessione verso il RDBMS
 */
const sequelize: Sequelize = database.getInstance();

export class ormProfilo extends Model {
  public id!: number;
  public cod!: string;
  public descrizione!: string;
  public enum_profilo!: enumProfiloTipo;
  public stato!: enumStato;

  // Definisci una proprietà per i permessi associati
  public profilo_permessi?: NonAttribute<ormPermesso[]>; // Sequelize riempirà questo campo dinamicamente

  // Definisci le associazioni
  static associate(models: any) {
    ormProfilo.belongsToMany(models.ormUtente, {
      through: models.ormUtenteProfilo,
      foreignKey: 'id_profilo',
      as: 'profilo_utenti',
    });
    ormProfilo.belongsToMany(models.ormPermesso, {
      through: models.ormProfiloPermesso,
      foreignKey: 'id_profilo',
      as: 'profilo_permessi',
    });
  }
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
    enum_profilo: {
      type: DataTypes.ENUM(...Object.values(enumProfiloTipo)),
      allowNull: false,
    },
    stato: {
      type: DataTypes.ENUM(...Object.values(enumStato)),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'utn_prf_profilo',
    tableName: 'utn_prf_profilo',
  },
);
