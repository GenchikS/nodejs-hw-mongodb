import createHttpError from "http-errors";

export const validateBody = schema => {
    const funcval = (req, res, next) => {
      const { error } = schema.validate(req.body, { abortEarly: false }); //  abortEarly: false - виведення всіх помилок
        if (error) {
            next(createHttpError(400, error.message));
        };
        next();
    }
   return funcval;
}



//  приклад асинхронної ф-ції
// export const validateBody = (schema) => {
//     const funcval = async(req, res, next) => {
//         try {
//             await schema.validateAsync(req.body, { abortEarly: false }); //  abortEarly: false - виведення всіх помилок
//         next();  
//         }
//     catch (error) {
//               return next(createHttpError(400, error.message));
//           }
//     }
//   return funcval;
// };