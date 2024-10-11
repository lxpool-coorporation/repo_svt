import { enumMessengerCoda } from '../entity/enum/enumMessengerCoda';
import amqp, { Channel, Connection, Message } from 'amqplib';
import { eMulta } from '../entity/svt/eMulta';
import { serviceMulta } from '../services/serviceMulta';

async function startTaskCheckMultaAutomobilistaConsumer(): Promise<void> {
  try {
    // Connessione a RabbitMQ con gestione degli errori
    const connection: Connection = await amqp.connect(
      process.env.RABBITMQ_URL || 'amqp://localhost',
    );
    const channel: Channel = await connection.createChannel();

    const queue: string = enumMessengerCoda.queueCheckMultaAutomobilista;

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
            enumMessengerCoda.queueCheckMultaAutomobilista +
              `: Ricevuto: ${content}`,
          );
          const parsedContent =
            typeof content === 'string' ? JSON.parse(content) : content;

          const objMulta: eMulta | null = eMulta.fromJSON(parsedContent);
          if (objMulta) {
            console.log(objMulta);
          }

          
          

          // Imposta le intestazioni per il download del PDF
          //res.setHeader('Content-Type', 'application/pdf');
          //res.setHeader('Content-Disposition', `attachment; filename=bollettino_${multaID}.pdf`);

          // Invia il PDF come risposta
          //doc.pipe(res);
          //doc.end();

          //}

          // Logica per elaborare il messaggio

          // Conferma che il messaggio è stato elaborato
          channel.ack(msg);
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

export default startTaskCheckMultaAutomobilistaConsumer;
