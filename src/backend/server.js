const express = require('express');
const router = express.Router();
const visitorsController = require('../controllers/visitorsLogsController');

// Add a route logger middleware
router.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Visitor log routes
router.get('/', visitorsController.getAllVisitorLogs);
router.get('/by-phone', visitorsController.getVisitorLogsByPhoneNumber);
router.get('/:id', visitorsController.getVisitorLogById);
router.post('/', visitorsController.createVisitorLog);
router.put('/:id', visitorsController.updateVisitorLog);
router.delete('/:id', visitorsController.deleteVisitorLog);

// Department routes - add both paths to support both frontend versions
router.get('/departments/all', visitorsController.getAllDepartments);
router.post('/departments/create', visitorsController.createDepartment);
// Add these routes to match the React component's original endpoints
router.get('/departments', visitorsController.getAllDepartments);
router.post('/departments', visitorsController.createDepartment);

// Branch routes - add both paths to support both frontend versions
router.get('/branches/all', visitorsController.getAllBranches);
router.post('/branches/create', visitorsController.createBranch);
// Add these routes to match the React component's original endpoints
router.get('/branches', visitorsController.getAllBranches);
router.post('/branches', visitorsController.createBranch);

module.exports = router;