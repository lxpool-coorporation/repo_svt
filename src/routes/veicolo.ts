import { middlewareVeicolo } from '../middleware/middlewareVeicolo';
import { middlewareAuth } from '../middleware/middlewareAuth';
import { Router } from 'express';
import { controllerVeicolo } from '../controllers/controllerVeicolo';

const routerVeicolo = Router();

routerVeicolo.get(
  '/',
  middlewareAuth.verifyToken,
  middlewareVeicolo.checkPermissionRead,
  controllerVeicolo.getAll,
);
routerVeicolo.get(
  '/:id',
  middlewareAuth.verifyToken,
  middlewareVeicolo.checkPermissionRead,
  controllerVeicolo.getById,
);
routerVeicolo.post(
  '/',
  middlewareAuth.verifyToken,
  middlewareVeicolo.checkPermissionWrite,
  controllerVeicolo.saveVeicolo,
);
routerVeicolo.delete(
  '/:id',
  middlewareAuth.verifyToken,
  middlewareVeicolo.checkPermissionWrite,
  controllerVeicolo.deleteById,
);
routerVeicolo.put(
  '/:id',
  middlewareAuth.verifyToken,
  middlewareVeicolo.checkPermissionWrite,
  controllerVeicolo.putVeicolo,
);
routerVeicolo.patch(
  '/:id',
  middlewareAuth.verifyToken,
  middlewareVeicolo.checkPermissionWrite,
  controllerVeicolo.patchVeicolo,
);

export default routerVeicolo;
