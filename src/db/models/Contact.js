import { Schema, model } from "mongoose";
import { typeContacts } from "../../constants/contacts.js";
import { handleSaveError, setUpdataSettings } from "./hooks.js";
import { emailRegex } from "../../constants/authUsers.js";

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      match: emailRegex,
      require: false,
    },
    isFavourite: {
      type: Boolean,
      required: false,
    },
    contactType: {
      type: String,
      // enum: [`work`, `home`, `personal`], //  можна винисти в константу, приклад нище
      enum: typeContacts,
      default: `personal`,
      required: true,
    },
  },
  {
    timestamps: true, //  додавання дати створення
    versionKey: false, //  видалення versionKey
  },
);

contactSchema.post(`save`, handleSaveError) //  post означає. що передати після. save операція з базою
contactSchema.pre(`findOneAndUpdate`, setUpdataSettings);  //  обробка помилки при оновленні
contactSchema.post(`save`, handleSaveError);  //  обробка помилки, якщо сталася після оновлення


export const sortByList = ['name'];
const ContactCollection = model(`contact`, contactSchema);
export default ContactCollection;