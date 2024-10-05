import { Sequelize } from 'sequelize';
import database from '../../utils/database';
import { ormVeicolo } from './ormVeicolo';
import { ormUtente } from '../utente/ormUtente';
import { ormUtenteVeicolo } from '../utente/ormUtenteVeicolo';
import { ormVarco } from './ormVarco';
import { ormTransito } from './ormTransito';
import { ormTratta } from './ormTratta';
import { ormPolicy } from './ormPolicy';
import { ormPolicySpeedControl } from './ormPolicySpeedControl';

const sequelize: Sequelize = database.getInstance();

// Inizializza tutti i modelli qui
const models = {
  ormVeicolo,
  ormVarco,
  ormTransito,
  ormUtenteVeicolo,
  ormTratta,
  ormPolicy,
  ormPolicySpeedControl,
};

// Associazioni Many-to-Many
ormUtente.belongsToMany(ormVeicolo, {
  through: ormUtenteVeicolo,
  foreignKey: 'id_utente',
  as: 'veicoli_utente',
});

// Associazioni Many-to-Many
ormVarco.belongsToMany(ormTransito, {
  through: ormTransito,
  foreignKey: 'id_varco',
  as: 'transiti',
});

// Associazioni belongsTo
ormVarco.belongsTo(ormTratta, {
  foreignKey: 'id_varco_ingresso',
  as: 'tratta_varco_ingresso',
});

// Associazioni belongsTo
ormVarco.belongsTo(ormTratta, {
  foreignKey: 'id_varco_uscita',
  as: 'tratta_varco_uscita',
});

ormPolicy.hasOne(ormPolicySpeedControl, {
  foreignKey: 'id_policy',
  as: 'policyspeedControl',
});

// Definizione dell'associazione one-to-one
ormPolicySpeedControl.belongsTo(ormPolicy, {
  foreignKey: 'id_policy',
  as: 'policy',
});

export { sequelize, models };
