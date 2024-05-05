const topupService = require('./topup-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

async function createTopup(request, response, next) {
  try {
    const nama_game = request.body.nama_game;
    const jumlah_diamond = request.body.jumlah_diamond;
    const harga = request.body.harga;

    const hasil = await topupService.createTopup(
      nama_game,
      jumlah_diamond,
      harga
    );

    return response.status(200).json(hasil);
  } catch (error) {
    return next(error);
  }
}

async function getTopup(request, response, next) {
  try {
    const page_number = parseInt(request.query.page_number) || 1;
    const page_size = parseInt(request.body.page_size) || 7;

    const topup = await topupService.getTopup(page_number, page_size);

    return response.status(200).json(topup);
  } catch (error) {
    return next(error);
  }
}

async function updateTopup(request, response, next) {
  try {
    const id = request.params.id;
    const nama_game = request.body.nama_game;
    const jumlah_diamond = request.body.jumlah_diamond;
    const harga = request.body.harga;

    const result = await topupService.updateTopup(
      id,
      nama_game,
      jumlah_diamond,
      harga
    );
    return response.status(200).json(id);
  } catch (error) {
    return next(error);
  }
}

async function deleteTopup(request, response, next) {
  try {
    const id = request.params.id;

    const result = await topupService.deleteTopup(id);

    return response.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createTopup,
  getTopup,
  updateTopup,
  deleteTopup,
};
