const usersRepository = require('./users-repository');
const { hashPassword, passwordMatched } = require('../../../utils/password');

/**
 * Get list of users
 * @returns {Array}
 */
async function getUsers(pNumber, pSize, forSearch, forSorting) {
  const users = await usersRepository.getUsers();

  const awal = (pNumber - 1) * pSize;
  const akhir = pNumber * pSize;
  const sebelum = pNumber > 1 ? true : false;
  const sesudah = akhir < users.length;
  const results = users.slice(awal, akhir);
  const count = users.length;

  let fieldname = null;
  let searchKey = '';

  if (forSearch && forSearch.includes(':')) {
    [fieldname, searchKey] = forSearch.split(':');
  }

  let kueri = {};

  // Apply search filter if provided
  if (fieldname === 'name' || fieldname === 'email') {
    kueri[fieldname] = { $regex: searchKey, $options: 'i' };
  }

  // Count total number of users

  const totalPages = Math.ceil(count / pSize);

  // Calculate skip and limit for pagination
  const skip = (pNumber - 1) * pSize;
  const limit = pSize;

  // Apply pagination and sorting

  const total = [];
  for (let i = 0; i < users.length; i += 1) {
    const user = users[i];
    total.push({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }

  return {
    page_number: pNumber,
    page_size: pSize,
    count,
    total_pages: totalPages,
    has_previous_page: sebelum,
    has_next_page: sesudah,
    data: total.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
    })),
  };
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Object}
 */
async function getUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {boolean}
 */
async function createUser(name, email, password) {
  // Hash password
  const hashedPassword = await hashPassword(password);

  try {
    await usersRepository.createUser(name, email, hashedPassword);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {boolean}
 */
async function updateUser(id, name, email) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.updateUser(id, name, email);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {boolean}
 */
async function deleteUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.deleteUser(id);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Check whether the email is registered
 * @param {string} email - Email
 * @returns {boolean}
 */
async function emailIsRegistered(email) {
  const user = await usersRepository.getUserByEmail(email);

  if (user) {
    return true;
  }

  return false;
}

/**
 * Check whether the password is correct
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function checkPassword(userId, password) {
  const user = await usersRepository.getUser(userId);
  return passwordMatched(password, user.password);
}

/**
 * Change user password
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function changePassword(userId, password) {
  const user = await usersRepository.getUser(userId);

  // Check if user not found
  if (!user) {
    return null;
  }

  const hashedPassword = await hashPassword(password);

  const changeSuccess = await usersRepository.changePassword(
    userId,
    hashedPassword
  );

  if (!changeSuccess) {
    return null;
  }

  return true;
}

async function paginasional(pNumber, pSize, forSorting, forSearch) {
  const users = await usersRepository.getUsers(
    pNumber,
    pSize,
    forSorting,
    forSearch
  );

  const awal = (pNumber - 1) * pSize;
  const akhir = pNumber * pSize;
  const pageSebelum = pNumber > 1 ? true : false;
  const pageSesudah = akhir < users.length;
  const results = users.slice(awal, akhir);
  const count = users.length;

  return {
    page_number: pNumber,
    page_size: pSize,
    count,
    has_previous_page: pageSebelum,
    has_next_page: pageSesudah,
    data: results,
  };
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  emailIsRegistered,
  checkPassword,
  changePassword,
  paginasional,
};
