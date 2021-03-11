const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        const regexpUrl = /https?:\/\/[\w\d-]*\.*[\w\d-]{2,}.\/*[\w\d-]+.[-._~:/?#[\]@!$&'()*+,;=\w\d]*#*$/img;
        return regexpUrl.test(v);
      },
      message: 'Адрес имеет неправильный формат',
    },
  },
  trailer: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        const regexpUrl = /https?:\/\/[\w\d-]*\.*[\w\d-]{2,}.\/*[\w\d-]+.[-._~:/?#[\]@!$&'()*+,;=\w\d]*#*$/img;
        return regexpUrl.test(v);
      },
      message: 'Адрес имеет неправильный формат',
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        const regexpUrl = /https?:\/\/[\w\d-]*\.*[\w\d-]{2,}.\/*[\w\d-]+.[-._~:/?#[\]@!$&'()*+,;=\w\d]*#*$/img;
        return regexpUrl.test(v);
      },
      message: 'Адрес имеет неправильный формат',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
    unique: true,
    tags: { type: [Number], index: true },
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
