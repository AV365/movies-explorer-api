const Movies = require('../models/movie');

// const CustomError = require('../errors/custom-error');
const {
  BadRequestError, InternalServerError, NotFoundError, ForbiddenError,
} = require('../errors/index');
const { errorMessages } = require('../errors/custom-messages');

const getMovies = (req, res, next) => {
  Movies.find({ owner: req.user._id })
    .then((data) => res.send(data))
    .catch((err) => {
      throw new InternalServerError(err.message);
    }).catch(next);
};

const deleteMovie = (req, res, next) => {
  Movies.findById(req.params.id).then((data) => {
    if (!data) {
      throw new NotFoundError(errorMessages['deletemovie-notfound'].format(req.params.id));
      // throw new NotFoundError(`Запись ${req.params.id} не найдена`);
    }
    if (String(data.owner) !== String(req.user._id)) {
      throw new ForbiddenError(errorMessages['deletemovie-forbidden']);
      // throw new ForbiddenError('Доступ запрещен');
    }
    Movies.findByIdAndRemove(req.params.id)
      .then((movie) => {
        if (!movie) {
          throw new NotFoundError(errorMessages['deletemovie-notfound'].format(req.params.id));
          //          throw new NotFoundError(`Запись ${req.param('id')} не найдена`);
        }
        return res.send(movie);
      });
    res.send({ data });
  })
    .catch(next);
};

const postMovie = (req, res, next) => {
  // console.log(req.user);
  const {
    country, director, duration, year, description,
    image, trailer, thumbnail, movieId, nameRU, nameEN,
  } = req.body;
  Movies.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError(err.message);
      }
    })
    .then((movie) => {
      if (!movie) {
        throw new BadRequestError(errorMessages['postmovie-badrequest']);
      }
      res.send({ data: movie });
    })
    .catch(next);
};

module.exports = {
  getMovies, deleteMovie, postMovie,
};
