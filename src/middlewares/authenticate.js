import createHttpError from "http-errors";
import { findSession, findUser } from "../services/auth.js";

export const authenticate = async (req, res, next) => {
  // const { authorizatoin } = req.headers;  // отримання заголовка для перевірки на токен
  const authHeader = req.get('Authorization'); //  можна виконати ще тамим способом
  // console.log('authHeader', authHeader);  //  перевірка заголовка
  if (!authHeader) {
    return next(createHttpError(401, 'Authrization header missing')); // перевірка, якщо не прийде хедер, то викидуємо помилку
  }
  const [bearer, token] = authHeader.split(' '); //  викликаємо метод split, розділення " " ділить масив на 0 та 1 елемент
  if (bearer !== 'Bearer') {
    return next(
      createHttpError(401, 'Authrization header must be type Bearer!'),
    ); //  якщо перше слово не Bearer, то викидаємо помилку
  }

  const session = await findSession({ accessToken: token });
  if (!session) {
    //  перевірка на наявність активної сесії
    return next(createHttpError(401, 'Session not found!'));
  }
  //  перевірка такена на час. Якщо токен просрочений, то викидаємо помилку, що токен недійсний
  if (Date.now() > session.accessTokenValidUntil) {
    return next(createHttpError(401, 'Access token expired!'));
    }
    

  const user = await findUser({ _id: session }); //  перевірка на наявність активного user по id
    if (!user) {
      //  перевірка на наявність активного user
      return next(createHttpError(401, 'User not found!'));
    }
    //  об'єкт req.user це один об'єкт на весь проект та всі мідлвари 
    req.user = user;  //  для фіксації хто додав contact необхідно витягнути id залогіненого user/ передача всієї інформації в req.user
    next();  //  якщо пройдені всі перевірки, то йдемо далі

}