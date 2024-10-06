import { middlewareTransito } from '../middleware/middlewareTransito';
import { middlewareAuth } from '../middleware/middlewareAuth';
import { Router } from 'express';
import { controllerTransito } from '../controllers/controllerTransito';
import { middlewareValidate } from '../middleware/middlewareValidate';
import { middlewareUploader } from '../middleware/middlewareUploader';

const routerTransito = Router();

routerTransito.get(
  '/',
  middlewareAuth.verifyToken,
  middlewareTransito.checkPermissionRead,
  controllerTransito.getAll,
);
routerTransito.get(
  '/:id',
  middlewareAuth.verifyToken,
  middlewareTransito.checkPermissionRead,
  controllerTransito.getById,
);
routerTransito.post(
  '/',
  middlewareAuth.verifyToken,
  middlewareTransito.checkPermissionWrite,
  middlewareUploader.upload().fields([
    { name: 'immagine', maxCount: 1 }, // Campo per il file
    { name: 'metadata', maxCount: 1 }, // Campo per i dati form
  ]),
  middlewareTransito.validate,
  middlewareValidate.handleValidationErrors,
  middlewareTransito.insertTarga,
  middlewareTransito.calculateSpeedReal,
  controllerTransito.saveTransito,
);
routerTransito.delete(
  '/:id',
  middlewareAuth.verifyToken,
  middlewareTransito.checkPermissionWrite,
  middlewareTransito.checkPermissionOperatore,
  controllerTransito.deleteById,
);
routerTransito.put(
  '/:id',
  middlewareAuth.verifyToken,
  middlewareTransito.checkPermissionWrite,
  middlewareTransito.checkPermissionOperatore,
  middlewareUploader.upload().fields([
    { name: 'immagine', maxCount: 1 }, // Campo per il file
    { name: 'metadata', maxCount: 1 }, // Campo per i dati form
  ]),
  middlewareTransito.validate,
  middlewareValidate.handleValidationErrors,
  middlewareTransito.insertTarga,
  middlewareTransito.calculateSpeedReal,
  controllerTransito.putTransito,
);
routerTransito.patch(
  '/:id',
  middlewareAuth.verifyToken,
  middlewareTransito.checkPermissionWrite,
  middlewareTransito.checkPermissionOperatore,
  middlewareUploader.upload().fields([
    { name: 'immagine', maxCount: 1 }, // Campo per il file
    { name: 'metadata', maxCount: 1 }, // Campo per i dati form
  ]),
  middlewareTransito.validate,
  middlewareValidate.handleValidationErrors,
  middlewareTransito.insertTarga,
  middlewareTransito.calculateSpeedReal,
  controllerTransito.patchTransito,
);

export default routerTransito;
