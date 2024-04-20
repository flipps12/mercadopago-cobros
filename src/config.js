import { config } from 'dotenv';
config()

export const PORT = process.env.PORT || 3000;
export const HOST = process.env.HOST
export const TOKEN = process.env.ACCESS_TOKEN
export const NOT = process.env.NOT