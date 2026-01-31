const { HttpError } = require("../utils/httpError");
const { fail } = require("../utils/response");

function errorHandler(err, req, res, next) {
  // eslint-disable-next-line no-unused-vars
  const e = err;

  if (e instanceof HttpError) {
    return fail(res, e.status, e.code, e.message, e.details);
  }

  // Postgres unique violation
  if (e && e.code === "23505") {
    return fail(res, 409, "CONFLICT", "Resource already exists", {
      pg: e.detail,
    });
  }

  console.error("[ERROR]", e);
  return fail(res, 500, "INTERNAL_ERROR", "Something went wrong");
}

module.exports = { errorHandler };
