import { Router } from "express";

import * as contactsControllers from "../controllers/contacts.js"  //  приклад звернення до всіх ф-цій в файлі

const contactsRouters = Router();  //  створення пустого маршруту

contactsRouters.get(`/`, contactsControllers.getContactsController);  //  необхідно звернутися до певной ф-ції маршруту  виклик ф-ції не робиться

contactsRouters.get(`/:id`, contactsControllers.getContactByIdController);

export default contactsRouters;