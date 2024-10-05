import { veicoloMiddleware } from '../middleware/middlewareVeicolo';
import { authMiddleware } from '../middleware/middlewareAuth';
import { Router } from 'express';
import { veicoloController } from '../controllers/controllerVeicolo';

const routerVeicolo = Router();

routerVeicolo.get(
  '/',
  authMiddleware.verifyToken,
  veicoloMiddleware.checkPermissionRead,
  veicoloController.getAll,
);
routerVeicolo.get(
  '/:id',
  authMiddleware.verifyToken,
  veicoloMiddleware.checkPermissionRead,
  veicoloController.getById,
);
routerVeicolo.post(
  '/',
  authMiddleware.verifyToken,
  veicoloMiddleware.checkPermissionWrite,
  veicoloController.saveVeicolo,
);
routerVeicolo.delete(
  '/:id',
  authMiddleware.verifyToken,
  veicoloMiddleware.checkPermissionWrite,
  veicoloController.deleteById,
);
routerVeicolo.put(
  '/:id',
  authMiddleware.verifyToken,
  veicoloMiddleware.checkPermissionWrite,
  veicoloController.putVeicolo,
);
routerVeicolo.patch(
  '/:id',
  authMiddleware.verifyToken,
  veicoloMiddleware.checkPermissionWrite,
  veicoloController.patchVeicolo,
);

export default routerVeicolo;
