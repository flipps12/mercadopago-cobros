import { Router } from 'express';
import { getWhitelist } from '../database/controller.js'
import path from 'path';

const router = Router();
const __dirname = path.resolve(path.dirname(''));

router.get('/', (req, res) => { // ?root
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

router.get('/api/whitelist', getWhitelist);

export default router