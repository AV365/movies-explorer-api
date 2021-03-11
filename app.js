const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const mongoose = require('mongoose');
const apiSettings = require('./api-settings');

const app = express();

// ENVIRONMENT
require('dotenv').config();

const {
  NODE_ENV, DB_HOST, DB_NAME, PORT,
} = process.env;
const dbUrl = NODE_ENV === 'production' ? DB_HOST + DB_NAME : 'mongodb://localhost:27017/bitfilmsdb';
// const jwt = NODE_ENV === 'production' ? JWT_SECRET : 'zur-secret';
const serverPort = NODE_ENV === 'production' ? PORT : 3000;

// console.log(dbUrl);
// console.log(jwt);
// console.log(serverPort);
// console.log(apiSettings.rateLimiterSettings);
// console.log(apiSettings.corsOptions);

mongoose.connect(dbUrl, apiSettings.mongooseOptions);

const { requestLogger, errorLogger } = require('./middlewares/logger');

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true,
}));

app.use('*', cors(apiSettings.corsOptions));
app.use(helmet());

const limiter = rateLimit(apiSettings.rateLimitSettings);
app.use(limiter);

const CustomError = require('./errors/custom-error');
const { errorMessages } = require('./errors/error-messages');

const router = require('./routes');

app.use(requestLogger);

// Тестирование сервера на перезагрузку - удалить на рабочем сервере
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use('/', router);
app.use('*', () => {
  throw new CustomError(404);
});

// лог ошибок
app.use(errorLogger);

// обработчик ошибок celebrate
app.use(errors());

// Основная обработка ошибок
app.use((err, req, res, next) => {
  // console.log(err);
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? errorMessages[500]
        : message,
    });
  next();
});

// Запускаем сервер
app.listen(serverPort, () => {
  console.log(`Application is running on ${serverPort} port`);
});
