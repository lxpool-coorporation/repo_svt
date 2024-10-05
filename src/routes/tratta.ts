import { trattaMiddleware } from '../middleware/middlewareTratta';
import { authMiddleware } from '../middleware/middlewareAuth';
import { Router } from 'express';
import { trattaController } from '../controllers/controllerTratta';

const routerTratta = Router();

routerTratta.get(
  '/',
  authMiddleware.verifyToken,
  trattaMiddleware.checkPermissionRead,
  trattaController.getAll,
);
routerTratta.get(
  '/:id',
  authMiddleware.verifyToken,
  trattaMiddleware.checkPermissionRead,
  trattaController.getById,
);
routerTratta.post(
  '/',
  authMiddleware.verifyToken,
  trattaMiddleware.checkPermissionWrite,
  trattaController.saveTratta,
);
routerTratta.delete(
  '/:id',
  authMiddleware.verifyToken,
  trattaMiddleware.checkPermissionWrite,
  trattaController.deleteById,
);
routerTratta.put(
  '/:id',
  authMiddleware.verifyToken,
  trattaMiddleware.checkPermissionWrite,
  trattaController.putTratta,
);
routerTratta.patch(
  '/:id',
  authMiddleware.verifyToken,
  trattaMiddleware.checkPermissionWrite,
  trattaController.patchTratta,
);

export default routerTratta;
