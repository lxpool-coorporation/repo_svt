import { Router } from 'express';
import { authController } from '../controllers/controllerAuth';

const routerLogin = Router();

routerLogin.post('/', authController.login);

export default routerLogin;
