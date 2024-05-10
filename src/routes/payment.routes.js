import { Router } from 'express';
import { createOrder, reciveWebhook, viewPlanes } from '../controller/payment.js'
import path from 'path';

const router = Router();
const __dirname = path.resolve(path.dirname(''));

router.get('/', (req, res) => { // ?root
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

router.get('/payment', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'checkout', 'checkout.html'));
});

router.get('/api/products', viewPlanes); // ?mostrar planes disponibles

router.post('/process_payment/:id', createOrder);

router.get('/succes', (req, res) => {
    res.send('succes');
}); // ! ehhhh verificare q anda mal, etc
router.get('/failure', (req, res) => {
    res.send('failure');
});

router.post('/webhook', reciveWebhook);

export default router