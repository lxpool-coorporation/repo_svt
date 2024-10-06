import { enumPermessoCategoria } from '../../entity/enum/enumPermessoCategoria';
import { enumPermessoTipo } from '../../entity/enum/enumPermessoTipo';
import { enumStato } from '../../entity/enum/enumStato';
import database from '../../utils/database';
import { DataTypes, Model, Sequelize } from 'sequelize';

/**
 * Instanziazione della connessione verso il RDBMS
 */
const sequelize: Sequelize = database.getInstance();

export class ormPermesso extends Model {
  public id!: number;
  public categoria!: enumPermessoCategoria;
  public tipo!: enumPermessoTipo;
  public cod!: string;
  public descrizione!: string;
  public stato!: enumStato;

  // Definisci le associazioni
  static associate(models: any) {
    ormPermesso.belongsToMany(models.ormProfilo, {
      through: models.ormProfiloPermesso,
      foreignKey: 'id_permesso',
      as: 'permesso_profili',
    });
  }
}

// Definizione del modello
ormPermesso.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    categoria: {
      type: DataTypes.ENUM(...Object.values(enumPermessoCategoria)),
      allowNull: false,
    },
    tipo: {
      type: DataTypes.ENUM(...Object.values(enumPermessoTipo)),
      allowNull: false,
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
    modelName: 'utn_prf_permesso',
    tableName: 'utn_prf_permesso',
  },
);
