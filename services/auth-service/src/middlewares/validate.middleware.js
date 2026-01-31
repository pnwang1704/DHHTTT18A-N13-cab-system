const { HttpError } = require("../utils/httpError");

function validateBody(schema) {
  return (req, res, next) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return next(
        new HttpError(
          400,
          "VALIDATION_ERROR",
          "Invalid request body",
          parsed.error.flatten(),
        ),
      );
    }
    req.body = parsed.data;
    return next();
  };
}

module.exports = { validateBody };
