import logger from './utils/logger-winston';
import express from 'express';
import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import routerLogin from './routes/login';
import { serviceUtente } from './services/serviceUtente';
import { enumPermessoTipo } from './entity/enum/enumPermessoTipo';
import { enumPermessoCategoria } from './entity/enum/enumPermessoCategoria';
import routerVarco from './routes/varco';
import routerTratta from './routes/tratta';
import routerVeicolo from './routes/veicolo';

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
    logger.info('Server in esecuzione su http://localhost:' + String(PORT));
  })
  .on('error', (err: Error) => {
    logger.error(err.message);
  });

export default app;

async function _readUser2() {
  //await serviceUtente.initStruttura({alter:true })
  //await serviceTransito.initStruttura({alter:true })
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
