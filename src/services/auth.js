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
import {env} from "../utils/env.js"



const emailTemplatePath = path.join(TEMPLATE_DIR, "verify-email.html");  //  прописуємо шлях до папки шаблону
// console.log(emailTemplatePath)  //  перевірка шляху
// console.log(randomBytes(30).toString("base64"));  //  приклад створення рандомних символів та перетворення їх в строку з кодувавнням "base64"

const appDomain = env("APP_DOMAIN");  //  створення змінної оточення  (appDomain адреса нашого бекенду)


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

  const templatesSourse = await fs.readFile(emailTemplatePath, 'utf-8'); //  читання шляху до html тексту
  const template = Handlebars.compile(templatesSourse); //  передаємо текст, створюємо Handlebars об'єкт template

  //  для отримання html змісту, перетворюємо шаблон на html та підставляємо правельні зменні
  const html = template({
    link: `${appDomain}/auth/verify?token=`, //  має бути одреса проекту та додавання токену для розпізнання
  });

  const verifyEmail = {
    to: email,
    subject: 'Verify email',
    // html: "<a>Click</a>"  //  можна використати тег
    html,  //  передаємо зміст створенного листа
  };
  await sendEmail(verifyEmail); //  відправка листа
  return newUser;
};


export const loginContact = async ({email, password}) => {
  const user = await UserCollection.findOne({ email }); //  перевірка чи є взагалі такий користувач в колекції
  if (!user) {
    throw createHttpError(401, 'Email or password invalid');
  }
  if (!user.verify) {  // додаємо перевірку, якщо email не підтвержений
    throw createHttpError(401, 'Email not verified');
  }
  const passwordCompere = bckrypt.compare(password, user.password); //  перевірка введеного паралю password з хешировонним. Якщо збігається, то повернеться true
  if (!passwordCompere) {
      throw createHttpError(401, 'Email or password invalid');
  }
  
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


export const logout = sessionId => SessionCollection.deleteOne({ _id: sessionId });  //  просто видаляємо сесію
export const findSession = filter => SessionCollection.findOne(filter);  //  ф-ція перевірки токена чи є дана сесія
export const findUser = filter => SessionCollection.findOne(filter);  //  ф-ція перевірки чи є ще user який відповідає данній сесії

