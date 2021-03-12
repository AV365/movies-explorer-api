const express = require('express');

const { celebrate, Joi } = require('celebrate');
const { NotFoundError } = require('../errors/index');
const { errorMessages } = require('../errors/custom-messages');

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
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  controllerUser.postUser);

router.use(auth);
router.use('/users', userRoutes);
router.use('/movies', movieRoutes);

router.use('*', () => {
  throw new NotFoundError(errorMessages['route-notfound']);
  //throw new NotFoundError('Ресурс не найден');
});

module.exports = router;
