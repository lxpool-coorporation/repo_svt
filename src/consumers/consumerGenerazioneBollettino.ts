import dotenv from 'dotenv';
import { enumMessengerCoda } from '../entity/enum/enumMessengerCoda';
import { eBollettino } from '../entity/svt/eBollettino';
import amqp, { Channel, Connection, Message } from 'amqplib';
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import { eMultaSpeedControl } from '../entity/svt/eMultaSpeedControl';
import { serviceMulta } from '../services/serviceMulta';
import { eTransito } from '../entity/svt/eTransito';
import { serviceTransito } from '../services/serviceTransito';
import { serviceVeicolo } from '../services/serviceVeicolo';
import { eVeicolo } from '../entity/svt/eVeicolo';
import { enumBollettinoStato } from '../entity/enum/enumBollettinoStato';

dotenv.config();
const IMAGE_PATH = process.env.IMAGE_PATH || '.img';
const IMAGE_FILE = process.env.IMAGE_FILE || '.pdf';

async function startTaskGenerazioneBollettinoConsumer(): Promise<void> {
  try {
    // Connessione a RabbitMQ con gestione degli errori
    const connection: Connection = await amqp.connect(
      process.env.RABBITMQ_URL || 'amqp://localhost',
    );
    const channel: Channel = await connection.createChannel();

    const queue: string = enumMessengerCoda.queueGeneraBollettino;

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
          const objBollettino: eBollettino =
            eBollettino.fromJSON(parsedContent);
          if (objBollettino) {
            const multa: eMultaSpeedControl | null =
              await serviceMulta.getMultaSpeedControlById(
                objBollettino.get_id_multa(),
              );
            if (!multa) {
              throw new Error(
                `errore in richiesta bollettino: multa con id ${objBollettino.get_id_multa()}`,
              );
            } else {
              const Idtransito: number | null = multa.get_id_transito();
              if (!Idtransito) {
                throw new Error(
                  `errore in richiesta bollettino: id transito null`,
                );
              }
              const transito: eTransito | null =
                await serviceTransito.getTransitoById(Idtransito);
              if (!transito) {
                throw new Error(
                  `errore in richiesta bollettino: transito id ${Idtransito}`,
                );
              }
              const IdVeicolo: number | null = await transito.get_id_veicolo();
              if (!IdVeicolo) {
                throw new Error(
                  `errore in richiesta bollettino: veicolo id nullo`,
                );
              }
              const veicolo: eVeicolo | null =
                await serviceVeicolo.getVeicoloById(IdVeicolo);
              if (!veicolo) {
                throw new Error(
                  `errore in richiesta bollettino: veicolo id ${IdVeicolo}`,
                );
              }

              const objTarga = veicolo.get_targa();
              const qrString = `${objBollettino.get_uuid()};${objBollettino.get_id_multa()};${objTarga};${objBollettino.get_importo()}`;

              // Crea un nuovo documento PDF
              const doc = new PDFDocument();

              // Genera il QR code come data URL
              const qrCode = await QRCode.toDataURL(qrString);

              // Impostare i contenuti del PDF
              doc.text(`Bollettino di pagamento`, { align: 'center' });
              doc.text(`\nTarga: ${objTarga}`);
              doc.text(`Importo: €${objBollettino.get_importo()}`);
              doc.text(`UUID Pagamento: ${objBollettino.get_uuid()}`);
              doc.text(`ID Multa: ${objBollettino.get_id_multa()}`);

              // Aggiungi il QR code al PDF
              doc.image(qrCode, {
                fit: [100, 100],
                align: 'center',
              });

              const targaImagePath = path.join(
                '/',
                IMAGE_PATH,
                transito.get_path_immagine() || '',
              );

              if (fs.existsSync(targaImagePath)) {
                doc.text(`\nImmagine della targa:`, 50, 320, { align: 'left' }); // Posiziona il testo esplicitamente
                doc.image(targaImagePath, 50, 350, {
                  // Cambia qui le coordinate e le dimensioni dell'immagine della targa
                  fit: [250, 150],
                  align: 'center',
                });
              }

              const fileNamePDF: string = `bollettino_${objBollettino.get_id_multa()}.pdf`;

              const pdfPath = path.join('/', IMAGE_FILE, fileNamePDF);

              // Crea la directory 'bollettini' se non esiste
              if (!fs.existsSync(path.dirname(pdfPath))) {
                fs.mkdirSync(path.dirname(pdfPath), { recursive: true });
              }

              // Salva il PDF su disco
              const writeStream = fs.createWriteStream(pdfPath);
              doc.pipe(writeStream);

              // Chiudi il documento quando il PDF è stato completamente scritto
              doc.end();

              writeStream.on('finish', () => {
                serviceMulta.updateFieldsBollettino(objBollettino, {
                  path_bollettino: fileNamePDF,
                  stato: enumBollettinoStato.emesso,
                });
              });

              writeStream.on('error', (_err) => {});
            }
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

export default startTaskGenerazioneBollettinoConsumer;
