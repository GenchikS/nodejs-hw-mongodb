import { notFoundHandler } from "../middlewares/notFoundHandler.js";

export const parseFilterParams = ({ userId }) => {
    if(!userId) return notFoundHandler()
    return userId;
};
