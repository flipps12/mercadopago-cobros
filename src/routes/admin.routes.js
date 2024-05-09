import { Router } from 'express';
import { getWhitelist } from '../database/controller.js'
import { authMiddleware } from './sesion.routes.js';
import path from 'path';

const router = Router();
const __dirname = path.resolve(path.dirname(''));


// TODO: Crear rutas para admins como: mirar la base de datos, modificar y cosas asi
//! en la apiProtected agregar para que puedan estar mas de un admin :)

router.get('/admin', authMiddleware, (req, res) => {
    console.log(req.user.isAdmin ? 'hola' : 'no hola')
    console.log(req.user.isAdmin)
    if (!req.user.isAdmin) {
        res.send('No sos un admin, raja de aca');
        return
    };
    res.send('sos admin')
});

// ! post() ejecutar comandos en el servidor como administrador (Seguridad alta)

// ! get() Mirar lista de jugfadores conectados, en whitelist, pagos, etc

export default router