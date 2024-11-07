import { getContacts, getContactById, postContacts, patchContact, deleteContactById } from '../services/contacts.js'; //  логіка пошуку колекції
import createHttpError from "http-errors"
import { parsePaginationParams } from '../utils/parsePaginationParams.js';

import { sortByList } from '../db/models/Contact.js';
import { parseSortParams } from '../utils/parseSortParams.js';

export const getContactsController = async (req, res) => {
  // console.log(req.query);  //  значення query з параметрами sourch
  const { page, perPage } = parsePaginationParams(req.query); //  витягуємо параметри page та perPage
  // console.log(`page`, page); //  перевірка
  // console.log(`perPage`, perPage); //  перевірка

  const { sortBy, sortOrder } = parseSortParams(req.query, sortByList);
  // console.log(sortBy);  // перевірка
  // console.log(sortOrder);  // перевірка

  //  при створенні роутеру шлях `contacts` необхідно прибрати, т.я. він вказаний в server.js в мідлварі
  const data = await getContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
  }); //  якщо и try сталася помилка, то переходить на catch error

  res.json({
    stasus: 200,
    message: 'Successfull find contacts',
    data,
  });

  //  res.json({ massage: 'Hello hw-2' });  необхідно було для перевірки запуску сервера
};

export const getContactByIdController = async (req, res) => {
  const { id } = req.params;
//  console.log(`req.params`, req.params); //  зберігаються всі параметри маршрути в req.params
  
  const data = await getContactById(id);

    if (!data) {
      throw createHttpError(404, `Contact id= ${id} not found`);
    }

    res.json({
      stasus: 200,
      message: 'Contact successfull find',
      data: data,
    });
  
};

export const postContactController = async (req, res) => {
  // console.log(req.body)   // перевірка
  // const validateResult = contactPostSchema.validate(req.body)  //  отримання value об'єкту з полями вводу
  // console.log(validateResult);
  
  const data = await postContacts(req.body);
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data,
  });
}

export const patchContactController = async (req, res) => {

  const { id } = req.params;
  // console.log(contactId);
  try {
    const data = await patchContact(id, req.body);

    if (!data) {
      throw createHttpError(404, `Not found`);
    }
    res.json({
      status: 200,
      message: `Successfully patched a contact!`,
      data,
    });
  } catch (error) {
    const { status = 500, message = 'Something went wrong' } = error; // якщо помилка 500, то викидає помилку 500. Якщо прилітає 404, то зберігається 404
    res.status(status).json({
      status,
      message,
    });
  }
}

export const deleteContactByIdController = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await deleteContactById(id);

    // console.log(contactId);
    // console.log(data);

    if (!data) {
      throw createHttpError(404, `Contact id= ${id} not found`);
    }

    res.status(204).json();
  }
  catch (error) {
    const { status = 500, message = 'Something went wrong' } = error; //"" - лише такі // якщо помилка 500, то викидає помилку 500. Якщо прилітає 404, то зберігається 404
    res.status(status).json({
      status,
      message,
    });
  }
};

 
