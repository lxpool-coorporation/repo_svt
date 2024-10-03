import { Sequelize } from 'sequelize';
import database from '../../utils/database';
import { ormVeicolo } from './ormVeicolo';
import { ormUtente } from '../utente/ormUtente';
import { ormUtenteVeicolo } from '../utente/ormUtenteVeicolo';
import { ormVarco } from './ormVarco';

const sequelize: Sequelize = database.getInstance();

// Inizializza tutti i modelli qui
const models = {
  ormVeicolo,
  ormVarco,
};

// Associazioni Many-to-Many
ormVeicolo.belongsToMany(ormUtente, {
  through: ormUtenteVeicolo,
  foreignKey: 'id_utente',
  as: 'veicoli',
});

export { sequelize, models };