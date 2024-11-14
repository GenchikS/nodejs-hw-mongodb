const parseNumber = (number, defaultValue) => {
  if (typeof number !== `string`) return defaultValue;
  const parseNumberConst = parseInt(number); //  парсимо ціле число з рядка
  if (Number.isNaN(parseNumber)) return defaultValue;  //  якщо це NaN, то поверне true
    
   return parseNumberConst;
}


export const parsePaginationParams = ({page, perPage}) => {
    const parsedPage = parseNumber(page, 1);  // дістаємо параметри сторінка 1 по default
    const parsedPerPage = parseNumber(perPage, 20);  //  кількість елементів на сторінці 3 по default

    return {
        page: parsedPage,
        perPage: parsedPerPage
    };

};