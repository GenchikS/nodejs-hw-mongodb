// ф-ція спрацьовує лише після невдалого збереження після запиту спрацює ця ф-ція
export const handleSaveError = (error, data, next) => {
  // console.log("hello auth register");  //  перевірка register
  // console.log('code', error.code); //  перевірка встроєних ф-цій в mongoose, code
  // console.log('name', error.name); //  перевірка встроєних ф-цій в mongoose, name
  const { code, name } = error;  //  витягуємо данні
  error.status = (name === 'MongoServerError' && code === 11000) ? 409  : 400
  // error.status = 400;
  next();
};

export const setUpdataSettings = function (next){
  this.options.runValidators = true;
  this.options.new = true;
  next();
}
