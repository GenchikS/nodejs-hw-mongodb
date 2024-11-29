// Regular expression for email validation
export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/;

export const accessTokenLifeTime = 1000 * 60 * 15 * 3 //  1000мс - 1с //  15хв * 3 //  45
export const refreshTokenLifeTime = 1000 * 60 * 60 *24 * 30  //  30 днів
