import { setupServer } from "./server.js";
import { initMongoConnection } from "./db/initMongoConnection.js";

const boostrap = async () => {
    await initMongoConnection();  //  шлях до хмарного серверу та під'єднання до бази
    setupServer(); //  запуск сервера
}

boostrap();

