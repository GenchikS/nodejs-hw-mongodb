import * as fs from "node:fs/promises"
import { UPLOAD_DIR } from "../constants/index.js"
import * as path from "node:path"
//  уиліта для переміщення файлів з тимчасової папки TEMP_DIR до UPLOAD_DIR
export const saveFileToUploadDir = async file => {
    const newPath = path.join(UPLOAD_DIR, file.filename);  //  пропис нового шляху + додавання назви файлу в кінець. Отримали повний шлях
    await fs.rename(file.path, newPath)   //  якщо передати спочатку старий шлях, а потім новий, то rename виріже та перенесе файл
}