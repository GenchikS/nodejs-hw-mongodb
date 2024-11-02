import { env } from "../utils/env.js"
import mongoose from "mongoose";

export const initMongoConnection = async() => {
    try {
      // mongodb+srv://Test:<db_password>@cluster0.2qhf5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0 // розбір на блоки
      const user = env(`MONGODB_USER`);
      const passwors = env(`MONGODB_PASSWORD`);
      const url = env(`MONGODB_URL`);
      const db = env(`MONGODB_DB`);
      
      await mongoose.connect(
        `mongodb+srv://${user}:${passwors}@${url}/${db}?retryWrites=true&w=majority&appName=Cluster0`,
      );
      console.log(`Mongo connection successfully established`);
    } catch (error) {
        console.log(`Error connect database with message ${error.message}`)
        throw error;
    }
} 

