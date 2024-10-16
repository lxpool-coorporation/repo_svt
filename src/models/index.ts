// Importa tutti i modelli
import { ormMulta } from './svt/ormMulta';
import { ormMultaSpeedControl } from './svt/ormMultaSpeedControl';
import { ormPolicy } from './svt/ormPolicy';
import { ormPolicySanction } from './svt/ormPolicySanction';
import { ormPolicySpeedControl } from './svt/ormPolicySpeedControl';
import { ormTransito } from './svt/ormTransito';
import { ormTratta } from './svt/ormTratta';
import { ormTrattaPolicy } from './svt/ormTrattaPolicy';
import { ormVarco } from './svt/ormVarco';
import { ormVarcoPolicy } from './svt/ormVarcoPolicy';
import { ormVeicolo } from './svt/ormVeicolo';
import { ormPermesso } from './utente/ormPermesso';
import { ormProfilo } from './utente/ormProfilo';
import { ormProfiloPermesso } from './utente/ormProfiloPermesso';
import { ormUtente } from './utente/ormUtente';
import { ormUtenteProfilo } from './utente/ormUtenteProfilo';
import { ormUtenteVeicolo } from './utente/ormUtenteVeicolo';
import { ormPolicySanctionSpeedControl } from './svt/ormPolicySanctionSpeedControl';
import { ormBollettino } from './svt/ormBollettino';

// Aggiungi i modelli al dborm
const dbOrm: { [key: string]: any } = {
  ormPermesso,
  ormProfilo,
  ormProfiloPermesso,
  ormUtente,
  ormVeicolo,
  ormUtenteProfilo,
  ormUtenteVeicolo,
  ormVarco,
  ormVarcoPolicy,
  ormTratta,
  ormTrattaPolicy,
  ormPolicy,
  ormPolicySanction,
  ormPolicySanctionSpeedControl,
  ormPolicySpeedControl,
  ormTransito,
  ormMulta,
  ormMultaSpeedControl,
  ormBollettino,
};

// Gestisci le associazioni tra i modelli
Object.keys(dbOrm).forEach((modelName) => {
  const model = dbOrm[modelName];
  // Verifica se il modello ha un metodo "associate" prima di chiamarlo
  if (typeof model.associate === 'function') {
    model.associate(dbOrm); // Passa tutti i modelli per gestire le relazioni
  }
});

// Esporta tutti i modelli insieme all'istanza Sequelize
export default {
  ...dbOrm,
};
