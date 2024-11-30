import { setupServer } from "./server.js";
import { initMongoConnection } from "./db/initMongoConnection.js";
import { createDirIfNotExist } from "./utils/createDirIfNotExist.js";  //  імпорт утиліти перевірки та створення папкок temp/uploads
import { TEMP_DIR, UPLOAD_DIR } from "./constants/index.js";  //  импорт констант шляхів


const boostrap = async () => {
  await initMongoConnection(); //  шлях до хмарного серверу та під'єднання до бази
  //  перед запуском проекту відбувається перевірка на наявність папок. Якщо немає, то створюються
  await createDirIfNotExist(TEMP_DIR);
  await createDirIfNotExist(UPLOAD_DIR);
  //  запуск сервера
  setupServer();
}

boostrap();

