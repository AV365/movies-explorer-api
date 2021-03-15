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
// require('dotenv').config();
require('custom-env').env();

const {
  DB_HOST, DB_NAME, PORT,
} = process.env;
// const dbUrl = NODE_ENV === 'production' ? DB_HOST + DB_NAME : 'mongodb://localhost:27017/bitfilmsdb';
// const jwt = NODE_ENV === 'production' ? JWT_SECRET : 'zur-secret';
// const serverPort = NODE_ENV === 'production' ? PORT : 3000;

// console.log(DB_HOST + DB_NAME);
// console.log(JWT_SECRET);
// console.log(jwt);
// console.log(serverPort);
// console.log(apiSettings.rateLimiterSettings);
// console.log(apiSettings.corsOptions);

mongoose.connect(DB_HOST + DB_NAME, apiSettings.mongooseOptions);

const { requestLogger, errorLogger } = require('./middlewares/logger');

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true,
}));

app.use('*', cors(apiSettings.corsOptions));
app.use(helmet());

// const CustomError = require('./errors/custom-error');
// const { errorMessages } = require('./tmp/custom-error-messages');

const router = require('./routes');

app.use(requestLogger);

const limiter = rateLimit(apiSettings.rateLimitSettings);
app.use(limiter);

// Тестирование сервера на перезагрузку - удалить на рабочем сервере
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use('/', router);
// app.use('*', () => {
//   throw new CustomError(404);
// });

// лог ошибок
app.use(errorLogger);

// обработчик ошибок celebrate
app.use(errors());

const errorprocess = require('./middlewares/errorprocess');

// Основная обработка ошибок
app.use(errorprocess);

// Запускаем сервер
app.listen(PORT, () => {
  console.log(`Application is running on ${PORT} port`);
});
