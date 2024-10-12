import { enumMessengerCoda } from '../entity/enum/enumMessengerCoda';
import amqp, { Channel, Connection, Message } from 'amqplib';
import { controllerOcr } from '../controllers/controllerOcr';
import { eTransito } from '../entity/svt/eTransito';
import path from 'path';
import dotenv from 'dotenv';
import { enumTransitoStato } from '../entity/enum/enumTransitoStato';
import { eVeicolo } from '../entity/svt/eVeicolo';
import { serviceVeicolo } from '../services/serviceVeicolo';
import { enumVeicoloTipo } from '../entity/enum/enumVeicoloTipo';
import { serviceTransito } from '../services/serviceTransito';
import logger from '../utils/logger-winston';
import { enumVeicoloStato } from '../entity/enum/enumVeicoloStato';

dotenv.config();
const IMAGE_PATH = process.env.IMAGE_PATH || '.img';

async function startTaskTransitoOCRConsumer(): Promise<void> {
  try {
    // Connessione a RabbitMQ con gestione degli errori
    const connection: Connection = await amqp.connect(
      process.env.RABBITMQ_URL || 'amqp://localhost',
    );
    const channel: Channel = await connection.createChannel();

    const queue: string = enumMessengerCoda.queueTransitoOCR;

    // Assicura che la coda esista
    await channel.assertQueue(queue, { durable: true });

    // Consuma i messaggi dalla coda
    channel.consume(
      queue,
      async (msg: Message | null) => {
        if (msg) {
          const content: string = msg.content.toString();

          const parsedContent =
            typeof content === 'string' ? JSON.parse(content) : content;

          const objTransito: eTransito | null =
            eTransito.fromJSON(parsedContent);
          if (!objTransito) {
            throw new Error(
              `error: eTransito non decodificato: ${parsedContent}`,
            );
          }

          try {
            const filePath = path.join(
              IMAGE_PATH,
              objTransito.get_path_immagine() || '',
            );
            const targa = await controllerOcr.detectAndRecognizePlate(filePath);
            if (targa === '') {
              objTransito.set_stato(enumTransitoStato.illeggibile);
              await serviceTransito.updateFieldsTransito(objTransito, {
                stato: enumTransitoStato.illeggibile,
              });
            } else {
              const targaRegex = /^(?=.*[A-Z])(?=.*[0-9])[A-Z0-9]+$/;
              if (targaRegex.test(targa)) {
                let idVeicolo: number | null = null;

                let objVeicolo: eVeicolo | null =
                  await serviceVeicolo.getVeicoloByTarga(targa);
                if (objVeicolo) {
                  idVeicolo = objVeicolo.get_id();
                } else {
                  objVeicolo = await serviceVeicolo.createVeicolo(
                    enumVeicoloTipo.indefinito,
                    targa,
                    enumVeicoloStato.in_attesa,
                  );
                  if (objVeicolo) {
                    idVeicolo = objVeicolo.get_id();
                  }
                }
                if (idVeicolo) {
                  objTransito.set_id_veicolo(idVeicolo);
                  await serviceTransito.updateFieldsTransito(objTransito, {
                    id_veicolo: idVeicolo,
                    stato: enumTransitoStato.elaborato,
                  });
                }
              } else {
                objTransito.set_stato(enumTransitoStato.illeggibile);
                await serviceTransito.updateFieldsTransito(objTransito, {
                  stato: enumTransitoStato.illeggibile,
                });
              }
            }
          } catch (error: any) {
            logger.warn('middlewareTransito.ocrTarga :' + error?.message);
          }
          // Conferma che il messaggio è stato elaborato
          channel.ack(msg);
        }
      },
      {
        noAck: false, // Modalità di conferma manuale
      },
    );
  } catch (_error) {}
}

export default startTaskTransitoOCRConsumer;
