const express = require('express');
const router = express.Router();
const visitorsController = require('../controllers/visitorsLogsController');

// Add the new telephone check endpoint - this must come before the /:id route
router.get('/check-telephone/:telephone', visitorsController.checkTelephoneExists);

// Existing routes
router.get('/by-phone', visitorsController.getVisitorLogsByPhoneNumber);
router.get('/:id', visitorsController.getVisitorLogById);
router.post('/', visitorsController.createVisitorLog);
router.put('/:id', visitorsController.updateVisitorLog);
router.delete('/:id', visitorsController.deleteVisitorLog);

module.exports = router;