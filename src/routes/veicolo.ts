import { middlewareVeicolo } from '../middleware/middlewareVeicolo';
import { middlewareAuth } from '../middleware/middlewareAuth';
import { middlewareValidate } from '../middleware/middlewareValidate';
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
  middlewareVeicolo.validate,
  middlewareValidate.handleValidationErrors,
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
  middlewareVeicolo.validate,
  middlewareValidate.handleValidationErrors,
  controllerVeicolo.putVeicolo,
);
routerVeicolo.patch(
  '/:id',
  middlewareAuth.verifyToken,
  middlewareVeicolo.checkPermissionWrite,
  middlewareVeicolo.validate,
  middlewareValidate.handleValidationErrors,
  controllerVeicolo.patchVeicolo,
);
routerVeicolo.post(
  '/associate_user',
  middlewareAuth.verifyToken,
  middlewareVeicolo.checkPermissionWrite,
  middlewareVeicolo.validateAssociation,
  middlewareValidate.handleValidationErrors,
  controllerVeicolo.associateUser,
);

export default routerVeicolo;
