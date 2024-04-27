import { createAccount, verifyAccount, alterTable, viewPlanDB } from "./database.js";
import jwt from 'jsonwebtoken';
import { JWT } from "../config.js";
import { refreshWhiteList } from "../rcon/connection.js";


export const process_webhook = async (result) => {
    //console.log(result)
    const { description, additional_info, external_reference, payer } = result
    const ip = additional_info.ip_address;
    const email = payer.email;
    const dni = payer.identification.number;
    
    console.log(await alterTable(ip, email, external_reference, dni, description));
    refreshWhiteList(external_reference);
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
            res.send({ status: result.status})
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
    res.send({ data: await viewPlanDB(nickname)});
};

export const apiProtected = (req, res) => {
    res.send(req.user);
};