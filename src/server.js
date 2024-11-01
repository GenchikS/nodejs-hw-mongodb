import express from "express";
import cors from "cors"
import pino from 'pino-http';
import { env } from "./utils/env.js"

// import ContactCollection from "./db/models/Contact.js" 
import {getContacts, getContactById} from "./services/contacts.js"  // замість ContactCollection імпортуємо всю логіку з файлу, де він буде шукати певний запит


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
    

  app.get(`/contacts`, async (req, res) => {
    const data = await getContacts();
    res.status(200).json({
      stasus: 200,
      message: "Successfull find contacts",
      data,
    })
    return data;
  //  res.json({ massage: 'Hello hw-2' });  необхідно було для перевірки запуску сервера
  });
  
  app.get(`/contacts/:id`, async (req, res) => {
    console.log(`req.params`, req.params); //  зберігаються всі параметри маршрути в req.params
    const { id } = req.params;
    const data = await getContactById(id);
    
    if (!data) {
      return res.status(404).json({
        stasus: 404,
        message: `Contact id=${id} not found`,
      });
      
    }

    res.json({
      stasus: 200,
      message: 'Contact successfull find',
      data,
    });
    return data;
  });

 //   опрацювання 404 та 500 помилки, коли не знайдено шлях
 app.use((req, res) => {
   res.status(404).json({
     message:'Not found',
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