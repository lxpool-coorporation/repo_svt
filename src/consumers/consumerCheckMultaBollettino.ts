import { serviceMulta } from '../services/serviceMulta';
import { enumMessengerCoda } from '../entity/enum/enumMessengerCoda';
import amqp, { Channel, Connection, Message } from 'amqplib';
import { eMulta } from '../entity/svt/eMulta';
import { eBollettino } from '../entity/svt/eBollettino';
import logger from '../utils/logger-winston';

async function startTaskCheckMultaBollettinoConsumer(): Promise<void> {
  try {
    // Connessione a RabbitMQ con gestione degli errori
    const connection: Connection = await amqp.connect(
      process.env.RABBITMQ_URL || 'amqp://localhost',
    );
    const channel: Channel = await connection.createChannel();

    const queue: string = enumMessengerCoda.queueCheckMultaBollettino;

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

          const objMulta: eMulta | null = eMulta.fromJSON(parsedContent);

          if (objMulta) {
            const obj: eBollettino | null =
              await serviceMulta.getBollettinoByIdMulta(objMulta.get_id());
            if (!obj) {
              const objBollettino: eBollettino | null =
                await serviceMulta.richiediBollettino(objMulta.get_id());
              if (!objBollettino) {
                logger.warn(`richiesta bollettino non generata correttamente`);
              } else {
                logger.info(
                  `richiesta bollettino generata correttamente con id ${objBollettino.get_id()}`,
                );
              }
            }
          }

          channel.ack(msg);
        }
      },
      {
        noAck: false, // Modalità di conferma manuale
      },
    );
  } catch (_error) {}
}

export default startTaskCheckMultaBollettinoConsumer;
