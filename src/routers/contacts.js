import { Router } from "express";

import * as contactsControllers from "../controllers/contacts.js"  //  приклад звернення до всіх ф-цій в файлі
import { ctrlWrapper } from "../utils/ctrlWrapper.js";

const contactsRouters = Router();  //  створення пустого маршруту

contactsRouters.get(
  `/`,
  ctrlWrapper(contactsControllers.getContactsController),
);  //  необхідно звернутися до певной ф-ції маршруту  виклик ф-ції не робиться

contactsRouters.get(
  `/:contactId`,
  ctrlWrapper(contactsControllers.getContactByIdController),
);

contactsRouters.post(
  `/`,
  ctrlWrapper(contactsControllers.postContactController),
);

contactsRouters.patch(
  `/:contactId`,
  ctrlWrapper(contactsControllers.patchContactController),
);

contactsRouters.delete(
  `/:contactId`,
  ctrlWrapper(contactsControllers.deleteContactByIdController),
);

export default contactsRouters;