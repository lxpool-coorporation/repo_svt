import logger from './utils/logger-winston';
import express from 'express';
import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import routerLogin from './routes/login';
import routerVarco from './routes/varco';
import routerTratta from './routes/tratta';
import routerVeicolo from './routes/veicolo';
import routerTransito from './routes/transito';
import databaseCache from './utils/database-cache';
import startTaskConsumer from './consumers/consumerTransito';
import { serviceTransito } from './services/serviceTransito';
import { serviceMulta } from './services/serviceMulta';
import database from './utils/database';
import messenger from './utils/messenger';
dotenv.config();
logger.info('app started');

const app = express();
const morganMiddleware = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  {
    stream: {
      // Configure Morgan to use our custom logger with the http severity
      write: (message: string) => logger.http(message.trim()),
    },
  },
);

app.use(morganMiddleware);
app.use(express.json());

app.use('/login', routerLogin);
app.use('/varco', routerVarco);
app.use('/tratta', routerTratta);
app.use('/veicolo', routerVeicolo);
app.use('/transito', routerTransito);

// catch 404 and forward to error handler
app.use(function (_req, _res, next) {
  next(createError(404));
});

// Middleware di gestione degli errori
app.use(
  (
    err: createError.HttpError,
    _req: Request,
    res: Response,
    _next: NextFunction,
  ) => {
    // Imposta lo status e restituisce una risposta JSON con il messaggio di errore
    res.status(err.status || 500).json({
      error: {
        message: err.message || 'Internal Server Error',
      },
    });
  },
);

const PORT = process.env.SERVER_PORT || 3000;

app
  .listen(PORT, () => {
    //_readUser2();

    clearRedisCache();
    // Avvio di RabbitMQ
    startTaskConsumer();
    logger.info('Server in esecuzione su http://localhost:' + String(PORT));
  })
  .on('error', (err: Error) => {
    logger.error(err.message);
  });

// Gestione della chiusura dell'applicazione
process.on('SIGINT', async () => {
  logger.info("Interruzione dell'applicazione...");

  // Chiude la connessione RabbitMQ
  const rabbitMQ = messenger.getInstance(); // Ottiene l'istanza del singleton RabbitMQ
  await rabbitMQ.close();
  // Chiudi la connessione al database
  const sequelize = database.getInstance(); // Assumendo che `database.getInstance()` restituisca l'istanza Sequelize
  await sequelize.close(); // Chiude le connessioni al database

  // Chiudi la connessione a Redis
  const redisClient = await databaseCache.getInstance();
  await redisClient.disconnect(); // Chiude la connessione Redis

  process.exit(0); // Chiude il processo Node.js in sicurezza
});

export default app;

async function _readUser2() {
  // CHECK MULTA

  const objTransito = await serviceTransito.getTransitoById(2);
  if (objTransito) {
    const multa = await serviceMulta.verificaSanzione(objTransito);
    if (!multa) console.log('multa da non generare!');
    else console.log('multa da generare');
  }

  //await serviceUtente.initStruttura({alter:true })
  //await serviceTransito.initStruttura({alter:true })
  //await serviceUtente.createUtente("CRLLCU88P11L4872",enumStato.attivo)
  //await serviceUtente.createUtente("BVLOVD43P99ALSJD",enumStato.attivo)
  // const utenteConProfili1 = await ormUtente.findByPk(2)
  //const obj = await serviceVeicolo.getVeicoloById(1);
  //if(obj){
  //  console.log(obj);
  //}
  /*
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
    */
}

// Funzione per pulire la cache di Redis
async function clearRedisCache() {
  const redisClient = await databaseCache.getInstance();
  try {
    // Pulisce tutti i database di Redis
    await redisClient.flushAll();
    console.log('Cache Redis pulita con successo!');
  } catch (error) {
    console.error('Errore durante la pulizia della cache Redis:', error);
  } finally {
    //redisClient.disconnect(); // Chiudi la connessione
  }
}
