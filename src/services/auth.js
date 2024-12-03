import bckrypt from 'bcrypt';
import createHttpError from 'http-errors';
import UserCollection from '../db/models/User.js';
import SessionCollection from '../db/models/Session.js';
import { randomBytes } from "crypto";  //  ф-ція створення рандомних символів
import { accessTokenLifeTime, refreshTokenLifeTime } from '../constants/authUsers.js';
import { sendEmail } from '../utils/sendEmail.js';
import * as path from "node:path";
import { TEMPLATE_DIR } from '../constants/index.js';
import * as fs from "node:fs/promises";  //  необхідно для прочитання змісту файлу
import Handlebars from 'handlebars';
import { env } from "../utils/env.js"
import jwt from "jsonwebtoken";

// const emailTemplatePath = path.join(TEMPLATE_DIR, "verify-email.html");  //  прописуємо шлях до папки шаблону
// console.log(emailTemplatePath)  //  перевірка шляху
// console.log(randomBytes(30).toString("base64"));  //  приклад створення рандомних символів та перетворення їх в строку з кодувавнням "base64"
const ressetEmailTemplatePath = path.join(TEMPLATE_DIR, 'reset-password.html');



const appDomain = env("APP_DOMAIN");  //  створення змінної оточення  (appDomain адреса нашого бекенду)
const jwtSecret = env('JWT_SECRET');  //  читаємо JWT
// const smtpFrom = env("SMTP_FROM");


//  винесли окремо ф-цію створення нових токенів, т.я. використовується повторно
const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');
  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: Date.now() + accessTokenLifeTime, //  час зараз + 15 хв життя токену
    refreshTokenValidUntil: Date.now() + refreshTokenLifeTime,
  };
}


export const registerContact = async (payload) => {
  const { email, password } = payload; // витягуємо email
  const emailUser = await UserCollection.findOne({ email }); // превіряємо на наявність даного enail в даній колекції
  // console.log(emailUser);
  if (emailUser) {
    throw createHttpError(409, 'Email in use'); // якщо є, то повертаємо 409 помилку
  }

  // const salt = await bckrypt.genSalt(10)  //  метод хешування зі складністю 10
  // console.log("salt", salt); //  перевірка випадкової генерації
  const hashPassword = await bckrypt.hash(password, 10);
  //  приклад хешування
  // console.log('hashPassword', hashPassword); //  перевірка паролю з salt

  //  прилітає payload з body з данними реєстрації користувача
  const newUser = await UserCollection.create({
    ...payload,
    password: hashPassword,
  }); //  реєстрація це додавання нового користувача до бази. Ключ password хешується

  // const templatesSourse = await fs.readFile(emailTemplatePath, 'utf-8'); //  читання шляху до html тексту та перетворення в utf-8
  // const template = Handlebars.compile(templatesSourse); //  передаємо текст, створюємо Handlebars об'єкт template

  // const token = jwt.sign({ email }, jwtSecret, { expiresIn: '5m' }); //  створюємо токен. Час життя 5хв
  // console.log('token', token);
  // const decodeToken = jwt.decode(token)
  // console.log('decodeToken', decodeToken);

  //  для отримання html змісту, перетворюємо шаблон на html та підставляємо правельні зменні
//   const html = template({
//     link: `${appDomain}/auth/verify?token=${token}`, //  має бути одреса проекту та додавання токену для розпізнання
//   });
// // console.log('html', html);

//   const verifyEmail = {
//     to: email,
//     subject: 'Verify email',
//     //   // html: "<a>Click</a>"  //  можна використати тег
//     html, //  передаємо зміст створенного листа
//   };

  // await sendEmail(verifyEmail); //  відправка листа
  // console.log('verifyEmail', verifyEmail);
  return newUser;
};


// робимо перевірку валідності токену та реєстрацію verify: true
// export const verify = async token => {
//   try {
//     const { email } = jwt.verify(token, jwtSecret); //  якщо співпадає, токен правельний, не закінчилася дія, то повертається email з юзером
//     const user = await UserCollection.findOne({ email }); // знаходимо користувача з таким email
//     // console.log(`user`, user);
//     if (!user) {
//       throw createHttpError(404, `${email} not found`);
//     }
//     return await UserCollection.findByIdAndUpdate(user._id, { verify: true }); //  якщо знаходимо email, то змінюємо verify: true юзера
//     } catch (error) {
//     throw createHttpError(401, error.message);
//   }
// }


export const loginContact = async ({email, password}) => {
  const user = await UserCollection.findOne({ email }); //  перевірка чи є взагалі такий користувач в колекції
  if (!user) {
    throw createHttpError(401, 'Email or password invalid');
  }

  // if (!user.verify) {  // додаємо перевірку, якщо email не підтвержений
  //   throw createHttpError(401, 'Email not verified');
  // }

  const passwordCompere = await bckrypt.compare(password, user.password); //  перевірка введеного паралю password з хешировонним. Якщо збігається, то повернеться true
  if (!passwordCompere) {
      throw createHttpError(401, 'Email or password invalid');
  }
// console.log(`passwordCompere`, passwordCompere);

  //   console.log('passwordCompere', passwordCompere);
  //   const passwordCompere2 = await bckrypt.compare('111111', user.password);
  // console.log('passwordCompere2', passwordCompere2);  //  false

   await SessionCollection.deleteOne({userId: user._id})  //  про всяк випадок видаляємо стару сессію, якщо можливо була

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return SessionCollection.create({  //  повернення відповіді в контроллер
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: Date.now() + accessTokenLifeTime,  //  час зараз + 15 хв життя токену
    refreshTokenValidUntil: Date.now() + refreshTokenLifeTime,
  })

}

export const refreshUserSession = async ({sessionId, refreshToken}) => {
  const session = await SessionCollection.findOne({ _id: sessionId, refreshToken });  //  перевірка чи є така сесія
  if (!session) {
    throw createHttpError(401, ` Session not found!`);  //  якщо сесії немає викидуємо помилку
  }
  if (Date.now > refreshTokenLifeTime) {
    throw createHttpError(401, ` Session token expired!`); //  якщо час refreshTokenLifeTime сплив, то викидаємо помилку
  }


  await SessionCollection.deleteOne({ _id: session._id }); //  про всяк випадок видаляємо стару сессію, якщо можливо була

  const newSession = createSession();

  return SessionCollection.create({
    //  повернення відповіді в контроллер
    userId: session.userId,
    ...newSession,
  });
}

export const ressetEmail = async (payload) => {
  
  try {
    const { email } = payload;
    const user = await UserCollection.findOne( {email} );
    // console.log('user', user);
    if (!user) {
      throw createHttpError(404, `${email} not found`);
    }

    const templatesSourse = await fs.readFile(ressetEmailTemplatePath, `utf-8`);
    const tamplate = Handlebars.compile(templatesSourse);

    const token = jwt.sign({ email }, jwtSecret, { expiresIn: `5m` });
    // console.log(`token`, token);

    const html = tamplate({
      link: `${appDomain}/reset-password?token=${token}`,
    });

    // console.log('html', html);

    const ressetPassword = {
      to: email,
      subject: 'Resset password email',
      html, //  передаємо зміст створенного листа
    };

    await sendEmail(ressetPassword);
    return;

  } catch (error) {
    throw createHttpError(
      500,
      `Failed to send the email, please try again later.`,
    );
  }
};


export const registerNewPassword = async (payload) => {
  // console.log(`payload`, payload);
  const { token, password } = payload;
  let entries;
  // console.log(`token`, token);
  // console.log(`password`, password);
  try {
    entries = jwt.verify(token, jwtSecret);

  } catch (error) {
    if (error instanceof Error) throw createHttpError(401, error.message);
    throw error;
  }

  console.log(`entries.email`, entries.email);


  const user = await UserCollection.findOne({
    email: entries.email,
  });
  console.log(`user`, user);

  if (!user) {
    throw createHttpError(404, `${entries.email} not found`);
  }
  const hashPassword = await bckrypt.hash(password, 10);

  //  зміна пароля та оновлення існуючого контакту
  const newUser = await UserCollection.updateOne(
    { _id: user._id },
    { password: hashPassword },
  );

  console.log(`newUser`, newUser);
  console.log(`password`, password);

  return newUser;
}

export const logout = sessionId => SessionCollection.deleteOne({ _id: sessionId });  //  просто видаляємо сесію
export const findSession = filter => SessionCollection.findOne(filter);  //  ф-ція перевірки токена чи є дана сесія
export const findUser = filter => SessionCollection.findOne(filter);  //  ф-ція перевірки чи є ще user який відповідає данній сесії

