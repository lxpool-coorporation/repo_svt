import { enumStato } from '../../entity/enum/enumStato';
import database from '../../utils/database';
import { DataTypes, Model, Sequelize } from 'sequelize';
/**
 * Instanziazione della connessione verso il RDBMS
 */
const sequelize: Sequelize = database.getInstance();

export class ormVarco extends Model {
  public id!: number;
  public cod!: string;
  public descrizione!: string;
  public latitudine!: number;
  public longitudine!: number;
  public stato!: enumStato;

  // Definisci le associazioni
  static associate(models: any) {
    // Associazioni Many-to-Many
    ormVarco.hasMany(models.ormTransito, {
      foreignKey: 'id_varco', // 'id_varco' è la chiave esterna nella tabella ormTransito
      as: 'transiti_varco', // alias per i transiti associati al varco
    });
  }
}

// Definizione del modello
ormVarco.init(
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
    latitudine: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: false,
    },
    longitudine: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: false,
    },
    stato: {
      type: DataTypes.ENUM(...Object.values(enumStato)),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'svt_varco',
    tableName: 'svt_varco',
  },
);
