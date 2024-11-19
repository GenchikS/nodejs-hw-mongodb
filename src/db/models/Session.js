import { Schema, model } from 'mongoose';
import { handleSaveError, setUpdataSettings } from './hooks.js';

const sessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId, //  вказування збереження поля Id, т.я. в mongoose немає іншого вказування
      ref: 'users', //  вказати звідки (з якої таблиці) брати Id, іноді необхідно вказувати
      require: true,
    },
    accessToken: {
      //   токен лише для запитів та оновлень
      type: String,
      require: true,
    },
    refreshToken: {
      type: String,
      require: true,
    },
    accessTokenValidUntil: {
      type: Date,
      required: true,
    },
    refreshTokenValidUntil: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true, //  додавання дати створення
    versionKey: false, //  видалення versionKey
  },
);


sessionSchema.post(`save`, handleSaveError) //  post означає. що передати після. save операція з базою
sessionSchema.pre(`findOneAndUpdate`, setUpdataSettings);  //  обробка помилки при оновленні
sessionSchema.post(`save`, handleSaveError);  //  обробка помилки, якщо сталася після оновлення

const SessionCollection = model(`session`, sessionSchema);
export default SessionCollection;
