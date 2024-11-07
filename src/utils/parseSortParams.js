const sortList = ["asc", "desc"];

export const parseSortParams = ({ sortBy, sortOrder }, sortByList) => {
  const parseSortOrder = sortList.includes(sortOrder) ? sortOrder : sortList[0]; //  якщо вибору немає то повертаємо по першому ключу
  const parseSortBy = sortByList.includes(sortBy) ? sortBy : '_id'; //  якщо немає поля для сортування, то сотруємо по id
  return {
    sortBy: parseSortBy,
    sortOrder: parseSortOrder,
  };
};