import { eMulta } from '../entity/svt/eMulta';
import { enumMessengerCoda } from '../entity/enum/enumMessengerCoda';
import amqp, { Channel, Connection, Message } from 'amqplib';
import { serviceMulta } from '../services/serviceMulta';
import { eUtente } from '../entity/utente/eUtente';
import { repositoryVeicolo } from '../dao/repositories/svt/repositoryVeicolo';

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
            const idVeicolo: number | null = objMulta.get_id_veicolo();
            if (idVeicolo) {
              let idAutomobilista: number | null = null;
              const automobilista: eUtente | null =
                await repositoryVeicolo.getUtenteByIdVeicolo(idVeicolo);
              if (!!automobilista) {
                idAutomobilista = automobilista.get_id();
                objMulta.set_id_automobilista(idAutomobilista);
                await serviceMulta.updateFieldsMulta(objMulta, {
                  id_automobilista: idAutomobilista,
                });
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

export default startTaskCheckMultaAutomobilistaConsumer;
