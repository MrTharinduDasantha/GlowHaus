// Standardised JSON response shape so the frontend always knows what to expect.
// Every controller should return through one of these two helpers.

export const sendSuccess = (
  res,
  statusCode = 200,
  message = "Success",
  data = null,
) =>
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });

export const sendError = (
  res,
  statusCode = 500,
  message = "Something went wrong",
  errors = null,
) =>
  res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
