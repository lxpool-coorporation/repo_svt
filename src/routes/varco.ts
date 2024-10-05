import { varcoMiddleware } from '../middleware/middlewareVarco';
import { authMiddleware } from '../middleware/middlewareAuth';
import { Router } from 'express';
import { varcoController } from '../controllers/controllerVarco';

const routerVarco = Router();

routerVarco.get(
  '/',
  authMiddleware.verifyToken,
  varcoMiddleware.checkPermissionRead,
  varcoController.getAll,
);
routerVarco.get(
  '/:id',
  authMiddleware.verifyToken,
  varcoMiddleware.checkPermissionRead,
  varcoController.getById,
);
routerVarco.post(
  '/',
  authMiddleware.verifyToken,
  varcoMiddleware.checkPermissionWrite,
  varcoController.saveVarco,
);
routerVarco.delete(
  '/:id',
  authMiddleware.verifyToken,
  varcoMiddleware.checkPermissionWrite,
  varcoController.deleteById,
);
routerVarco.put(
  '/:id',
  authMiddleware.verifyToken,
  varcoMiddleware.checkPermissionWrite,
  varcoController.putVarco,
);
routerVarco.patch(
  '/:id',
  authMiddleware.verifyToken,
  varcoMiddleware.checkPermissionWrite,
  varcoController.patchVarco,
);

export default routerVarco;
