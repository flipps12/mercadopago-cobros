import { config } from 'dotenv';
config();

export const PORT = process.env.PORT || 3000;
export const HOST = process.env.HOST;
export const TOKEN = process.env.ACCESS_TOKEN;
export const NOT = process.env.NOT;
export const JWT = process.env.JWT;
export const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;

export const hostMC = process.env.ip;
export const passwordMC = process.env.password;
export const portMC = 25575;

export const products = [
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
            title: 'Proximamente',
            unit_price: 700,
            quantity: 1,
            currency_id: 'ARS',
        },
    ]
];

// !dev options
export const devMode = process.env.DEVMODE

// !admin options
export const admins = ['Flipps12']