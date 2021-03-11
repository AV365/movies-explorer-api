const express = require('express');

const { celebrate, Joi } = require('celebrate');

const router = express.Router();
const controllerUser = require('../controllers/users');
const auth = require('../middlewares/auth');

const userRoutes = require('./users');
const movieRoutes = require('./movies');

router.post('/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  controllerUser.login);
router.post('/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string(),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  controllerUser.postUser);

router.use(auth);
router.use('/users', userRoutes);
router.use('/movies', movieRoutes);

module.exports = router;
