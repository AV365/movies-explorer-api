const { errorMessages } = require('../errors/custom-messages');

module.exports = (err, req, res, next) => {
  // console.log(err);
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;
  console.log(err);
  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? errorMessages.servererror
        : message,
    });
  next();
};
