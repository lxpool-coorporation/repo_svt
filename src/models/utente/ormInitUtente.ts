import { Sequelize } from 'sequelize';
import database from '../../utils/database';
import { ormUtente } from './ormUtente';
import { ormUtenteProfilo } from './ormUtenteProfilo';
import { ormProfilo } from './ormProfilo';
import { ormPermesso } from './ormPermesso';
import { ormProfiloPermesso } from './ormProfiloPermesso';
import { ormProfiloUtente } from './ormProfiloUtente';

const sequelize: Sequelize = database.getInstance();

// Inizializza tutti i modelli qui
const models = {
  ormUtente,
  ormProfilo,
  ormUtenteProfilo,
  ormProfiloUtente,
  ormPermesso,
  ormProfiloPermesso,
};

// Associazioni Many-to-Many
ormUtente.belongsToMany(ormProfilo, {
  through: ormUtenteProfilo,
  foreignKey: 'id_utente',
  as: 'profili',
});
ormProfilo.belongsToMany(ormUtente, {
  through: ormUtenteProfilo,
  foreignKey: 'id_profilo',
  as: 'utenti',
});
ormProfilo.belongsToMany(ormPermesso, {
  through: ormProfiloPermesso,
  foreignKey: 'id_profilo',
  as: 'permessi',
});
ormPermesso.belongsToMany(ormProfilo, {
  through: ormProfiloPermesso,
  foreignKey: 'id_permesso',
  as: 'profili',
});

export { sequelize, models };
