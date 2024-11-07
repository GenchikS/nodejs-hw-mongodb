export const calculatePaginationData = ({totalItems, page, perPage}) => {
    const totalPages = Math.ceil(totalItems / perPage);
    const hasPreviousPage = page > 1; //  якщо умова виконується, то повертається true - є попередня сторінка
    const hasNextPage = page < totalPages;  //  якщо умова виконується, то є наступна сторінка - повертається true. І навпаки
    return {
        page,
        perPage,
        totalItems,
        totalPages,
        hasPreviousPage,
        hasNextPage
    }
}