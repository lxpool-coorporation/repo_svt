import { enumStato } from '../../entity/enum/enumStato';
import database from '../../utils/database';
import { DataTypes, Model, Sequelize } from 'sequelize';
import { ormVarco } from './ormVarco';

/**
 * Instanziazione della connessione verso il RDBMS
 */
const sequelize: Sequelize = database.getInstance();

export class ormTratta extends Model {
  public id!: number;
  public cod!: string;
  public descrizione!: string;
  public id_varco_ingresso!: number;
  public id_varco_uscita!: number;
  public distanza!: number;
  public stato!: enumStato;

  // Definisci le associazioni
  static associate(models: any) {
    // Associazioni Many-to-Many
    ormTratta.belongsTo(models.ormVarco, {
      foreignKey: 'id_varco_ingresso',
      as: 'varco_ingresso',
    });
    ormTratta.belongsTo(models.ormVarco, {
      foreignKey: 'id_varco_uscita',
      as: 'varco_uscita',
    });
    ormTratta.belongsToMany(models.ormPolicy, {
      through: models.ormTrattaPolicy,
      foreignKey: 'id_tratta',
      as: 'tratta_policies',
    });
  }

}

// Definizione del modello
ormTratta.init(
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
    id_varco_ingresso: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ormVarco,
        key: 'id',
      },
    },
    id_varco_uscita: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ormVarco,
        key: 'id',
      },
    },
    distanza: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    stato: {
      type: DataTypes.ENUM(...Object.values(enumStato)),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'svt_tratta',
    tableName: 'svt_tratta',
  },
);
