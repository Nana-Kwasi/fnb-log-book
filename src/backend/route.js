const express = require('express');
const router = express.Router();
const visitorsController = require('../controllers/visitorsLogsController');

// Make sure this is the correct path to your controller
// If the file is in a different location, adjust the path

// GET endpoint to check if telephone exists
// This MUST come before any routes with path parameters like :id
router.get('/check-telephone/:telephone', visitorsController.checkTelephoneExists);

// Route to get all visitor logs
router.get('/', visitorsController.getAllVisitorLogs);

// Other existing routes
router.get('/by-phone', visitorsController.getVisitorLogsByPhoneNumber);
router.get('/:id', visitorsController.getVisitorLogById);
router.post('/', visitorsController.createVisitorLog);
router.put('/:id', visitorsController.updateVisitorLog);
router.delete('/:id', visitorsController.deleteVisitorLog);

module.exports = router;