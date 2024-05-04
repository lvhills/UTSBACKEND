const usersRepository = require('./users-repository');
const { hashPassword, passwordMatched } = require('../../../utils/password');

/**
 * Get list of users
 * @returns {Array}
 */
async function getUsers(pNumber, pSize, forSearch, forSorting) {
  const users = await usersRepository.getUsers(
    pNumber,
    pSize,
    forSearch,
    forSorting
  );

  const awal = (pNumber - 1) * pSize;
  const akhir = pNumber * pSize;
  const pageSebelum = pNumber > 1 ? true : false;
  const pageSesudah = akhir < users.length;
  const results = users.slice(awal, akhir);
  const count = users.length;

  const skip = (pNumber - 1) * pSize;
  const limit = pSize;

  let fieldName = null;
  let searchKey = '';

  if (forSearch) {
    [fieldName, searchKey] = forSearch.split(':');
  }

  if (fieldName === 'name' || fieldName === 'email') {
    const kueri = {
      // Menggunakan 'kueri' untuk pencarian
      [fieldName]: {
        $regex: searchKey,
        $options: 'i',
      },
    };

    // Loop sebanyak total pengguna yang cocok dengan kriteria pencarian
    const results = [];
    for (let i = 0; i < users.length; i += 1) {
      const user = users[i]; // Mengganti 'hasil' dengan 'users'
      results.push({
        id: user.id,
        name: user.name,
        email: user.email,
      });

      return {
        page_number: pNumber,
        page_size: pSize,
        count,
        has_previous_page: pageSebelum,
        has_next_page: pageSesudah,
        data: results,
      };
    }
  }

  return results;
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

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  emailIsRegistered,
  checkPassword,
  changePassword,
};
