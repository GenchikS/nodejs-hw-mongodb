import * as path from "node:path";

export const TEMPLATE_DIR = path.resolve("src", "templates");  //  абсолютний шлях до папки templates

export const TEMP_DIR = path.resolve("temp")//  абсолютний шлях до папки temp
export const UPLOAD_DIR = path.resolve("uploads")//  абсолютний шлях до папки uploads

export const SWAGGER_PATH = path.join(process.cwd(), 'docs', 'swagger.json');  //  функцію swaggerDocs, яка повертає роут для swagger

export const SMTP = {
  SMTP_HOST: 'SMTP_HOST',
  SMTP_PORT: 'SMTP_PORT',
  SMTP_USER: 'SMTP_USER',
  SMTP_PASSWORD: 'SMTP_PASSWORD',
  SMTP_FROM: 'SMTP_FROM',
};
