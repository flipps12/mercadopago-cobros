import { Router } from 'express';
import path from 'path';
import { createAccountPost, verifyAccountPost, apiProtected, viewPlan } from '../database/controller.js';
import { ejecutar } from '../rcon/connection.js';
import jwt from 'jsonwebtoken';
import { JWT } from "../config.js";

const router = Router();
const __dirname = path.resolve(path.dirname(''));

export const authMiddleware = (req, res, next) => {
  const token = req.cookies['jwt'];
  if (!token) {
    return res.status(403).send('Acceso denegado.');
  }

  try {
    const decoded = jwt.verify(token, JWT);
    req.user = decoded;
    req.user.isAdmin = false;
    if (req.user.usuario === 'Flipps12' && req.user.nickname === 'Flipps12') req.user.isAdmin = true
    next();
  } catch (ex) {
    res.status(400).send('Token inválido.');
  }
};

router.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'sesion', 'singup.html'));
})

router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'sesion', 'login.html'));
})

router.get('/api/dataplayer', authMiddleware, async (req, res) => {
  const { nickname } = req.user;
  const list = await ejecutar('list');
  const players = list.split(': ')[1].split(', ');
  const whitelist = await ejecutar('whitelist list');
  const playersWhitelist = whitelist.split(': ')[1].split(', ');
  res.send([players.includes(nickname), playersWhitelist.includes(nickname)]);
})

router.post('/api/register', createAccountPost)

router.post('/api/login', verifyAccountPost)

router.get('/api/protected', authMiddleware, apiProtected)

router.post('/api/compras', viewPlan); // ?mostrar planes comprados

export default router