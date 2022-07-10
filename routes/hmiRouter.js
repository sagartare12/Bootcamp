const express = require('express');
const hmiController = require(`${__dirname}/../controllers/hmiController`);
const router = express.Router();

router
  .route('/:id')
  .get(hmiController.getHmiData)
  .patch(hmiController.updateHmiData);

router
  .route('/')

  .post(hmiController.createHmiData);

  module.exports = router;
  // ji