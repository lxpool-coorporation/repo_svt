import { enumPolicyTipo } from '../../entity/enum/enumPolicyTipo';
import { enumStato } from '../../entity/enum/enumStato';
import database from '../../utils/database';
import { DataTypes, Model, Sequelize } from 'sequelize';

/**
 * Instanziazione della connessione verso il RDBMS
 */
const sequelize: Sequelize = database.getInstance();

export class ormPolicy extends Model {
  public id!: number;
  public cod!: string;
  public descrizione!: string;
  public tipo!: enumPolicyTipo;
  public stato!: enumStato;

  // Definisci le associazioni
  static associate(models: any) {
    ormPolicy.hasOne(models.ormPolicySpeedControl, {
      foreignKey: 'id_policy',
      as: 'policy',
    });
    ormPolicy.belongsToMany(models.ormTratta, {
      through: models.ormTrattaPolicy,
      foreignKey: 'id_policy',
      as: 'policy_tratte',
    });
    ormPolicy.hasMany(models.ormMulta, {
      foreignKey: 'id_policy',
      as: 'policy_multe',
    });
  }
}

// Definizione del modello
ormPolicy.init(
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
    tipo: {
      type: DataTypes.ENUM(...Object.values(enumPolicyTipo)),
      allowNull: false,
    },
    stato: {
      type: DataTypes.ENUM(...Object.values(enumStato)),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'ormPolicy',
    tableName: 'svt_plc_policy',
  },
);
