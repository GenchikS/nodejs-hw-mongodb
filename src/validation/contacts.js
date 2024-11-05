import Joi from 'joi';
import { typeContacts } from '../constants/contacts.js';

export const contactPostSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(20)
    .required()
    .messages({ 'any.required': `необхідно вказати ім'я` }), //  приклад додавання повідомлення
  phoneNumber: Joi.string()
    .min(3)
    .max(20)
    .required()
    .messages({ 'any.required': `необхідно вказати телефон` }), //  приклад додавання повідомлення
  email: Joi.string().min(3).max(20),
  isFavourite: Joi.boolean(),
  // contactType: Joi.string().valid("work", "home", "personal") //  винесено через константу
  contactType: Joi.string()
    .valid(...typeContacts)
    .required(),
});

export const contactPatchSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.string().min(3).max(20),
  email: Joi.string().min(3).max(20),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid(...typeContacts),
});
