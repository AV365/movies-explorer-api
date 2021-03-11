const BadRequestError = require('./400-bad-request-error');
const UnauthorizedError = require('./401-unauthorized');
const ForbiddenError = require('./403-forbidden');
const NotFoundError = require('./404-not-found-error');
const ConflictError = require('./409-conflict');

const InternalServerError = require('./500-internal-server-error');

const CustomError = require('./custom-error');

module.exports = {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
  InternalServerError,
  ForbiddenError,
  CustomError,
};
