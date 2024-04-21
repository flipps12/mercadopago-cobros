import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import { TOKEN, HOST, NOT } from '../config.js';
import { process_webhook } from '../database/controller.js';

export const createOrder = async (req, res) => {
    const client = new MercadoPagoConfig({ accessToken: TOKEN })
    const payment = new Payment(client);
    const preference = new Preference(client);
    const { body } = req;
    console.log(req.params);
    const products = [
        [
            {
                id: 0,
                title: 'Basic server',
                unit_price: 500,
                quantity: 1,
                currency_id: 'ARS',
            },
        ],
        [
            {
                id: 1,
                title: 'Advenca server',
                unit_price: 700,
                quantity: 1,
                currency_id: 'ARS',
            },
        ]
    ]
    if (Number(req.params.id) >= products.length) {
        console.log('id no encontrado')
        res.send('error')
    }
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
    console.log(bodyPayment.external_reference)
    const result = await preference.create({ body: bodyPayment }).catch(console.log);
    res.send(result);
}

export const reciveWebhook = async (req, res) => {
    const client = new MercadoPagoConfig({ accessToken: TOKEN })
    const payment = new Payment(client);
    const paymentQuery = req.query;
    if (paymentQuery.type === 'payment') {
        const result = await payment.search({
            qs: {
                id: paymentQuery['data.id']
            }
        });
        const lastResult = result.results[result.results.length - 1];
        if (lastResult.status !== 'approved') {
            res.send('error')
            return
        }
        process_webhook(lastResult)
    };
    res.sendStatus(200);
}