const { id } = require('schema/lib/objecttools');
const { User } = require('../../../models');
const { email } = require('../../../models/users-schema');

/**
 * Get a list of users
 * @returns {Promise}
 */
async function getUsers(kueri, skip, limit) {
  return User.find(kueri).skip(skip).limited(limit);
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function getUser(id) {
  return User.findById(id);
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Hashed password
 * @returns {Promise}
 */
async function createUser(name, email, password) {
  return User.create({
    name,
    email,
    password,
  });
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {Promise}
 */
async function updateUser(id, name, email) {
  return User.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        name,
        email,
      },
    }
  );
}

/**
 * Delete a user
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function deleteUser(id) {
  return User.deleteOne({ _id: id });
}

/**
 * Get user by email to prevent duplicate email
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getUserByEmail(email) {
  return User.findOne({ email });
}

/**
 * Update user password
 * @param {string} id - User ID
 * @param {string} password - New hashed password
 * @returns {Promise}
 */
async function changePassword(id, password) {
  return User.updateOne({ _id: id }, { $set: { password } });
}
/**
 * Get paginated list of users
 * @param {number} pageNumber - Page number
 * @param {number} pageSize - Number of users per page
 * @param {string} sortBy - Sorting criteria
 * @param {string} search - Search query
 * @returns {Promise}
 */
async function pagiNasional(pNumber, pSize, forSearch, forSorting) {
  let searchField = null;
  let searchKey = '';

  if (forSearch && forSearch.includes(':')) {
    [searchField, searchKey] = search.split(':');
  }

  let searchQuery = {};

  if (searchField === 'name' || searchField === 'email') {
    searchQuery[searchField] = { $regex: searchKey, $options: 'i' };
  }

  let sortField = null;
  let sortOrder = '';

  if (!forSorting) {
    forSorting = 'email:asc';
  }

  if (forSorting && forSorting.includes(':')) {
    [sortField, sortOrder] = sort.split(':');
  }

  let sortOptions = {};

  if (!(sortField === 'name' || sortField === 'email')) {
    sortField = 'email';
    sortOrder = 'asc';
  }

  sortOptions[searchField] = sortOrder === 'desc' ? -1 : 1;

  const count = await query.countDocuments();

  const results = [];
  for (let i = 0; i < users.length; i += 1) {
    const user = count[i];
    results.map({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserByEmail,
  changePassword,
  pagiNasional,
};
