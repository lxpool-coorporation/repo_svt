import { enumMessengerCoda } from '../entity/enum/enumMessengerCoda';
import amqp, { Channel, Connection, Message } from 'amqplib';
import { eTransito } from '../entity/svt/eTransito';

async function startTaskTransitoVeicoloTipoConsumer(): Promise<void> {
  try {
    // Connessione a RabbitMQ con gestione degli errori
    const connection: Connection = await amqp.connect(
      process.env.RABBITMQ_URL || 'amqp://localhost',
    );
    const channel: Channel = await connection.createChannel();

    const queue: string = enumMessengerCoda.queueTransitoVeicoloTipo;

    // Assicura che la coda esista
    await channel.assertQueue(queue, { durable: true });

    console.log(`[*] In attesa di messaggi nella coda: ${queue}`);

    // Consuma i messaggi dalla coda
    channel.consume(
      queue,
      async (msg: Message | null) => {
        if (msg) {
          const content: string = msg.content.toString();
          console.log(
            enumMessengerCoda.queueTransitoVeicoloTipo +
              ': Ricevuto: ${content}',
          );

          const objTransitoVeicoloTipo: eTransito = eTransito.fromJSON(content);
          if (objTransitoVeicoloTipo) {
            // ...

            channel.ack(msg);
          }
        }
      },
      {
        noAck: false, // Modalità di conferma manuale
      },
    );
  } catch (error) {
    console.error('Errore nel consumer RabbitMQ:', error);
  }
}

export default startTaskTransitoVeicoloTipoConsumer;
