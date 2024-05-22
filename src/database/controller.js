import { createAccount, verifyAccount, alterTable, viewPlanDB, viewPlansDB } from "./database.js";
import jwt from 'jsonwebtoken';
import { JWT, devMode } from "../config.js";
import { ejecutar, viewWhiteList, addUserWhiteList, deleteUserWhiteList } from "../rcon/connection.js";


const verifyAllAccounts = async () => {
    try {
        //ejecutar('say Actulizando Whitelist...');
        console.log('verificando whitelist')
        const fecha = new Date();
        var users = [];
        const whitelistUsersResult = await viewWhiteList();
        if (whitelistUsersResult == undefined) return
        const whitelistUsers = whitelistUsersResult.split(': ')[1].split(', ');
        //ejecutar(`say devmode ${whitelistUsersResult}`)
        const planes = await viewPlansDB();
        var plan, plan2 = 0;
        for (plan in planes) {
            var ult = Object.keys(planes[plan].plan).length - 1
            console.log(planes[plan].plan[ult]);
            var nickname = planes[plan].nickname;
            var fechaExp = new Date(planes[plan].plan[ult].exp);
            var resultPlan = planes[plan].plan[ult].plan;
            if (fecha < fechaExp) {
                users[plan] = nickname;
                // ! para proxima // addUserWhiteList(nickname, resultPlan)
                console.log(resultPlan);
            } else {
                deleteUserWhiteList(nickname);
            }
        };
        var fueraDeWhitelist = users.filter(element => !whitelistUsers.includes(element)); // ? Usuarios con plan pagado pero fuera de whitelist
        var dentroDeWhitelist = whitelistUsers.filter(element => !users.includes(element)); // ! Estos usuarios, no pagaron pero esta dentro de la whitelist. (utilizando bugs)
        //dentroDeWhitelist.some(element => deleteUserWhiteList(element));
        //fueraDeWhitelist.some(element => addUserWhiteList(element));
        console.log(fueraDeWhitelist, dentroDeWhitelist)
    } catch (error) {
        ejecutar(`say ERROR Actulizando Whitelist, alertar al staff. ${error}`);
        console.error(error);
    };
};

// ? exports

export const getWhitelist = async (req, res) => { // ?mostrar en la web los usuarios en la whitelsit
    res.send(await viewWhiteList())
}

export const process_webhook = async (result) => {
    const { description, additional_info, external_reference, payer } = result
    const ip = additional_info.ip_address;
    const email = payer.email;
    const dni = payer.identification.number;

    try {
        const status = alterTable(ip, email, external_reference.split(','), dni, description);
        console.log(await status)
        //if (devMode) ejecutar('say DevMode: process_webhook()')
        if (await status) {
            console.log(external_reference.split(','))
            const addWhitelistResult = addUserWhiteList(external_reference.split(',')[0]);
            console.log(await addWhitelistResult);
        } else {
            console.log('hubo un error');
        }
    } catch (error) {
        ejecutar('say hubo un error en "process_webhook"')
        console.error('process_webhook', error)
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
    res.send(req.user)
};



setInterval(verifyAllAccounts,4 * 30 * 60 * 1000); // Verificar Whitelsit cada 1 horas
//verifyAllAccounts();// 
