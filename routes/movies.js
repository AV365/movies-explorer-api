const express = require('express');

const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const { errorMessages } = require('../errors/custom-messages');

const router = express.Router();
const controller = require('../controllers/movies');

router.get('/', controller.getMovies);

router.post('/',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string()
        .required().custom((value, helpers) => {
          if (validator.isURL(value)) {
            return value;
          }
          return helpers.message(errorMessages['route-noturl']);
        }),
      trailer: Joi.string()
        .required().custom((value, helpers) => {
          if (validator.isURL(value)) {
            return value;
          }
          return helpers.message(errorMessages['route-noturl']);
        }),
      thumbnail: Joi.string()
        .required().custom((value, helpers) => {
          if (validator.isURL(value)) {
            return value;
          }
          return helpers.message(errorMessages['route-noturl']);
        }),
      movieId: Joi.number().required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
    }),
  }),
  controller.postMovie);

router.delete('/:id',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().length(24).hex().required(),
    }),
  }),
  controller.deleteMovie);

module.exports = router;
