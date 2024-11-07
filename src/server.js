import express from "express";
import cors from "cors"
import pino from 'pino-http';
import { env } from "./utils/env.js"

import contactsRouters from "./routers/contacts.js"
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";



const PORT = Number(env(`PORT`, `3000`))

export const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  // app.use(
  //   pino({
  //     transport: {
  //       target: 'pino-pretty',
  //     },
  //   }),
  // );
  //  app.use(logger)

  app.use(`/contacts`, contactsRouters); //  при запиті `/contacts` шукати обробник в contactsRouters

  //   опрацювання 404 та 500 помилки, коли не знайдено шлях
  app.use('*', notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}