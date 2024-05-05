const joi = require('joi');
const { joiPasswordExtendCore } = require('joi-password');
const { createTopup, updateTopup } = require('./topup-repository');
const {
  nama_game,
  jumlah_diamond,
  harga,
} = require('../../../models/topup-schema');
const joiPassword = joi.extend(joiPasswordExtendCore);

module.exports = {
  createTopup: {
    body: {
      nama_game: joi.string().required().label('nama_game'),
      jumlah_diamond: joi.number().required().label('jumlah_diamond'),
      harga: joi.number().required().label('harga'),
    },
  },

  updateTopup: {
    body: {
      nama_game: joi.string().required().label('nama_game'),
      jumlah_diamond: joi.number().required().label('jumlah_diamond'),
      harga: joi.number().required().label('harga'),
    },
  },
};
