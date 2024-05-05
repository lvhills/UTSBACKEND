const express = require('express');

const authentication = require('./components/authentication/authentication-route');
const users = require('./components/users/users-route');
const topup = require('./components/TopUp Diamond/topup-route');

module.exports = () => {
  const app = express.Router();

  authentication(app);
  users(app);
  topup(app);

  return app;
};
