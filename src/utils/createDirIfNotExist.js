import * as fs from "node:fs/promises"


export const createDirIfNotExist = async url => {
    try {
        await fs.access(url)  //  перевірка логіки чи є папка, якщо є то нічого не створює. Якщо немає, то викидає далі помилку
    } catch (error) {
        if (error.code === "ENOENT") {
          //  ENOENT - немає такої папки
          await fs.mkdir(url); //  якщо помилка - немає, то створюємо таку папку
        } 
    }
}