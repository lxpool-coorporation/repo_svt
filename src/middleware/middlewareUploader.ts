import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

dotenv.config();

const IMAGE_PATH = process.env.IMAGE_PATH || '.img';
const IMAGE_TYPE =
  process.env.IMAGE_TYPE != undefined
    ? new RegExp(process.env.IMAGE_TYPE)
    : /jpeg|jpg|png/;

export class middlewareUploader {
  private constructor() {}
  public static storage = (): multer.StorageEngine => {
    return multer.diskStorage({
      destination: (_req, _file, cb) => {
        if (!fs.existsSync(IMAGE_PATH)) {
          fs.mkdirSync(IMAGE_PATH, { recursive: true }); // Crea la cartella ricorsivamente
        }
        cb(null, IMAGE_PATH); // Cartella dove salvare le immagini
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const fileName = uniqueSuffix + '-' + file.originalname;
        cb(null, fileName); // Genera un nome unico per ogni file
        req.body.path_immagine = fileName;
      },
    });
  };
  public static upload = (): multer.Multer => {
    return multer({
      storage: middlewareUploader.storage(),
      fileFilter: (_req, file, cb) => {
        // Opzionale: filtro per accettare solo immagini
        const fileTypes = IMAGE_TYPE;
        const extname = fileTypes.test(
          path.extname(file.originalname).toLowerCase(),
        );
        const mimetype = fileTypes.test(file.mimetype);

        if (mimetype && extname) {
          return cb(null, true);
        } else {
          cb(new Error('Solo immagini sono permesse!'));
        }
      },
    });
  };
}
