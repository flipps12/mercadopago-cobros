import { Rcon } from "rcon-client";
import { portMC, hostMC, passwordMC } from "../config.js";

export const ejecutar = async (comand) => { // ?Ejecutar comando por rcon
    try {
        const client = await Rcon.connect({
            host: hostMC,
            port: portMC,
            password: passwordMC
        });
        const result = await client.send(comand);
        client.end();
        return result;
    } catch (error) {
        console.error(error);
    };
};

export const viewWhiteList = async (data) => {
    return await ejecutar('whitelist list');
};

export const addUserWhiteList = async (nickname) => { // ! agregar seguridad adicional, no quiero ratones
    ejecutar(`say ${nickname} a comprado un mes en este server.`);
    return await ejecutar(`whitelist add ${nickname}`);
};

export const deleteUserWhiteList = async (nickname) => { // ! capaz algo de seguridad va, ( se prefiere que puedan explotar esta funcion a que otras )
    ejecutar(`say ${nickname} no pago, adios.`);
    ejecutar(`kick ${nickname}`); //? por si esta conectado
    return await ejecutar(`whitelist remove ${nickname}`);
};

// export const verifyWhiteList = async () => {
//     //
// }