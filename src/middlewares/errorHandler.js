import {HttpError} from "http-errors"
export const errorHandler = (err, req, res, next) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({
      status: err.status,
      message: err.message,
    })
  }
res.status(err.status).json({
  status: err.status,
  message: err.name,
  data: err.errmsg,  //  показує код помилки 11000
});
  res.status(500).json({
      status: 500,
        message: `Something went wrong`,
        data: err.message
  });
  next();
}
