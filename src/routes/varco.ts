import { middlewareVarco } from '../middleware/middlewareVarco';
import { middlewareAuth } from '../middleware/middlewareAuth';
import { Router } from 'express';
import { controllerVarco } from '../controllers/controllerVarco';
<<<<<<< HEAD
import { middlewareValidate } from '../middleware/middlewareValidate';
=======
>>>>>>> main

const routerVarco = Router();

routerVarco.get(
  '/',
  middlewareAuth.verifyToken,
  middlewareVarco.checkPermissionRead,
  controllerVarco.getAll,
);
routerVarco.get(
  '/:id',
  middlewareAuth.verifyToken,
  middlewareVarco.checkPermissionRead,
  controllerVarco.getById,
);
routerVarco.post(
  '/',
  middlewareAuth.verifyToken,
  middlewareVarco.checkPermissionWrite,
  controllerVarco.saveVarco,
);
routerVarco.delete(
  '/:id',
  middlewareAuth.verifyToken,
  middlewareVarco.checkPermissionWrite,
  controllerVarco.deleteById,
);
routerVarco.put(
  '/:id',
  middlewareAuth.verifyToken,
  middlewareVarco.checkPermissionWrite,
  controllerVarco.putVarco,
);
routerVarco.patch(
  '/:id',
  middlewareAuth.verifyToken,
  middlewareVarco.checkPermissionWrite,
  controllerVarco.patchVarco,
);

export default routerVarco;
