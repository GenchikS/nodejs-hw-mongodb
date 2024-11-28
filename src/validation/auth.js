import Joi from "joi";
import { emailRegex } from "../constants/authUsers.js";

//  може бути як signup
export const authRegisterSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string()
    .pattern(emailRegex)
    .required(),
  password: Joi.string().min(4).required(),
});

//  може бути як signin
export const authLoginSchema = Joi.object({
  email: Joi.string().pattern(emailRegex).required(),
  password: Joi.string().required(),
});


// export const requestResetEmailSchema = Joi.object({
//   email: Joi.string().email().required(),
// });