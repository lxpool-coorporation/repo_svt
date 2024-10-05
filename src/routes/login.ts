import { Router } from 'express';
import { controllerAuth } from '../controllers/controllerAuth';

const routerLogin = Router();

routerLogin.post('/', controllerAuth.login);

export default routerLogin;
