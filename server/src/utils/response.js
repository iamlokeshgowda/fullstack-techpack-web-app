export const sendResponse = (
  res,
  {
    statusCode = 200,
    success = true,
    message = "Success",
    data = null,
    error = null,
  }
) => {
  return res.status(statusCode).json({
    success,
    message,
    data,
    error,
  });
};
