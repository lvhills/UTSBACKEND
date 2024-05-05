const { query } = require('express');
const { topup } = require('../../../models');

async function createTopup(nama_game, jumlah_diamond, harga) {
  return topup.create({
    nama_game,
    jumlah_diamond,
    harga,
  });
}

async function getTopup(page_number, page_size) {
  try {
    const totalhasil = await topup.countDocuments();
    const total = Math.ceil(totalhasil / page_size);
    const has_previous_page = page_number > 1;
    const has_next_page = page_number < total;

    const data = await topup
      .find({})
      .skip((page_number - 1) * page_size)
      .limit(page_size);

    return {
      page_number,
      page_size,
      total_pages: total,
      has_previous_page,
      has_next_page,
      data: data.map((topup) => ({
        id: topup.id,
        nama_game: topup.nama_game,
        jumlah_diamond: topup.jumlah_diamond,
        harga: topup.harga,
      })),
    };
  } catch (err) {
    throw new Error(err.message);
  }
}

async function updateTopup(id, nama_game, jumlah_diamond, harga) {
  return topup.updateOne(
    {
      id: id,
    },
    {
      $set: {
        nama_game: nama_game,
        jumlah_diamond: jumlah_diamond,
        harga: harga,
      },
    }
  );
}

async function getTop(id) {
  return topup.findById(id);
}

async function deleteTopup(id) {
  return topup.deleteOne({
    _id: id,
  });
}

module.exports = {
  createTopup,
  getTop,
  updateTopup,
  getTopup,
  deleteTopup,
};
