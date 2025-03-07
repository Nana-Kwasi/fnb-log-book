const express = require('express');
const router = express.Router();
const visitorsController = require('../controllers/visitorsLogsController');

// Visitor log routes
router.get('/', visitorsController.getAllVisitorLogs);
router.get('/by-phone', visitorsController.getVisitorLogsByPhoneNumber);
router.get('/:id', visitorsController.getVisitorLogById);
router.post('/', visitorsController.createVisitorLog);
router.put('/:id', visitorsController.updateVisitorLog);
router.delete('/:id', visitorsController.deleteVisitorLog);

// Department routes
router.get('/departments/all', visitorsController.getAllDepartments);
router.post('/departments/create', visitorsController.createDepartment);

// Branch routes
router.get('/branches/all', visitorsController.getAllBranches);
router.post('/branches/create', visitorsController.createBranch);

module.exports = router;