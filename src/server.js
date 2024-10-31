import express from "express";
import cors from "cors"
import pino from 'pino-http';
import { env } from "./utils/env.js"

import contactsRouters from "./routers/contacts.js"



const PORT = Number(env(`PORT`, `3000`))

export const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );
  //  app.use(logger)

  app.use(`/contacts`, contactsRouters); //  при запиті `/contacts` шукати обробник в contactsRouters

  //   опрацювання 404 та 500 помилки, коли не знайдено шлях
  app.use('*', (req, res, next) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  app.use((err, req, res, next) => {
    res.status(500).json({
      message: 'Something went wrong',
      error: err.message,
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}