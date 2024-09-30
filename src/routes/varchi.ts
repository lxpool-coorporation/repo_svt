import { Router } from 'express';

const routerVarchi = Router();

routerVarchi.get('/:id', function (req, res, _next) {
  const id = parseInt(req.params.id);
  res.send('respond with a [' + String(id) + ']');
  res.status(200).json({});
});
/*
routerVarchi.post('/');
routerVarchi.delete('/:id');
routerVarchi.update('/:id');
routerVarchi.patch('/:id');
*/
export default routerVarchi;
