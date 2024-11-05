import { Schema, model } from "mongoose";

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
    email: String,
    isFavourite: {
      type: Boolean,
      required: false,
    },
    contactType: {
      type: String,
      enum: [`work`, `home`, `personal`],
      required: true
      // default: `work`,
    },
  },
  {
    timestamps: true, //  додавання дати створення
    versionKey: false, //  видалення versionKey
  },
);

const ContactCollection = model(`contact`, contactSchema)
export default ContactCollection;