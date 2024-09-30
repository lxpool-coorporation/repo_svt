import { Router } from 'express';
import { authController } from '../controller/authController';

const routerLogin = Router();

routerLogin.post('/', authController.login);

export default routerLogin;
