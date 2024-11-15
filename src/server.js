import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import pino from 'pino-http';
import { env } from "./utils/env.js"

import contactsRouters from "./routers/contacts.js"
import authRouter from "./routers/auth.js";

import { errorHandler } from "./middlewares/errorHandler.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";



const PORT = Number(env(`PORT`, `3000`))

export const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());  //  мідлвара для cookies

  // app.use(
  //   pino({
  //     transport: {
  //       target: 'pino-pretty',
  //     },
  //   }),
  // );
  //  app.use(logger)

  app.use(`/contacts`, contactsRouters); //  при запиті `/contacts` шукати обробник в contactsRouters
  app.use(`/auth`, authRouter);

  //   опрацювання 404 та 500 помилки, коли не знайдено шлях
  app.use('*', notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}