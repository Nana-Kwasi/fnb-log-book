which of the below apis is this http://localhost:5001/visitors/${selectedVisit.id


const pool = require('../db');

const getAllVisitorLogs = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM visitor_log');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

const getVisitorLogsByPhoneNumber = async (req, res) => {
  const { telephone } = req.query;
  try {
    const result = await pool.query('SELECT * FROM visitor_log WHERE telephone = $1', [telephone]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

const checkTelephoneExists = async (req, res) => {
  const { telephone } = req.params;
  try {
    console.log(Checking telephone: ${telephone});
    const result = await pool.query('SELECT EXISTS(SELECT 1 FROM visitor_log WHERE telephone = $1)', [telephone]);
    console.log('Database query result:', result.rows[0]);
    res.json({ 
      exists: result.rows[0].exists,
      message: result.rows[0].exists ? 'Telephone number already registered' : 'Telephone number is available'
    });
  } catch (err) {
    console.error('Error checking telephone:', err);
    res.status(500).json({ error: 'Failed to check telephone number' });
  }
};

const getVisitorLogById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM visitor_log WHERE id = $1', [id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

const getAllBranches = async (req, res) => {
  try {
    console.log("Fetching all unique branches");
    const result = await pool.query(
      'SELECT DISTINCT "branchName", branch FROM visitor_log WHERE "branchName" IS NOT NULL AND branch IS NOT NULL'
    );
    
    const branches = result.rows.map(row => ({
      branchName: row.branchname,
      branchCode: row.branch
    }));
    
    console.log(Found ${branches.length} unique branches);
    res.json(branches);
  } catch (err) {
    console.error("Database query error fetching branches:", err);
    res.status(500).send('Server error');
  }
};

const getVisitorLogsByBranchCode = async (req, res) => {
  const { branchCode } = req.query;
  
  if (!branchCode) {
    return res.status(400).json({ error: 'Branch code is required' });
  }
  
  try {
    console.log(Fetching visitor logs for branch code: ${branchCode});
    const result = await pool.query(
      'SELECT * FROM visitor_log WHERE branch = $1',
      [branchCode]
    );
    
    console.log(Found ${result.rows.length} visitor logs for branch code ${branchCode});
    res.json(result.rows);
  } catch (err) {
    console.error("Database query error fetching branch logs:", err);
    res.status(500).send('Server error');
  }
};

const createVisitorLog = async (req, res) => {
  const { date, timeIn, timeOut, department, company, picture, telephone, reason, purpose, name, branch, branchName } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO visitor_log (date, "timeIn", "timeOut", department, company, picture, telephone, reason, purpose, name, branch, "branchName") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *',
      [date, timeIn, timeOut, department, company, picture, telephone, reason, purpose, name, branch, branchName]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

const updateVisitorLog = async (req, res) => {
  const { id } = req.params;
  const { timeOut } = req.body;
  try {
    const result = await pool.query(
      'UPDATE visitor_log SET "timeOut" = $1 WHERE id = $2 RETURNING *',
      [timeOut, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating visitor log:', err);
    res.status(500).send('Server error');
  }
};

const deleteVisitorLog = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM visitor_log WHERE id = $1', [id]);
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

module.exports = {
  getAllVisitorLogs,
  getVisitorLogsByPhoneNumber,
  getVisitorLogById,
  createVisitorLog,
  updateVisitorLog,
  deleteVisitorLog,
  checkTelephoneExists,
  getAllBranches,
  getVisitorLogsByBranchCode
};