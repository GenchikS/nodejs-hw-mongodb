import bckrypt from 'bcrypt';
import createHttpError from 'http-errors';
import UserCollection from '../db/models/User.js';

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
  return UserCollection.create({ ...payload, password: hashPassword }); //  реєстрація це додавання нового користувача. Ключ password хешується
};


export const loginContact = async ({email, password}) => {
  const user = await UserCollection.findOne({ email }); //  перевірка чи є взагалі такий користувач в колекції
  if (!user) {
    throw createHttpError(401, 'Email or password invalid');
  }
  const passwordCompere = await bckrypt.compare(password, user.password); //  перевірка введеного паралю password з хешировонним. Якщо збігається, то повернеться true
  if (!passwordCompere) {
      throw createHttpError(401, 'Email or password invalid');
  }
  
  //   console.log('passwordCompere', passwordCompere);
  //   const passwordCompere2 = await bckrypt.compare('111111', user.password);
  // console.log('passwordCompere2', passwordCompere2);  //  false
}
