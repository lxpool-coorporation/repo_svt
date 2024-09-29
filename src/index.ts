import logger from './utils/logger-winston';

import { sequelize, models } from './models/utente/ormInitUtente';
import { eUtente } from './entity/utente/eUtente';
import { daoUtente } from './dao/utente/daoUtente';
import { repoUtente } from './repositories/repositoryUtente';

logger.info('app started');

let sync_db = false
if(sync_db){
// Sincronizzazione del database (opzionale: 'force: true' per reinizializzare il DB)
sequelize.sync({ alter: true })  // Usa `force: true` se vuoi ricreare le tabelle ogni volta
  .then(() => {
    console.log('Database synchronized');
  })
  .catch((error) => {
    console.error('Errore durante la sincronizzazione del database:', error);
  });
}

async function readUser() {
    const objUser: eUtente | null = await daoUtente.get(1);
    if (objUser) {
        console.log(`user trovato: ${JSON.stringify(objUser)}`);
        console.log(`stato user: ${JSON.stringify(objUser.get_stato())}`);
    } else {
        console.log('Errore durante la lettura dell\'utente.');
    }
}

async function readUserProfiles() {
    const objProfiles = await repoUtente.getAllUserProfiles(2)
    if (objProfiles) {
        console.log(`profili associati: ${JSON.stringify(objProfiles)}`);
    } else {
        console.log('Errore durante la lettura dell\'utente.');
    }
}

readUser()
readUserProfiles()



