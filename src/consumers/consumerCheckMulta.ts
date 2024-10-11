import { enumMessengerCoda } from '../entity/enum/enumMessengerCoda';
import amqp, { Channel, Connection, Message } from 'amqplib';
import { eMulta } from '../entity/svt/eMulta';
import { eTransito } from '../entity/svt/eTransito';
import { serviceMulta } from '../services/serviceMulta';

async function startTaskCheckMultaConsumer(): Promise<void> {
  try {
    // Connessione a RabbitMQ con gestione degli errori
    const connection: Connection = await amqp.connect(
      process.env.RABBITMQ_URL || 'amqp://localhost',
    );
    const channel: Channel = await connection.createChannel();

    const queue: string = enumMessengerCoda.queueCheckMulta;

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

          const objMulta: eMulta | null =
            await serviceMulta.verificaMulta(objTransito);
          if (objMulta) {
            await serviceMulta.refreshMultaStato(objMulta);
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

export default startTaskCheckMultaConsumer;
