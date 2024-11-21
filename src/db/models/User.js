import { Schema, model } from "mongoose"
import { handleSaveError, setUpdataSettings } from './hooks.js';
import { emailRegex } from "../../constants/authUsers.js";

const userSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
        match: emailRegex,  //  регулярний вираз на перевірку пошти
        unique: true, //  перевірка на унікальність пошти в рамках певної колекції
        require: true,
    },
    password: {
      type: String,
      require: true,
    },
    verify: {  //  додаємо поле для перевірки реєстрації
      type: Boolean,
      default: false,
      require: true
    }
  },
  {
    timestamps: true, //  додавання дати створення
    versionKey: false, //  видалення versionKey
  },
);


userSchema.post(`save`, handleSaveError) //  post означає. що передати після. save операція з базою
userSchema.pre(`findOneAndUpdate`, setUpdataSettings);  //  обробка помилки при оновленні
userSchema.post(`save`, handleSaveError);  //  обробка помилки, якщо сталася після оновлення

const UserCollection = model(`users`, userSchema);
export default UserCollection;
