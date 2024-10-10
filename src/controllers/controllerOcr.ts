import dotenv from 'dotenv';
import logger from '../utils/logger-winston';
import * as cv from 'opencv4nodejs';
import tesseract from 'node-tesseract-ocr';
import fs from 'fs';

dotenv.config();

const tesseractConfig = {
  lang: 'eng', // lingua
  oem: 3, // Modello di riconoscimento (0-3)
  psm: 6, // Modalità di segmentazione del layout
  tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', // Limita il riconoscimento a lettere maiuscole e numeri
};

export class controllerOcr {
  private constructor() {}

  //cerca un rettangolo contenente solo la targa all'interno dell'immagine
  public static detectPlate = (imagePath: string): cv.Mat | null => {
    let ret: cv.Mat | null = null;
    try {
      const originalImage = cv.imread(imagePath);

      // Converti in scala di grigi
      const grayImage = originalImage.bgrToGray();

      // Applica un filtro di blur per ridurre il rumore
      const blurredImage = grayImage.gaussianBlur(new cv.Size(5, 5), 0);

      // Trova i bordi usando l'algoritmo di Canny
      const edgedImage = blurredImage.canny(100, 200);

      // Trova i contorni nell'immagine
      const contours = edgedImage.findContours(
        cv.RETR_TREE,
        cv.CHAIN_APPROX_SIMPLE,
      );

      // Filtra i contorni per identificare la targa (basato su proporzioni e dimensioni)
      const possiblePlates = contours.filter((cnt) => {
        const rect = cnt.boundingRect();
        const aspectRatio = rect.width / rect.height;
        return aspectRatio > 2 && aspectRatio < 5 && rect.width > 100; // Regole per trovare possibili targhe
      });

      if (possiblePlates.length > 0) {
        const plateRect =
          possiblePlates[possiblePlates.length - 1].boundingRect();
        const plateImage = originalImage.getRegion(plateRect);
        ret = plateImage;
      } else {
        ret = null;
      }
    } catch (error: any) {
      logger.error('controllerOcr.detectPlate :' + error?.message);
      ret = null;
    }
    return ret;
  };
  // Funzione per eseguire OCR sulla targa rilevata usando node-tesseract-ocr
  public static recognizePlate = async (
    plateImage: cv.Mat,
  ): Promise<string> => {
    let ret: string = '';
    try {
      const grayPlateImage = plateImage.bgrToGray();

      // Salva temporaneamente l'immagine della targa per l'elaborazione con Tesseract
      //const tempImagePath = path.resolve(__dirname, 'targa2.jpg');
      //console.log(tempImagePath);
      //cv.imwrite('.img/tempImagePath.jpg', grayPlateImage);

      //salvo l'immagine su un buffer per renderlo fruibile per tesseract
      const imageBuffer = cv.imencode('.jpg', grayPlateImage);

      // Esegui l'OCR utilizzando node-tesseract-ocr
      const text = await tesseract.recognize(imageBuffer, tesseractConfig);
      ret = text
        .trim()
        .replace(/[^A-Z0-9]/g, '')
        .replace(' ', '');
      logger.info('controllerOcr.recognizePlate : testo targa [' + ret + ']');
    } catch (error: any) {
      logger.error('controllerOcr.recognizePlate :', error);
    } finally {
      // Rimuovo l'immagine temporanea
      //fs.unlinkSync(tempImagePath);
    }
    return ret;
  };
  //funzione che prima delimita la regione contenente la targa e poi applica OCR
  public static detectAndRecognizePlate = async (
    plateImagePath: string,
  ): Promise<string> => {
    let ret: Promise<string> = Promise.resolve('');
    try {
      if (fs.existsSync(plateImagePath)) {
        const plateImage = controllerOcr.detectPlate(plateImagePath);

        if (plateImage) {
          ret = controllerOcr.recognizePlate(plateImage);
        } else {
          logger.warn(
            'controllerOcr.detectAndRecognizePlate : nessuna targa rilevata per immagine [' +
              plateImagePath +
              ']',
          );
        }
      } else {
        logger.warn(
          'controllerOcr.detectAndRecognizePlate : immagine [' +
            plateImagePath +
            '] NON ESISTE',
        );
      }
    } catch (error: any) {
      logger.error('controllerOcr.detectAndRecognizePlate :', error);
    }
    return ret;
  };
}
