const { errorResponder, errorTypes } = require('../../../core/errors');
const authenticationServices = require('./authentication-service');

let loginAttempts = {};

/**
 * Handle login request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function login(request, response, next) {
  const { email, password } = request.body;

  try {
    if (loginAttempts[email]) {
      const lastAttempt = loginAttempts[email];
      const timeelapsed =
        (new Date() - lastAttempt.lastAttemptTime) / (1000 * 60);
      if (timeelapsed >= 30) {
        loginAttempts[email] = {
          failedAttempts: 0,
          lastAttemptTime: new Date(),
        };
      }
    } else {
      loginAttempts[email] = { failedAttempts: 0, lastAttemptTime: new Date() };
    }

    const limitLogin = loginAttempts[email].failedAttempts >= 5;

    if (limitLogin) {
      throw errorResponder(
        errorTypes.FORBIDDEN,
        'Too many failed login attempts. Please try again in 30 minutes'
      );
    }

    // Check login credentials
    const loginSuccess = await authenticationServices.checkLoginCredentials(
      email,
      password
    );

    if (!loginSuccess) {
      loginAttempts[email].failedAttempts++;
      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        `Wrong email or password, ${5 - loginAttempts[email].failedAttempts} chances left`
      );
    }

    loginAttempts[email] = { failedAttempts: 0, lastAttemptTime: new Date() };

    return response.status(200).json(loginSuccess);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
};
