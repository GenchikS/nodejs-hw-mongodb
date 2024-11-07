import { Schema, model } from "mongoose";
import { typeContacts } from "../../constants/contacts.js";

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
      require: false
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
      required: true
    },
  },
  {
    timestamps: true, //  додавання дати створення
    versionKey: false, //  видалення versionKey
  },
);


export const sortByList = ['name'];
const ContactCollection = model(`contact`, contactSchema);
export default ContactCollection;