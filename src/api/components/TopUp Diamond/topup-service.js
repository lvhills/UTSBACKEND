const topupRepository = require('./topup-repository');

async function createTopup(nama_game, jumlah_diamond, harga) {
  try {
    await topupRepository.createTopup(nama_game, jumlah_diamond, harga);
    return true; // Return true on success
  } catch (err) {
    console.error(err); // Log the error
    return null; // Return null on failure
  }
}

async function getTopup(page_number, page_size) {
  try {
    const topup = await topupRepository.getTopup(page_number, page_size);
    return topup;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function updateTopup(id, nama_game, jumlah_diamond, harga) {
  const topup = await topupRepository.getTopup(id);

  if (!topup) {
    return null;
  }

  try {
    await topupRepository.updateTopup(id, nama_game, jumlah_diamond, harga);
    return true;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function deleteTopup(id) {
  const topup = await topupRepository.getTopup(id);

  if (!topup) {
    return null;
  }

  try {
    await topupRepository.deleteTopup(id);
    return true;
  } catch (err) {
    console.error(err);
    return null;
  }
}

module.exports = {
  getTopup,
  createTopup,
  updateTopup,
  deleteTopup,
};
