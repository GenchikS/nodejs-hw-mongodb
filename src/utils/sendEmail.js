import nodemailer from "nodemailer";
import "dotenv/config";

const {SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env

//  створення транспорту для пошти
const nodemailerConfig = {
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD,
    },
}


const transporter = nodemailer.createTransport(nodemailerConfig);

export const sendEmail = async (options) => {
  return await transporter.sendMail(options);
};


