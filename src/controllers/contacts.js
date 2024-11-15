import { getContacts, getContactById, postContacts, patchContact, deleteContactById } from '../services/contacts.js'; //  логіка пошуку колекції
import createHttpError from 'http-errors';
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

  //  приклад використання фільтру
  const filter = parsePaginationParams(req.query);
  // console.log(`filter`, filter);
  const { _id: userId } = req.user;
  filter.userId = userId;
  
  //  при створенні роутеру шлях `contacts` необхідно прибрати, т.я. він вказаний в server.js в мідлварі
  const data = await getContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });
  res.json({
    stasus: 200,
    message: 'Successfull find contacts',
    data,
  });
};

export const getContactByIdController = async (req, res) => {
  const { id } = req.params;
  //  console.log(`req.params`, req.params); //  зберігаються всі параметри маршрути в req.params
  const data = await getContactById(id);
  if (!data) {  //  умова якщо null 
      // console.log(data);
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

  // console.log(req.user); //  перевірка інформації про користувача, хто робить запит

  const { _id: userId } = req.user; //  userId mongoose

  const data = await postContacts({...req.body, userId}); //  додатково додавання userId користувача
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data,
  });
}

export const patchContactController = async (req, res) => {
  const { id } = req.params;
  // console.log(contactId);
    const data = await patchContact(id, req.body);
    if (!data) {
      throw createHttpError(404, `Not found`);
    }
    res.json({
      status: 200,
      message: `Successfully patched a contact!`,
      data,
    });
};

export const deleteContactByIdController = async (req, res) => {
  const { id } = req.params;
    const data = await deleteContactById(id);
    // console.log(contactId);
    // console.log(data);
    if (!data) {
      throw createHttpError(404, `Contact id= ${id} not found`);
    }
    res.status(204).json();
};

 
