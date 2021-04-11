const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const validator = require('validator');

const { UnauthorizedError } = require('../errors/index');

const { errorMessages } = require('../errors/custom-messages');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
    default: 'Имя пользователя',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    tags: { type: [String], index: true },
    validate: {
      validator(v) {
        // const regexpMail = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
        return validator.isEmail(v);
      },
      message: errorMessages['usermodel-notemail'],
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlength: 8,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(
          new UnauthorizedError(errorMessages['usermodel-unauthorized']),
        );
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new UnauthorizedError(errorMessages['usermodel-unauthorized']),
          );
        }
        return user; // теперь user доступен
      });
    });
};

module.exports = mongoose.model('user', userSchema);
