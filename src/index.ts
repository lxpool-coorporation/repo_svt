import logger from './utils/logger-winston';

import { serviceUtente } from './services/serviceUtente';

logger.info('app started');

async function readUser2() {


  //await serviceUtente.initStrutturaUtente({force:true})

  // const utenteConProfili1 = await ormUtente.findByPk(2)
  const utente = await serviceUtente.getUtenteById(1);
  if (utente) {
    console.log('TROVATO UTENTE: ' + utente.get_codiceFiscale());
    console.log(console.log(JSON.stringify(utente)));
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
  }
}

readUser2();
