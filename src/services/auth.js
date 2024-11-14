import createHttpError from "http-errors";
import UserCollection from "../db/models/User.js"

export const registerContact = async (payload) => {
    const { email } = payload; // витягуємо email
    const emailUser = await UserCollection.findOne({ email });  // превіряємо на наявність даного enail в даній колекції
    // console.log(emailUser);
    if (emailUser) {
        throw createHttpError(409, 'Email in use');  // якщо є, то повертаємо 409 помилку
    }

  //  прилітає payload з body з данними реєстрації користувача
  return UserCollection.create(payload); //  реєстрація це додавання нового користувача
}