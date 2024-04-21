import { createAccount } from "./database.js"

export const process_webhook = (result)=>{
    console.log(result)
    console.log('test')
    //guardar en base de datos y mandar por rcon
}

// cuentas 
export const createAccountPost = async (req, res)=>{
    console.log(req.body)
    const regex = /[^a-zA-Z0-9]/;
    const { user, password } = req.body;
    if ((!regex.test(password) && !regex.test(user)) && (user.length >= 4 && password.length >= 4)){
        const result = createAccount(user, password);
        res.send(await result)
    } else {
        res.send({ status: 'string error'})
    }
};
