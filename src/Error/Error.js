const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const visitorsRouter = require('./route/visitors');
const visitorsController = require('./controllers/visitorsLogsController'); // Import controller directly

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' })); // Increase the limit as needed
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Add logging middleware for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Visitor log routes under /visitors
app.use('/visitors', visitorsRouter);

// Add department and branch routes at root level to match frontend requests
app.get('/departments', visitorsController.getAllDepartments);
app.post('/departments/create', visitorsController.createDepartment);

app.get('/branches', visitorsController.getAllBranches);
app.post('/branches/create', visitorsController.createBranch);

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});