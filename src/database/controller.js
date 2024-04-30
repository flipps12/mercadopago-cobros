import { createAccount, verifyAccount, alterTable, viewPlanDB, viewPlansDB } from "./database.js";
import jwt from 'jsonwebtoken';
import { JWT } from "../config.js";
import { viewWhiteList, addUserWhiteList, deleteUserWhiteList } from "../rcon/connection.js";


const verifyAllAccounts = async () => {
    const fecha = new Date();
    console.log(fecha)
    const planes = await viewPlansDB();
    var plan, plan2 = 0;
    for (plan in planes) {
        var ult = Object.keys(planes[plan].plan).length - 1
        console.log(planes[plan].plan[ult]);
        var nickname = planes[plan].nickname;
        var fechaExp = new Date(planes[plan].plan[ult].exp);
        var resultPlan = planes[plan].plan[ult].plan;
        if (fecha < fechaExp) {
            addUserWhiteList(nickname)
            // ! para proxima // addUserWhiteList(nickname, resultPlan)
            console.log(resultPlan)
        } else {
            deleteUserWhiteList(nickname)
        }
    };

    //console.log(planes);
};
verifyAllAccounts() //TODO seguir con la funcionalidad

// ? exports

export const getWhitelist = async (req, res) => { // ?mostrar en la web los usuarios en la whitelsit
    res.send(await viewWhiteList())
}

export const process_webhook = async (result) => {
    console.log('poruebas')
    const { description, additional_info, external_reference, payer } = result
    const ip = additional_info.ip_address;
    const email = payer.email;
    const dni = payer.identification.number;

    const status = alterTable(ip, email, external_reference, dni, description);
    console.log(await status, external_reference)
    if (await status) {
        const addWhitelistResult = addUserWhiteList(external_reference);
        console.log(await addWhitelistResult);
    } else {
        console.log('hubo un error');
    }
}

// cuentas 
export const createAccountPost = async (req, res) => {
    const regex = /[^a-zA-Z0-9]/;
    const { user, password, nickname } = req.body;
    if ((!regex.test(password) && !regex.test(user)) && (user.length >= 4 && password.length >= 4) && nickname.length >= 2) {
        const result = createAccount(user, password, nickname);
        res.send(await result)
    } else {
        res.send({ status: 'string error' })
    }
};

export const verifyAccountPost = async (req, res) => {
    const regex = /[^a-zA-Z0-9]/;
    const { user, password } = req.body;
    if ((!regex.test(password) && !regex.test(user)) && (user.length >= 4 && password.length >= 4)) {
        const result = await verifyAccount(user, password);

        if (!result.data) {
            res.send({ status: result.status })
            return
        }
        const token = jwt.sign({ id: result.data.id, usuario: result.data.usuario, nickname: result.data.nickname }, JWT, { expiresIn: '400d' });
        res.cookie('jwt', token, { httpOnly: true, maxAge: 3 * 30 * 24 * 60 * 60 * 100000 });
        res.send(await result)
    } else {
        res.send({ status: 'string error' })
    }
}

export const viewPlan = async (req, res) => {
    const { nickname } = req.body;
    console.log(nickname);
    res.send({ data: await viewPlanDB(nickname) });
};

export const apiProtected = (req, res) => {
    res.send(req.user);
};