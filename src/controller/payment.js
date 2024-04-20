import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import { TOKEN, HOST, NOT } from '../config.js';
export const createOrder = async (req, res) => {
    const client = new MercadoPagoConfig({ accessToken: TOKEN })
    const payment = new Payment(client);
    const preference = new Preference(client);
    const { body } = req;

    let bodyPayment = {
        items: [
            {
                id: 1,
                title: 'Mi producto',
                unit_price: 100,
                quantity: 1,
                currency_id: 'ARS',
            },
        ],
        back_urls: {
            succes: `${HOST}/succes`,
            failure: `${HOST}/failure`,
        },
        notification_url: NOT
    };
    const result = await preference.create({ body: bodyPayment }).catch(console.log);
    res.send(result);
}

export const reciveWebhook = async (req, res)=>{
    const client = new MercadoPagoConfig({ accessToken: "TEST-6807799766722147-041921-9e0b3bfa9a1be6e3212d59b103facfc7-1776851569" })
    const payment = new Payment(client);
    const paymentQuery = req.query;
    if (paymentQuery.type === 'payment'){
        const result = await payment.search({
            qs: {
              id: paymentQuery['data.id']
            }
          });
        console.log(result.results[0]);
    };
    res.send('wwebhook');
}