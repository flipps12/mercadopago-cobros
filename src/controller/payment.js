import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import { TOKEN, HOST, NOT } from '../config.js';
import { process_webhook } from '../database/controller.js';

export const createOrder = async (req, res) => {
    const client = new MercadoPagoConfig({ accessToken: TOKEN })
    const payment = new Payment(client);
    const preference = new Preference(client);
    var { body } = req;
    const products = [
        [
            {
                id: 0,
                title: 'basic server',
                unit_price: 500,
                quantity: 1,
                currency_id: 'ARS',
            },
        ],
        [
            {
                id: 1,
                title: 'advenca server',
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
    //console.log('payment.js', bodyPayment.external_reference, body.nickname)
    const result = await preference.create({ body: bodyPayment }).catch(console.log);
    res.send(result);
}

// export const reciveWebhookDeprecated = async (req, res) => {
//     const client = new MercadoPagoConfig({ accessToken: TOKEN })
//     const payment = new Payment(client);
//     const paymentQuery = req.query;
//     if (paymentQuery.type === 'payment') {
//         const result = await payment.search({
//             qs: {
//                 id: paymentQuery['data.id']
//             }
//         });
//         const lastResult = result.results[result.results.length - 1];
//         if (lastResult.status !== 'approved') {
//             res.send('error')
//             return
//         }
//         process_webhook(lastResult);
//         // console.log(paymentQuery)
//         console.log(paymentQuery)
//         res.sendStatus(204)
//     };
//     //res.sendStatus(200);
// }
export const reciveWebhook = async (req, res) => {
    const client = new MercadoPagoConfig({ accessToken: TOKEN })
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
                process_webhook(data)
                console.log(data.status)
            }
        }

        res.sendStatus(200)
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
}