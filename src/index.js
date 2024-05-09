import express from 'express';
import morgan from 'morgan';
import paymentRouter from './routes/payment.routes.js' 
import sesionRouter from './routes/sesion.routes.js' 
import indexRouter from './routes/index.routes.js' 
import adminRouter from './routes/admin.routes.js'
import { PORT } from './config.js'
import path  from  'path';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';


const app = express();
const __dirname = path.resolve(path.dirname(''));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(paymentRouter);
app.use(sesionRouter);
app.use(indexRouter);
app.use(adminRouter)

app.listen(PORT,()=>{
    console.log('Server on port: ', PORT);
});

//! quien fue el pelotudo que hizo este codigo?
//? vos
//! que buen codigo lpm