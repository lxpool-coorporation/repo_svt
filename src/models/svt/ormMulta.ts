import database from '../../utils/database';
import { DataTypes, Model, Sequelize } from 'sequelize';
import { ormTransito } from './ormTransito';
import { enumPolicyTipo } from '../../entity/enum/enumPolicyTipo';
import { enumMultaStato } from '../../entity/enum/enumMultaStato';

/**
 * Instanziazione della connessione verso il RDBMS
 */
const sequelize: Sequelize = database.getInstance();

export class ormMulta extends Model {
  public id!: number;
  public id_transito!: number;
  public id_policy!: number;
  public tipo_policy!: enumPolicyTipo;
  public id_automobilista!: number;
  public is_notturno!: boolean;
  public is_recidivo!: boolean;
  public stato!: enumMultaStato;

  // Definisci le associazioni
  static associate(models: any) {
    ormMulta.belongsTo(models.ormTransito, {
      foreignKey: 'id_transito',
      as: 'multa_transiti',
    });
    ormMulta.belongsTo(models.ormPolicy, {
      foreignKey: 'id_policy',
      as: 'multa_policies',
    });
    ormMulta.belongsTo(models.ormUtente, {
      foreignKey: 'id_automobilista',
      as: 'multa_utenti',
    });
    ormMulta.hasOne(models.ormMultaSpeedControl, {
      foreignKey: 'id_multa',
      as: 'multa',
    });
    ormMulta.hasMany(models.ormBollettino, {
      foreignKey: 'id_multa',
      as: 'bollettino',
    });
  }
}

// Definizione del modello
ormMulta.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_transito: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ormTransito,
        key: 'id',
      },
    },
    id_policy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'svt_plc_policy',
        key: 'id',
      },
    },
    tipo_policy: {
      type: DataTypes.ENUM(...Object.values(enumPolicyTipo)),
      allowNull: false,
    },
    id_automobilista: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'utn_utente',
        key: 'id',
      },
    },
    is_notturno: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    is_recidivo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    stato: {
      type: DataTypes.ENUM(...Object.values(enumMultaStato)),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'svt_multa',
    tableName: 'svt_multa',
  },
);
