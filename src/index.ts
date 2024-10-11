import logger from './utils/logger-winston';
import express from 'express';
import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import routerVarco from './routes/varco';
import routerTratta from './routes/tratta';
import routerVeicolo from './routes/veicolo';
import routerTransito from './routes/transito';
import routerMulta from './routes/multa';
import databaseCache from './utils/database-cache';
import database from './utils/database';
import messenger from './utils/messenger';
import startTaskCheckMultaConsumer from './consumers/consumerCheckMulta';
import startTaskGenerazioneBollettinoConsumer from './consumers/consumerGenerazioneBollettino';
import startTaskCheckMultaAutomobilistaConsumer from './consumers/consumerCheckMultaAutomobilista';
import startTaskCheckMultaBollettinoConsumer from './consumers/consumerCheckMultaBollettino';
import startTaskTransitoOCRConsumer from './consumers/consumerTransitoOCR';

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

// app.use('/login', routerLogin); ROTTA UTILIZZATA PER TEST
app.use('/varco', routerVarco);
app.use('/tratta', routerTratta);
app.use('/veicolo', routerVeicolo);
app.use('/transito', routerTransito);
app.use('/multa', routerMulta);

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
    clearRedisCache();
    // Avvio di RabbitMQ
    startTaskCheckMultaConsumer();
    startTaskCheckMultaAutomobilistaConsumer();
    startTaskCheckMultaBollettinoConsumer();
    startTaskGenerazioneBollettinoConsumer();
    startTaskTransitoOCRConsumer();
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

// Funzione per pulire la cache di Redis
async function clearRedisCache() {
  const redisClient = await databaseCache.getInstance();
  try {
    // Pulisce tutti i database di Redis
    await redisClient.flushAll();
    logger.info('Cache Redis pulita con successo!');
  } catch (error) {
    logger.error('Errore durante la pulizia della cache Redis:', error);
  } finally {
    //redisClient.disconnect(); // Chiudi la connessione
  }
}
