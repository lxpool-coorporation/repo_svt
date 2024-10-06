import amqp, { Channel, Connection } from 'amqplib';

class Messenger {
  private static instance: Messenger;
  private connection: Connection | null = null;
  private channel: Channel | null = null;

  private constructor() {}

  // Metodo per ottenere l'istanza singleton
  public static getInstance(): Messenger {
    if (!Messenger.instance) {
      Messenger.instance = new Messenger();
    }
    return Messenger.instance;
  }

  // Metodo per connettersi a Messenger e creare un channel
  public async connect(): Promise<void> {
    if (!this.connection || !this.channel) {
      try {
        this.connection = await amqp.connect(
          process.env.RABBITMQ_URL || 'amqp://localhost',
        );
        this.channel = await this.connection.createChannel();
        console.log('Connesso a Messenger');
      } catch (error) {
        console.error('Errore nella connessione a Messenger:', error);
      }
    }
  }

  // Metodo per inviare messaggi
  public async sendToQueue(queue: string, message: string): Promise<void> {
    if (!this.channel) {
      console.error(
        'Canale Messenger non esistente. Connessione non inizializzata.',
      );
      return;
    }

    try {
      await this.channel.assertQueue(queue, { durable: true });
      this.channel.sendToQueue(queue, Buffer.from(message), {
        persistent: true,
      });
      console.log(` [x] Inviato: ${message}`);
    } catch (error) {
      console.error("Errore nell'invio del messaggio:", error);
    }
  }

  // Metodo per chiudere la connessione
  public async close(): Promise<void> {
    try {
      await this.channel?.close();
      await this.connection?.close();
      console.log('Connessione Messenger chiusa');
    } catch (error) {
      console.error('Errore nella chiusura di Messenger:', error);
    }
  }
}

export default Messenger;
