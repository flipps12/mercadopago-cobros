import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import { TOKEN, HOST, NOT, products, devMode } from '../config.js';
import { process_webhook } from '../database/controller.js';
import { ejecutar } from '../rcon/connection.js';

export const createOrder = async (req, res) => {
    const client = new MercadoPagoConfig({ accessToken: TOKEN })
    const payment = new Payment(client);
    const preference = new Preference(client);
    var { body } = req;
    
    if (Number(req.params.id) >= products.length) {
        console.log('id no encontrado');
        res.send('error');
    };
    const item = products[Number(req.params.id)];

    let bodyPayment = {
        items: item,
        back_urls: {
            succes: `${HOST}/succes`,
            failure: `${HOST}/failure`,
        },
        notification_url: `${NOT}/webhook`,
        external_reference: `${body.nickname},${products[req.params.id][0].title}`, // ? mandar el producto, para uso futuro 
    };
    //console.log(products[req.params.id][0].title)
    const result = await preference.create({ body: bodyPayment }).catch(console.log);
    if (devMode) ejecutar('say DevMode: createOder()')
    res.send(result);
};

export const reciveWebhook = async (req, res) => {
    const client = new MercadoPagoConfig({ accessToken: TOKEN });
    const payment = new Payment(client);
    const paymentQuery = req.query;
    try {
        const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentQuery.id}`, {
            headers: {
                'Authorization': `Bearer ${client.accessToken}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            if (data.status === 'approved') {
                process_webhook(data);
                console.log(data.status, data.external_reference);
            };
        };

        //if (devMode) ejecutar('say DevMode: reciveWebhook()')

        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    };
};

export const viewPlanes = (req, res) => {
    res.send(products);
};