import nodemailer from "nodemailer";
import "dotenv/config";
import { SMTP } from "../constants/smtp.js";


//  створення транспорту для пошти
const nodemailerConfig = {
    host: SMTP.SMTP_HOST,
    port: Number(SMTP.SMTP_PORT),
    auth: {
        user: SMTP.SMTP_USER,
        pass: SMTP.SMTP_PASSWORD,
    },
}


const transporter = nodemailer.createTransport(nodemailerConfig);

export const sendEmail = async (options) => {
  return await transporter.sendMail(options);
};
