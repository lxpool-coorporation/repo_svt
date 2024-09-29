import { Sequelize } from 'sequelize';
import Database from '../../utils/database';
import { ormUtente } from './ormUtente';
import { ormUtenteProfilo } from './ormUtenteProfilo';

const sequelize: Sequelize = Database.getInstance();

// Inizializza tutti i modelli qui
const models = {
    ormUtente,
    ormUtenteProfilo
  };

// Definire tutte le relazioni qui
models.ormUtenteProfilo.belongsTo(ormUtente, { foreignKey: 'id_utente', as: 'utente' });

export { sequelize, models };