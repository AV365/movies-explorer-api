const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// const CustomError = require('../errors/custom-error');

const {
  UnauthorizedError, NotFoundError, InternalServerError,
  ConflictError, BadRequestError, errorMessageFormat,
} = require('../errors/index');
const { errorMessages } = require('../errors/custom-messages');

// const jwtSecret = process.env.JWT_SECRET || 'zur-secret';
const jwtSecret = process.env.JWT_SECRET;

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        jwtSecret,
        { expiresIn: '7d' }, // токен будет просрочен через 7 дней после создания
      );
      res.send({ token });
    })
    .catch(() => {
      // console.log(errorMessages);
      //      next(new UnauthorizedError('Неправильные почта или пароль!'));
      next(new UnauthorizedError(errorMessageFormat(errorMessages['login-unauthorized'], email)));
    });
};

const getMyInfo = (req, res, next) => {
// .select('-_id')
  User.findById(req.user._id)
    .then((data) => {
      if (!data) {
        throw new NotFoundError(errorMessageFormat(errorMessages['getmyinfo-notfound'], req.param('id')));

        // throw new NotFoundError(`Пользователь ${req.param('id')} не найден!`);
      }
      return res.send(data);
    })
    .catch(next)
    .catch((err) => {
      throw new InternalServerError(err.message);
    })
    .catch(next);
};

const postUser = (req, res, next) => {
  const {
    password, email,
  } = req.body;
  // console.log(email);
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash, // записываем хеш в базу
    }))
    .then((user) => {
      // const token = jwt.sign(
      //   { _id: user._id },
      //   jwtSecret,
      //   { expiresIn: '7d' }, // токен будет просрочен через 7 дней после создания
      // );
      // console.log(token);
      res.send({
        name: user.name,
        _id: user._id,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        //        throw new ConflictError(errorMessages['postuser-conflict'].format(email));
        throw new ConflictError(errorMessageFormat(errorMessages['postuser-conflict'], email));
        // throw new ConflictError(`Пользователь уже зарегистрирован`);
      }
      throw new InternalServerError(err.message);
    })
    .catch(next);
};
//
const updateUserProfile = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError(err.message);
      }
    })
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports = {
  postUser, login, getMyInfo, updateUserProfile,
};
