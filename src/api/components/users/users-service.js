const usersRepository = require('./users-repository');
const { hashPassword, passwordMatched } = require('../../../utils/password');

/**
 * Get list of users
 * @returns {Array}
 */
async function getUsers(pNumber, pSize, forSearch, forSorting) {
  const skip = (pNumber - 1) * pSize;
  const batas = pSize;

  let kueri = {};
  let Sort = {};

  const users = await usersRepository.getUsers(skip, batas, kueri, Sort);

  const awal = (pNumber - 1) * pSize;
  const akhir = pNumber * pSize;
  const sebelum = pNumber > 1 ? true : false;
  const sesudah = akhir < users.length;
  const results = users.slice(awal, akhir);
  const count = await Countusers();

  let fieldname = null;
  let searchKey = '';

  if (forSearch && forSearch.includes(':')) {
    [fieldname, searchKey] = forSearch.split(':');
  }

  // Apply search filter if provided
  if (fieldname === 'name' || fieldname === 'email') {
    kueri[fieldname] = { $regex: searchKey, $options: 'i' };
  }

  let fieldSort = null;
  let sortKey = '';

  if (!forSorting) {
    Sort = 'email: asc';
  }

  if (forSorting && forSorting.includes(':')) {
    [fieldSort, sortKey] = Sort.split(':');
  }

  if (!(fieldSort === 'name' || fieldSort === 'email')) {
    fieldSort = 'email';
    Sort[fieldSort] = 'asc';
  }

  Sort[fieldSort] = sortKey === 'desc' ? -1 : 1;
  if (fieldSort === 'name' || fieldSort === 'email') {
    Sort[fieldSort] = sortKey === 'desc' ? -1 : 1;
  } else {
    (Sort[fieldSort] = fieldSort === 'email'), sortKey === 'desc' ? -1 : 1;
  }

  const totalPages = Math.ceil(users.length / pSize);
  // Apply pagination and sorting

  const total = [];
  for (let i = 0; i < users.length; i += 1) {
    const user = results[i];
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

async function Countusers() {
  const count = await usersRepository.Countusers();
  return count;
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
  Countusers,
};
