import { enumVeicoloStato } from '../../entity/enum/enumVeicoloStato';
import { enumVeicoloTipo } from '../../entity/enum/enumVeicoloTipo';
import database from '../../utils/database';
import { DataTypes, Model, NonAttribute, Sequelize } from 'sequelize';
import { ormUtenteVeicolo } from '../utente/ormUtenteVeicolo';
import { ormUtente } from '../utente/ormUtente';

/**
 * Instanziazione della connessione verso il RDBMS
 */
const sequelize: Sequelize = database.getInstance();

export class ormVeicolo extends Model {
  public id!: number;
  public tipo!: enumVeicoloTipo;
  public targa!: string;
  public stato!: enumVeicoloStato;

  public veicolo_utenti?: NonAttribute<ormUtente[]>; // Sequelize riempirà questo campo dinamicamente

  // Definisci le associazioni
  static associate(models: any) {
    ormVeicolo.hasMany(models.ormTransito, {
      foreignKey: 'id_veicolo',
      as: 'transiti',
    });
    ormVeicolo.belongsToMany(models.ormUtente, {
      through: ormUtenteVeicolo,
      foreignKey: 'id_veicolo',
      as: 'veicolo_utenti',
    });
  }
}

// Definizione del modello
ormVeicolo.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    tipo: {
      type: DataTypes.ENUM(...Object.values(enumVeicoloTipo)),
      allowNull: false,
      unique: true,
    },
    targa: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    stato: {
      type: DataTypes.ENUM(...Object.values(enumVeicoloStato)),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'svt_veicolo',
    tableName: 'svt_veicolo',
  },
);
