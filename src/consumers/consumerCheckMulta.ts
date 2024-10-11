import { enumMessengerCoda } from '../entity/enum/enumMessengerCoda';
import amqp, { Channel, Connection, Message } from 'amqplib';
import { eMulta } from '../entity/svt/eMulta';
import { eTransito } from '../entity/svt/eTransito';
import { serviceMulta } from '../services/serviceMulta';
import { enumMultaStato } from '../entity/enum/enumMultaStato';

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

    console.log(`[*] In attesa di messaggi nella coda: ${queue}`);

    // Consuma i messaggi dalla coda
    channel.consume(
      queue,
      async (msg: Message | null) => {
        if (msg) {
          const content: string = msg.content.toString();
          console.log(
            enumMessengerCoda.queueCheckMulta +
              `: Ricevuto: ${content}`,
          );
          const parsedContent =
            typeof content === 'string' ? JSON.parse(content) : content;

          const objTransito: eTransito | null = eTransito.fromJSON(parsedContent);
          if (objTransito) {
            console.log(objTransito);
          }

          const objMulta:eMulta | null = await serviceMulta.verificaMulta(objTransito);
          if(objMulta){
            console.log(`MULTA GENERATA: ${objMulta.get_id()}`);
            const statoMulta:enumMultaStato = await serviceMulta.getMultaStato(objMulta);
            await serviceMulta.updateFieldsMulta(objMulta, {stato: statoMulta});
            
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

export default startTaskCheckMultaConsumer;
