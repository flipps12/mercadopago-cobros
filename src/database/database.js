import postgres from 'postgres';
import bcrypt from 'bcryptjs';
import { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } from '../config.js';


const encrypt = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        reject(err);
      } else {
        resolve(hash);
      }
    });
  });
};

const compare = (password, encryptedPassword) => {
  return new Promise((resoleve, reject) => {
    bcrypt.compare(password, encryptedPassword, function (err, isMatch) {
      if (err) {
        reject(error);
      } else if (isMatch) {
        resoleve(true)
      } else {
        resoleve(false)
      }
    });
  })
}

const sql = postgres({
  host: PGHOST,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: 'require',
  connection: {
    options: `project=${ENDPOINT_ID}`,
  },
});


export const createAccount = async (user, password, nickname) => {
  try {
    const checkName = await sql`SELECT COUNT(*) as count FROM usuarios WHERE usuario = ${user};`;

    if (checkName[0].count > 0) {
      return { status: 'registered' }; // El usuario ya existe
    }
    const result = await sql`INSERT INTO usuarios (usuario, contraseña, nickname) VALUES (${user}, ${await encrypt(password)}, ${nickname});`;
    return { status: true };
  } catch (error) {
    console.log(error)
    return { status: 'error' }
  }
};

export const verifyAccount = async (user, password) => {
  try {
    const checkName = await sql`SELECT * FROM usuarios WHERE usuario = ${user};`;
    if (checkName[0] == undefined) return { status: 'user undefined' }
    const passwordCompare = await compare(password, checkName[0].contraseña)
    if (!passwordCompare) return { status: 'password undefined' }
    return { status: true, data: checkName[0] };
  } catch (error) {
    console.log(error)
    return { status: 'error' }
  }
}

export const alterTable = async (ip, email, nickname, identification, plan) => { 
  try {
    const checkName = await sql`SELECT plan FROM usuarios WHERE nickname = ${nickname};`;

    const fechaActual = new Date();
    var i = 0;
    var expi = 0;
    if (checkName[0].plan !== null) {
      while (checkName[0].plan[i] !== undefined) {
        expi = checkName[0].plan[i].exp
        //newPlan += { i: checkName[0].plan[i] }
        i++

      }
      if (checkName[0].plan[i] == undefined && i >= 1) {
        var date = new Date(expi)
        checkName[0].plan[i] = { exp: fechaActual.setMonth(date.getMonth() + 1), plan }
        newPlan = checkName[0].plan

      }
    } else {
      var newPlan = {
        0: {
          exp: fechaActual.setMonth(fechaActual.getMonth() + 1),
          plan
        }
      }
    }


    const result = await sql`UPDATE usuarios SET ip = ${ip}, email = ${email}, identificacion = ${identification}, plan = ${newPlan} WHERE nickname = ${nickname} ;`;

    return { status: true };
  } catch (error) {
    console.log(error)
    return { status: 'error' }
  }
};
