import { Router } from 'express';
import path from 'path';

const router = Router();
const __dirname = path.resolve(path.dirname(''));

router.get('/', (req, res) => { // ?root
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

export default router