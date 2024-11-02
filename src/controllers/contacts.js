import { getContacts, getContactById, postContacts } from '../services/contacts.js'; //  логіка пошуку колекції
import createHttpError from "http-errors"

export const getContactsController = async (req, res) => {
  //  при створенні роутеру шлях `contacts` необхідно прибрати, т.я. він вказаний в server.js в мідлварі
  try {
    const data = await getContacts();  //  якщо и try сталася помилка, то переходить на catch error
    res.json({
      stasus: 200,
      message: 'Successfull find contacts',
      data,
    });
  } catch (error) {
    res.stasus(500).json({
      status: 500,
      message: 'Something went wrong',
      error: error.message,
    });
  }
  
  //  res.json({ massage: 'Hello hw-2' });  необхідно було для перевірки запуску сервера
};

export const getContactByIdController = async (req, res) => {
  
  const { id } = req.params;
  
  try {
    // console.log(`req.params`, req.params); //  зберігаються всі параметри маршрути в req.params
    const data = await getContactById(id);

    if (!data) {
      throw createHttpError(404, `Contact id= ${id} not found`);
    }

    res.json({
      stasus: 200,
      message: 'Contact successfull find',
      data,
    });
  } catch (error) {
    const { status = 500, message = "Something went wrong" } = error; //"" - лише такі // якщо помилка 500, то викидає помилку 500. Якщо прилітає 404, то зберігається 404
      res.status(status).json({
      status,
       message,
      });
  }
};

export const postContactController = async (req, res) => {
  try {
    const data = await postContacts(req.body);
    res.json({
      status: 201,
		  message: "Successfully created a contact!",
		  data: data,
    })
  } catch (error) {
    const { status = 500, message = "Something went wrong" } = error;
    req.stasus(status).json({
      status,
      message
    })
  }
}