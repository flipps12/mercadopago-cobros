import express from 'express';
import morgan from 'morgan';
import paymentRouter from './routes/payment.routes.js' 
import { PORT } from './config.js'
import path  from  'path';
import bodyParser from 'body-parser';

const app = express();
const __dirname = path.resolve(path.dirname(''));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'))
app.use(paymentRouter);
app.use(express.static(path.join(__dirname, '../', 'public')));

app.listen(PORT,()=>{
    console.log('Server on port: ', PORT);
});