// ormPolicySpeedControl.ts
import database from '../../utils/database';
import { DataTypes, Model, Sequelize } from 'sequelize';
import { ormMulta } from './ormMulta';
import { enumBollettinoStato } from '../../entity/enum/enumBollettinoStato';

const sequelize: Sequelize = database.getInstance();

export class ormBollettino extends Model {
  public id!: number;
  public id_multa!: number;
  public uuid!: string;
  public importo!: number;
  public path_bollettino!: string;
  public stato!: enumBollettinoStato;

  // Associazione per accedere ai dati della policy base
  public multa?: ormMulta;

  // Definisci le associazioni
  static associate(models: any) {
    ormBollettino.belongsTo(models.ormMulta, {
      foreignKey: 'id_multa',
      as: 'multa_bollettino',
      targetKey: 'id',
    });
  }
}

ormBollettino.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_multa: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ormMulta,
        key: 'id',
      },
    },
    uuid: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    importo: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    path_bollettino: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    stato: {
      type: DataTypes.ENUM(...Object.values(enumBollettinoStato)),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'svt_bollettino',
    tableName: 'svt_bollettino',
  },
);
