import logger from './utils/logger-winston';
import express from 'express';
import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import routerLogin from './routes/login';
import { authMiddleware } from './middleware/authMiddleware';
import { serviceUtente } from './services/serviceUtente';

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
// Route protetta, accessibile solo con un token valido
app.get('/*', authMiddleware.verifyToken, (_req, res) => {
  res.status(200).json({ message: `Benvenuto, utente` });
});
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


