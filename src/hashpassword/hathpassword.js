import bckrypt from "bcrypt";

export const hathPassword = async password => {
  // const salt = await bckrypt.genSalt(10)  //  метод хешування зі складністю 10
  // console.log("salt", salt); //  перевірка випадкової генерації

    const result = await bckrypt.hash(password, 10);
    
  // console.log('result', result);
//   const compereResalt = await bckrypt.compare(password, result); //  перевірка введеного паралю password з хешировонним. Якщо збігається, то повернеться true
//   console.log('compereResalt', compereResalt);
//   const compereResalt2 = await bckrypt.compare('111111', result);
  // console.log('compereResalt1', compereResalt1);  //  false

  return result;
}

// hathPassword("111111")  //  для перевірки необхідно прописати виклик в app