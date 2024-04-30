import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import { TOKEN, HOST, NOT, products } from '../config.js';
import { process_webhook } from '../database/controller.js';

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
        external_reference: body.nickname,
    };
    //console.log('payment.js', bodyPayment.external_reference, body.nickname)
    const result = await preference.create({ body: bodyPayment }).catch(console.log);
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

        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    };
};

export const viewPlanes = (req, res) => {
    res.send(products);
};