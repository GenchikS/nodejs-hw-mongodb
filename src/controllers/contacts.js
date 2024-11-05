import { getContacts, getContactById, postContacts, patchContact, deleteContactById } from '../services/contacts.js'; //  логіка пошуку колекції
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
  
  const { contactId } = req.params;
  
  try {
    // console.log(`req.params`, req.params); //  зберігаються всі параметри маршрути в req.params
    const data = await getContactById(contactId);

    if (!data) {
      throw createHttpError(404, `Contact id= ${contactId} not found`);
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
  // console.log(req.body)   // перевірка
  try {
    const data = await postContacts(req.body);
    res.status(201).json({
      status: 201,
		  message: "Successfully created a contact!",
		  data,
    })
  } catch (error) {
    const { status = 500, message = "Something went wrong" } = error;
    req.stasus(status).json({
      status,
      message
    })
  }
}

export const patchContactController = async (req, res) => {
  const { contactId } = req.params;
  // console.log(contactId);
  const data = await patchContact(contactId, req.body);
  if (!data) throw createHttpError(404, `Not found`); 
      res.json({
        status: 200,
        message: `Successfully patched a contact!`,
        data,
      })
}

export const deleteContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  try {
    const data = await deleteContactById(contactId);

    console.log(contactId);
    console.log(data);

    if (!data) {
      throw createHttpError(404, `Contact id= ${contactId} not found`);
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

 
