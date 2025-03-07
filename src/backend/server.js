const express = require('express');
const router = express.Router();
const visitorsController = require('../controllers/visitorsLogsController');

router.get('/by-phone', visitorsController.getVisitorLogsByPhoneNumber);
router.get('/:id', visitorsController.getVisitorLogById);
router.post('/', visitorsController.createVisitorLog);
router.put('/:id', visitorsController.updateVisitorLog);
router.delete('/:id', visitorsController.deleteVisitorLog);

module.exports = router;