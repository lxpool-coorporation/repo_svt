import { Router } from 'express';
import { authController } from '../controllers/authController';

const routerLogin = Router();

routerLogin.post('/', authController.login);

export default routerLogin;
