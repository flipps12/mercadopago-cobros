import { Router } from 'express';
import path  from  'path';
import { createAccountPost, verifyAccountPost, apiProtected, viewPlan } from '../database/controller.js';
import jwt from 'jsonwebtoken';
import { JWT } from "../config.js";

const router = Router();
const __dirname = path.resolve(path.dirname(''));

const authMiddleware = (req, res, next) => {
    const token = req.cookies['jwt'];
    if (!token) {
      return res.status(403).send('Acceso denegado.');
    }
  
    try {
      const decoded = jwt.verify(token, JWT);
      req.user = decoded;
      next();
    } catch (ex) {
      res.status(400).send('Token inválido.');
    }
};

router.get('/register', (req, res)=>{
    res.sendFile(path.join(__dirname, 'public','sesion', 'singup.html'));
})

router.get('/login', (req, res)=>{
    res.sendFile(path.join(__dirname, 'public','sesion', 'login.html'));
})

// router.get('/ruta-protegida', authMiddleware, (req, res) => {
//     res.send('Acceso concedido a la información protegida.'); //! deprecated
// });

router.post('/api/register', createAccountPost)

router.post('/api/login', verifyAccountPost)

router.get('/api/protected', authMiddleware, apiProtected)

router.post('/api/compras', viewPlan); // ?mostrar planes comprados

export default router