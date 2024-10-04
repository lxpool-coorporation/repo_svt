import { trattaMiddleware } from '../middleware/trattaMiddleware';
import { authMiddleware } from '../middleware/authMiddleware';
import { Router } from 'express';
import { trattaController } from '../controllers/trattaController';

const routerTratte = Router();

routerTratte.get(
  '/',
  authMiddleware.verifyToken,
  trattaMiddleware.checkPermissionRead,
  trattaController.getAll,
);
routerTratte.get(
  '/:id',
  authMiddleware.verifyToken,
  trattaMiddleware.checkPermissionRead,
  trattaController.getById,
);
routerTratte.post(
  '/',
  authMiddleware.verifyToken,
  trattaMiddleware.checkPermissionWrite,
  trattaController.saveTratta,
);
routerTratte.delete(
  '/:id',
  authMiddleware.verifyToken,
  trattaMiddleware.checkPermissionWrite,
  trattaController.deleteById,
);
routerTratte.put(
  '/:id',
  authMiddleware.verifyToken,
  trattaMiddleware.checkPermissionWrite,
  trattaController.putTratta,
);
routerTratte.patch(
  '/:id',
  authMiddleware.verifyToken,
  trattaMiddleware.checkPermissionWrite,
  trattaController.patchTratta,
);

export default routerTratte;
