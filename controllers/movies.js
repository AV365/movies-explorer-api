const Movies = require('../models/movie');

const CustomError = require('../errors/custom-error');

const getMovies = (req, res, next) => {
  Movies.find({ owner: req.user._id })
    .then((data) => res.send(data))
    .catch((err) => {
      throw new CustomError(500, err.message);
    }).catch(next);
};

const deleteMovie = (req, res, next) => {
  Movies.findById(req.params.id).then((data) => {
    if (!data) {
      throw new CustomError(404, req.params.id);
    }
    if (String(data.owner) !== String(req.user._id)) {
      throw new CustomError(403);
    }
    Movies.findByIdAndRemove(req.params.id)
      .then((movie) => {
        if (!movie) {
          throw new CustomError(404, req.param('id'));
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
        throw new CustomError(400, err.message);
      }
    })
    .then((movie) => res.send({ data: movie }))
    .catch(next);
};

module.exports = {
  getMovies, deleteMovie, postMovie,
};
