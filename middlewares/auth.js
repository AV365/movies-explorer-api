const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors/index');
const { errorMessages } = require('../errors/custom-messages');

// const jwtSecret = process.env.JWT_SECRET || 'zur-secret';
const jwtSecret = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError(errorMessages['auth-unauthorized']));
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, jwtSecret);
  } catch (err) {
    return next(new UnauthorizedError(errorMessages['auth-unauthorized']));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше

  return req.user;
};
