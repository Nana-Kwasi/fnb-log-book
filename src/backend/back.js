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
  
  
  if (!telephone || telephone.trim() === '') {
    return res.status(400).json({ 
      error: 'Telephone number is required',
      exists: false
    });
  }

  try {
    console.log(`Checking if telephone exists: ${telephone}`);
    
    const testQuery = await pool.query('SELECT NOW()');
    console.log('Database connection successful');
    
   
    const result = await pool.query(
      'SELECT EXISTS(SELECT 1 FROM visitor_log WHERE telephone = $1) as "exists"', 
      [telephone]
    );
    
    console.log('Query result:', result.rows[0]);
    
    res.json({ 
      exists: result.rows[0].exists,
      message: result.rows[0].exists ? 'Telephone number already registered' : 'Telephone number is available'
    });
  } catch (err) {
    console.error('Error checking telephone:', err);
    res.status(500).json({ 
      error: 'Failed to check telephone number', 
      details: err.message,
      exists: false
    });
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
const createVisitorLog = async (req, res) => {
  const { date, timeIn, timeOut, department, company, picture, telephone, reason, purpose, name, branch,branchName // New field
  } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO visitor_log (date, timeIn, timeOut, department, company, picture, telephone, reason, purpose, name, branch,branchName) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
      [date, timeIn, timeOut, department, company, picture, telephone, reason, purpose, name, branch,branchName]
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
      'UPDATE visitor_log SET timeOut = $1 WHERE id = $2 RETURNING *',
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
};