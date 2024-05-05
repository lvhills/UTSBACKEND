const express = require('express');

const celebrate = require('../../../core/celebrate-wrappers');
const topupController = require('./topup-controller');
const topupValidator = require('./topup-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/topup', route);

  route.post(
    '/',
    celebrate(topupValidator.createTopup),
    topupController.createTopup
  );

  route.put(
    '/:id',
    celebrate(topupValidator.updateTopup),
    topupController.updateTopup
  );

  route.get('/', topupController.getTopup);

  route.delete('/:id', topupController.deleteTopup);
};
