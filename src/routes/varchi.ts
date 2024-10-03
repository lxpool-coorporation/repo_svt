import { varchiMiddleware } from '../middleware/varchiMiddleware';
import { authMiddleware } from '../middleware/authMiddleware';
import { Router } from 'express';
import { varchiController } from '../controllers/varchiController';

const routerVarchi = Router();

routerVarchi.get(
  '/',
  authMiddleware.verifyToken,
  varchiMiddleware.checkPermissionRead,
  varchiController.getAll,
);
routerVarchi.get(
  '/:id',
  authMiddleware.verifyToken,
  varchiMiddleware.checkPermissionRead,
  varchiController.getById,
);
routerVarchi.post(
  '/',
  authMiddleware.verifyToken,
  varchiMiddleware.checkPermissionWrite,
  varchiController.saveVarco,
);
routerVarchi.delete(
  '/:id',
  authMiddleware.verifyToken,
  varchiMiddleware.checkPermissionWrite,
  varchiController.deleteById,
);
routerVarchi.put(
  '/:id',
  authMiddleware.verifyToken,
  varchiMiddleware.checkPermissionWrite,
  varchiController.putVarco,
);
routerVarchi.patch(
  '/:id',
  authMiddleware.verifyToken,
  varchiMiddleware.checkPermissionWrite,
  varchiController.patchVarco,
);

export default routerVarchi;
