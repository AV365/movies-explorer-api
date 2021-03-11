const { errorMessages } = require('./error-messages');

class CustomError extends Error {
  constructor(code, message = '') {
    super(`${errorMessages[code]} ${message}`);
    this.statusCode = code;
  }
}

module.exports = CustomError;
