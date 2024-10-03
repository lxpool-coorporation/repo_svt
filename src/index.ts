import logger from './utils/logger-winston';

import { serviceUtente } from './services/serviceUtente';
import { enumPermessoTipo } from './entity/enum/enumPermessoTipo';
import { enumPermessoCategoria } from './entity/enum/enumPermessoCategoria';

logger.info('app started');

async function readUser2() {
  //await serviceUtente.initStrutturaUtente({alter:true })
  //await serviceUtente.createUtente("CRLLCU88P11L4872",enumStato.attivo)
  //await serviceUtente.createUtente("BVLOVD43P99ALSJD",enumStato.attivo)

  // const utenteConProfili1 = await ormUtente.findByPk(2)
  const utente = await serviceUtente.getUtenteById(1);
  if (utente) {
    console.log('TROVATO UTENTE : ' + utente.get_identificativo());
    console.log(JSON.stringify(utente));
    const profiliUtente = await serviceUtente.getProfiliByIdUtente(
      utente.get_id(),
    );
    if (profiliUtente) {
      console.log('PROFILI ASSOCIATI: ');
      profiliUtente.forEach((a) => {
        console.log(`- ${a.get_descrizione()}`);
        console.log(JSON.stringify(a));
      });
    }

    const permessiUtente = await serviceUtente.getPermessiByIdUtente(
      utente.get_id(),
    );
    if (permessiUtente) {
      console.log('PERMESSI ASSOCIATI: ');
      permessiUtente.forEach((c) => {
        console.log(`- ${c.get_descrizione()}`);
        console.log(JSON.stringify(c));
      });
    }

    const checkPermessoUtente = await serviceUtente.hasPermessoByIdUtente(
      utente.get_id(),
      enumPermessoCategoria.varco,
      enumPermessoTipo.lettura,
    );
    if (checkPermessoUtente) console.log('UTENTE HA PERMESSO DI LETTURA SU');
    else console.log('UTENTE NON HA IL PERMESSO');
  }
}

readUser2();
