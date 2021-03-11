const express = require('express');

const { celebrate, Joi } = require('celebrate');

const router = express.Router();
const controller = require('../controllers/movies');

const regexpUrl = /https?:\/\/[\w\d-]*\.*[\w\d-]{2,}.\/*[\w\d-]+.[-._~:/?#[\]@!$&'()*+,;=\w\d]*#*$/im;

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
        .pattern(new RegExp(regexpUrl))
        .required(),
      trailer: Joi.string()
        .pattern(new RegExp(regexpUrl))
        .required(),
      thumbnail: Joi.string()
        .pattern(new RegExp(regexpUrl))
        .required(),
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

// router.put('/:cardId/likes',
//   celebrate({
//     params: Joi.object().keys({
//       cardId: Joi.string().length(24).hex().required(),
//     }),
//   }),
//   controller.likeCard);
// router.delete('/:cardId/likes',
//   celebrate({
//     params: Joi.object().keys({
//       cardId: Joi.string().length(24).hex().required(),
//     }),
//   }),
//   controller.dislikeCard);

module.exports = router;
