// Associazioni Many-to-Many
import { ormUtente } from './ormUtente';
import { ormUtenteProfilo } from './ormUtenteProfilo';
import { ormProfilo } from './ormProfilo';
import { ormPermesso } from './ormPermesso';
import { ormProfiloPermesso } from './ormProfiloPermesso';
import { ormVeicolo } from '../vst/ormVeicolo';
import { ormUtenteVeicolo } from './ormUtenteVeicolo';
import { ormTransito } from '../vst/ormTransito';
import { ormVarco } from '../vst/ormVarco';
import { ormTratta } from '../vst/ormTratta';
import { ormPolicySpeedControl } from '../vst/ormPolicySpeedControl';
import { ormPolicy } from '../vst/ormPolicy';

export class ormAssociazioni {
  read_associazioni(): void {
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

    ormPolicy.hasOne(ormPolicySpeedControl, {
      foreignKey: 'id_policy',
      as: 'policyspeedControl',
    });

    // Definizione dell'associazione one-to-one
    ormPolicySpeedControl.belongsTo(ormPolicy, {
      foreignKey: 'id_policy',
      as: 'policy',
    });
  }
}
