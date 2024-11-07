import createHttpError from "http-errors"
// import {isValidObjectId} from "mongoose"
import { isValidObjectId } from "mongoose";

export const isValidId = (req, res, next) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
        return next(createHttpError(400, `${id} not valid id`))
    }
    next();
}