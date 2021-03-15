// String.prototype.format = function () {
//   a = this;
//   for (k in arguments) {
//     a = a.replace(`{${k}}`, arguments[k]);
//   }
//   return a;
// };

const errorMessageFormat = (msg, ...params) => {
  let msgWork = msg;

  /* eslint no-restricted-syntax: ["error", "FunctionExpression",
  "WithStatement", "BinaryExpression[operator='in']"] */
  for (const k in params) {
    if (Object.prototype.hasOwnProperty.call(params, k)) {
      msgWork = msgWork.replace(`{${k}}`, params[k]);
    }
  }
  return msgWork;
};

const BadRequestError = require('./400-bad-request-error');
const UnauthorizedError = require('./401-unauthorized');
const ForbiddenError = require('./403-forbidden');
const NotFoundError = require('./404-not-found-error');
const ConflictError = require('./409-conflict');

const InternalServerError = require('./500-internal-server-error');

module.exports = {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
  InternalServerError,
  ForbiddenError,
  errorMessageFormat,
};
