import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
// import pino from 'pino-http';
import { env } from "./utils/env.js"

import contactsRouters from "./routers/contacts.js"
import authRouter from "./routers/auth.js";

import { errorHandler } from "./middlewares/errorHandler.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";

import { swaggerDocs } from './middlewares/swaggerDocs.js';


const PORT = Number(env(`PORT`, `3000`))

export const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(express.json()); //  перевіряє всі мідлвари на наявність заголовку Content-Type. Якщо буде не json, то пропускає
  app.use(cookieParser()); //  мідлвара для cookies
  app.use(express.static("upload")) //  якщо прийде запит на віддачу файлу, шукати його в папці upload
  
  app.use('/api-docs', swaggerDocs());

  //  MultiPart / form - data; 
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