import { middlewareTratta } from '../middleware/middlewareTratta';
import { middlewareAuth } from '../middleware/middlewareAuth';
import { Router } from 'express';
import { controllerTratta } from '../controllers/controllerTratta';

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
  controllerTratta.putTratta,
);
routerTratta.patch(
  '/:id',
  middlewareAuth.verifyToken,
  middlewareTratta.checkPermissionWrite,
  controllerTratta.patchTratta,
);

export default routerTratta;
