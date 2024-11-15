import { Router } from "express";

import * as contactsControllers from "../controllers/contacts.js"  //  приклад звернення до всіх ф-цій в файлі
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { validateBody } from "../utils/validateBody.js";
import { contactPatchSchema, contactPostSchema } from "../validation/contacts.js";
import { isValidId } from "../middlewares/isValidId.js";
import { authenticate } from "../middlewares/authenticate.js";

const contactsRouters = Router();  //  створення пустого маршруту

contactsRouters.use(authenticate); // можна прописати authenticate в кожному маршруту. Або краще винести в мідлвару use. Спочатку проходить запит через цю мідлвару, потім вже шукаються необхідні маршрути

contactsRouters.get(
  `/`,
  ctrlWrapper(contactsControllers.getContactsController),
);  //  необхідно звернутися до певной ф-ції маршруту  виклик ф-ції не робиться

contactsRouters.get(
  `/:id`, isValidId, ctrlWrapper(contactsControllers.getContactByIdController),
);

contactsRouters.post(
  `/`,
  validateBody(contactPostSchema),
  ctrlWrapper(contactsControllers.postContactController),
);
// validateBody перевіряє схему запиту та валідує

contactsRouters.patch(
  `/:id`,
  isValidId,
  validateBody(contactPatchSchema),
  ctrlWrapper(contactsControllers.patchContactController),
);

contactsRouters.delete(
  `/:id`,
  isValidId,
  ctrlWrapper(contactsControllers.deleteContactByIdController),
);

export default contactsRouters;