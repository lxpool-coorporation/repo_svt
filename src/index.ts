import logger from './utils/logger-winston';

import { sequelize, models } from './models/utente/ormInitUtente';
import { eUtente } from './entity/utente/eUtente';
import { enumStato } from './entity/enum/enumStato';
import { eProfilo } from './entity/utente/eProfilo';
import { serviceUtente } from './services/serviceUtente';

logger.info('app started');

let sync_db = false
if(sync_db){
// Sincronizzazione del database (opzionale: 'force: true' per reinizializzare il DB)
sequelize.sync({ force: true })  // Usa `force: true` se vuoi ricreare le tabelle ogni volta
  .then(() => {
    console.log('Database synchronized');


  })
  .catch((error) => {
    console.error('Errore durante la sincronizzazione del database:', error);
  });
}

async function readUser1() {

  const profilo1 = await daoProfilo.save(new eProfilo(1,"OPR","OPERATORE",enumStato.attivo))
  const profilo2 = await daoProfilo.save(new eProfilo(2,"AUT","AUTOMOBILISTA",enumStato.attivo))
  
  const user1 = await daoUtente.save(new eUtente(1,"AAABBB89P247E99E",enumStato.attivo))
  const user2 = await daoUtente.save(new eUtente(2,"ADFERF44P247EAWE",enumStato.attivo))

  const profili = await ormProfilo.findAll();

  const ormUser2 = await ormUtente.findByPk(2);



}


async function readUser2() {
 // const utenteConProfili1 = await ormUtente.findByPk(2)
  const utente = await serviceUtente.getUtenteById(2);
  if(utente)
  {
      console.log("TROVATO UTENTE: " + utente.get_codiceFiscale())
      console.log(console.log(JSON.stringify(utente)))
      const profiliUtente = await serviceUtente.getProfiliByIdUtente(utente.get_id())
      if(profiliUtente){
          console.log("PROFILI ASSOCIATI: ")
          profiliUtente.forEach(a => {
            console.log(`- ${a.get_descrizione()}`)
            console.log(JSON.stringify(a))
          })
      }
      
  }

}

//readUser1()
readUser2()
async function readUser() {
    const objUser: eUtente | null = await daoUtente.get(3);
    if (objUser) {
        console.log(`user trovato: ${JSON.stringify(objUser)}`);
        console.log(`stato user: ${JSON.stringify(objUser.get_stato())}`);
    } else {
        console.log('Errore durante la lettura dell\'utente.');
    }
}



//readUser()


