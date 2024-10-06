import { middlewareTratta } from '../middleware/middlewareTratta';
import { middlewareAuth } from '../middleware/middlewareAuth';
import { Router } from 'express';
import { controllerTratta } from '../controllers/controllerTratta';
import { middlewareValidate } from '../middleware/middlewareValidate';

const routerTratta = Router();

routerTratta.get(
  '/',
  middlewareAuth.verifyToken,
  middlewareTratta.checkPermissionRead,
  controllerTratta.getAll,
);
routerTratta.get(
  '/:id',
  middlewareAuth.verifyToken,
  middlewareTratta.checkPermissionRead,
  controllerTratta.getById,
);
routerTratta.post(
  '/',
  middlewareAuth.verifyToken,
  middlewareTratta.checkPermissionWrite,
  middlewareTratta.validate,
  middlewareValidate.handleValidationErrors,
  controllerTratta.saveTratta,
);
routerTratta.delete(
  '/:id',
  middlewareAuth.verifyToken,
  middlewareTratta.checkPermissionWrite,
  controllerTratta.deleteById,
);
routerTratta.put(
  '/:id',
  middlewareAuth.verifyToken,
  middlewareTratta.checkPermissionWrite,
  middlewareTratta.validate,
  middlewareValidate.handleValidationErrors,
  controllerTratta.putTratta,
);
routerTratta.patch(
  '/:id',
  middlewareAuth.verifyToken,
  middlewareTratta.checkPermissionWrite,
  middlewareTratta.validate,
  middlewareValidate.handleValidationErrors,
  controllerTratta.patchTratta,
);

export default routerTratta;
