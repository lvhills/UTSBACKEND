const { id } = require('schema/lib/objecttools');
const { User } = require('../../../models');
const { email } = require('../../../models/users-schema');

/**
 * Get a list of users
 * @returns {Promise}
 */
async function getUsers() {
  return User.find({});
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
async function pagiNasional(pNumber, pSize, forSorting, forSearch) {
  let query = User.find();

  // Apply search filter if provided
  if (forSearch) {
    query = query.find({
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ],
    });
  }

  // Count total number of users
  const count = await query.countDocuments();

  const totalPages = Math.ceil(count / pSize);

  // Calculate skip and limit for pagination
  const skip = (pNumber - 1) * pSize;
  const limit = pSize;

  // Apply pagination and sorting
  const users = await query.sort(forSorting).skip(skip).limit(limit).exec();

  const pageSebelum = pNumber > 1;
  const pageSesudah = pNumber < totalPages;
  return {
    page_number: pNumber,
    page_size: pSize,
    count,
    totalPages: totalPages,
    has_previous_page: pageSebelum,
    has_next_page: pageSesudah,
    data: users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
    })),
  };
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
