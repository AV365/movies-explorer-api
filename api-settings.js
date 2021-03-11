const rateLimiterSettings = {
  windowMs: 15 * 60 * 1000,
  max: 100,
};

const corsOptions = {
  origin: [
    'http://localhost:8080',
    'http://localhost:3000',
    'http://movies-explorer.av365.ru',
    'http://www.movies-explorer.av365.ru',
    'https://movies-explorer.av365.ru',
    'https://www.movies-explorer.av365.ru',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
};

const mongooseOptions = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  autoIndex: true,
};

exports.rateLimiterSettings = rateLimiterSettings;
exports.corsOptions = corsOptions;
exports.mongooseOptions = mongooseOptions;
