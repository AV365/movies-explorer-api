const express = require('express');

const { celebrate, Joi } = require('celebrate');

const router = express.Router();
const controllerUser = require('../controllers/users');

router.get('/me', controllerUser.getMyInfo); // делать
router.patch('/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      email: Joi.string().required().email(),
    }),
  }),
  controllerUser.updateUserProfile);

module.exports = router;
