import { middlewareMulta } from '../middleware/middlewareMulta';
import { middlewareAuth } from '../middleware/middlewareAuth';
import { Router } from 'express';
import { controllerMulta } from '../controllers/controllerMulta';
import { middlewareValidate } from '../middleware/middlewareValidate';

const routerMulta = Router();

routerMulta.get(
  '/',
  middlewareAuth.verifyToken,
  middlewareMulta.checkPermissionRead,
  middlewareMulta.validate,
  middlewareValidate.handleValidationErrors,
  controllerMulta.getAll,
);

routerMulta.get(
  '/download/:id',
  middlewareAuth.verifyToken,
  middlewareMulta.checkPermissionRead,
  controllerMulta.download,
);

export default routerMulta;
