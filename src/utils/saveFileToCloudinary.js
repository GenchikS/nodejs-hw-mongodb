import { v2 as cloudinary } from "cloudinary";
import { env } from "./env.js"
import { unlink } from "node:fs/promises";  //  ф-ція для видалення 


//  витягнули змінні оточення
const cloud_name = env('CLOUDINARY_CLOUD_NAME');
const api_key = env('CLOUDINARY_API_KEY');
const api_secret = env('CLOUDINARY_API_SECRET');

// вставляємо в налаштування пакету cloudnary
cloudinary.config({
    cloud_name,
    api_key,
    api_secret,
})

export const saveFileToCloudinary = async (file, folder) => {
try {
    const response = await cloudinary.uploader.upload(file.path, { folder }); // завантаження файлів в cloudnary
    // console.log(response);  //  інформація про завантажений файл
    return response.secure_url;
} catch (error) {
    // throw error;
    }
finally {
    await unlink(file.path);  // видалення файлу temp
    }
}