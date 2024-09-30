import { Sequelize } from 'sequelize';
import Database from '../../utils/database';
import { ormUtente } from './ormUtente';
import { ormUtenteProfilo } from './ormUtenteProfilo';
import { ormProfilo } from './ormProfilo';

const sequelize: Sequelize = Database.getInstance();

// Inizializza tutti i modelli qui
const models = {
    ormUtente,
    ormProfilo,
    ormUtenteProfilo
  };
  
// Associazioni Many-to-Many
ormUtente.belongsToMany(ormProfilo, { through: ormUtenteProfilo, foreignKey: 'id_utente',as: 'profili' });
ormProfilo.belongsToMany(ormUtente, { through: ormUtenteProfilo, foreignKey: 'id_profilo',as: 'utenti' });

export { sequelize, models };