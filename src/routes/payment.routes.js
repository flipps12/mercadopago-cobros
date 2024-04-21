import { Router } from 'express';
import { createOrder, reciveWebhook } from '../controller/payment.js'
import path  from  'path';
import { createAccountPost } from '../database/controller.js';


const router = Router();
const __dirname = path.resolve(path.dirname(''));

router.get('/payment', (req, res)=>{
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

router.post('/process_payment/:id', createOrder)

router.get('/succes', (req, res)=>{
    res.send('succes')
})
router.get('/failure', (req, res)=>{
    res.send('failure')
})

router.post('/webhook', reciveWebhook)

// sesiones

router.get('/register', (req, res)=>{
    res.sendFile(path.join(__dirname, 'public','sesion', 'singup.html'));
})

router.post('/register', createAccountPost)
export default router