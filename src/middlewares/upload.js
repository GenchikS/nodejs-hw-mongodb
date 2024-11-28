import multer from "multer";
import { TEMP_DIR } from "../constants/index.js";
import createHttpError from "http-errors";


const storage = multer.diskStorage({
  // destination: (req, file, callback) => {
  //   callback(null, TEMP_DIR); //  прийде файл - збережи в папку TEMP_DIR
  // },

  //  можна записати простіше
  destination: TEMP_DIR, //  прийде файл - збережи в папку TEMP_DIR
  //  filename необхідний, щоб під час збереження одинакових файлі його переіменувати, а не перезаписати
  filename: (req, file, callback) => {//  визначає під яким ім'ям зберігати файли
    const uniquePrefix = `${Date.now()}_${Math.round(Math.random() * 1E9)}`//  створення унікального префікса для імен
      const filename = `${uniquePrefix}_${file.originalname}`;  //  додавання префіксу до початку орігінальної назви
      callback(null,filename)
    },
});


//  створення опуій/налаштувань по ліміту
const limits = {
fileSize: 1024 * 1024 * 5 //  обмедення розміру до 5Мб
}


//  налаштування на унікальні перевірки
const fileFilter = (req, file, callback) => {
    const extention = file.originalname.split(`.`).pop() //  вирізання розширення файлу після крапки 
    if (extention === `exe`) return callback(createHttpError(400, ".exe extention not allow")) 
    callback(null, true)  //  якщо все добре, то передається файл
}

//  мідлвара
export const upload = multer({
    storage,
    limits,
    fileFilter,
})
