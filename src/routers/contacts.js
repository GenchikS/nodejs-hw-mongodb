import { Router } from "express";

import * as contactsControllers from "../controllers/contacts.js"  //  приклад звернення до всіх ф-цій в файлі
import { ctrlWrapper } from "../utils/ctrlWrapper.js";

const contactsRouters = Router();  //  створення пустого маршруту

contactsRouters.get(
  `/`,
  ctrlWrapper(contactsControllers.getContactsController),
);  //  необхідно звернутися до певной ф-ції маршруту  виклик ф-ції не робиться

contactsRouters.get(
  `/:id`,
  ctrlWrapper(contactsControllers.getContactByIdController),
);

contactsRouters.post(
  `/`,
  ctrlWrapper(contactsControllers.postContactController),
);

contactsRouters.patch(`/:id`, ctrlWrapper(contactsControllers.patchContactController))

export default contactsRouters;