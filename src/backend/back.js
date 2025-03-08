const pool = require('../db');

const getAllVisitorLogs = async (req, res) => {
  try {
    console.log('Getting all visitor logs');
    const result = await pool.query('SELECT * FROM visitor_log');
    console.log(`Retrieved ${result.rows.length} visitor logs`);
    res.json(result.rows);
  } catch (err) {
    console.error('Error in getAllVisitorLogs:', err);
    res.status(500).send('Server error: ' + err.message);
  }
};

const getVisitorLogsByPhoneNumber = async (req, res) => {
  const { telephone } = req.query;
  console.log('Getting visitor logs for phone number:', telephone);
  
  try {
    const result = await pool.query('SELECT * FROM visitor_log WHERE telephone = $1', [telephone]);
    console.log(`Retrieved ${result.rows.length} visitor logs for phone number ${telephone}`);
    res.json(result.rows);
  } catch (err) {
    console.error('Error in getVisitorLogsByPhoneNumber:', err);
    res.status(500).send('Server error: ' + err.message);
  }
};

const getVisitorLogById = async (req, res) => {
  const { id } = req.params;
  console.log('Getting visitor log with ID:', id);
  
  try {
    const result = await pool.query('SELECT * FROM visitor_log WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      console.log(`No visitor log found with ID ${id}`);
      return res.status(404).send('Visitor log not found');
    }
    console.log(`Retrieved visitor log with ID ${id}`);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error in getVisitorLogById:', err);
    res.status(500).send('Server error: ' + err.message);
  }
};

const createVisitorLog = async (req, res) => {
  const { date, timeIn, timeOut, department, company, picture, telephone, reason, purpose, name, branch } = req.body;
  console.log('Creating new visitor log for:', name);
  console.log('Request body:', { 
    date, timeIn, timeOut, department, company, 
    pictureProvided: !!picture, telephone, reason, purpose, name, branch 
  });
  
  try {
    const result = await pool.query(
      'INSERT INTO visitor_log (date, timeIn, timeOut, department, company, picture, telephone, reason, purpose, name, branch) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
      [date, timeIn, timeOut, department, company, picture, telephone, reason, purpose, name, branch]
    );
    console.log(`Created visitor log with ID: ${result.rows[0].id}`);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error in createVisitorLog:', err);
    res.status(500).send('Server error: ' + err.message);
  }
};

const updateVisitorLog = async (req, res) => {
  const { id } = req.params;
  const { timeOut } = req.body;
  console.log(`Updating visitor log ${id} with timeOut:`, timeOut);
  
  try {
    const result = await pool.query(
      'UPDATE visitor_log SET timeOut = $1 WHERE id = $2 RETURNING *',
      [timeOut, id]
    );
    if (result.rows.length === 0) {
      console.log(`No visitor log found with ID ${id} for update`);
      return res.status(404).send('Visitor log not found');
    }
    console.log(`Updated visitor log with ID ${id}`);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error in updateVisitorLog:', err);
    res.status(500).send('Server error: ' + err.message);
  }
};

const deleteVisitorLog = async (req, res) => {
  const { id } = req.params;
  console.log('Deleting visitor log with ID:', id);
  
  try {
    const result = await pool.query('DELETE FROM visitor_log WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      console.log(`No visitor log found with ID ${id} for deletion`);
      return res.status(404).send('Visitor log not found');
    }
    console.log(`Deleted visitor log with ID ${id}`);
    res.sendStatus(204);
  } catch (err) {
    console.error('Error in deleteVisitorLog:', err);
    res.status(500).send('Server error: ' + err.message);
  }
};

const getAllDepartments = async (req, res) => {
  console.log('Getting all departments');
  try {
    console.log('Executing query: SELECT * FROM departments ORDER BY name');
    const result = await pool.query('SELECT * FROM departments ORDER BY name');
    console.log(`Retrieved ${result.rows.length} departments`);
    console.log('Departments:', result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error('Error in getAllDepartments:', err);
    console.error('SQL Error details:', err.code, err.detail, err.hint, err.position);
    res.status(500).send('Server error: ' + err.message);
  }
};

const createDepartment = async (req, res) => {
  const { name } = req.body;
  console.log('Creating new department:', name);
  
  if (!name || name.trim() === '') {
    console.log('Department name is empty or missing');
    return res.status(400).send('Department name is required');
  }
  
  try {
    console.log('Executing query: INSERT INTO departments (name, timestamp) VALUES ($1, NOW()) RETURNING *');
    console.log('Parameters:', [name]);
    
    const result = await pool.query(
      'INSERT INTO departments (name, timestamp) VALUES ($1, NOW()) RETURNING *',
      [name]
    );
    console.log('Department created successfully:', result.rows[0]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error in createDepartment:', err);
    console.error('SQL Error details:', err.code, err.detail, err.hint, err.position);
    res.status(500).send('Server error: ' + err.message);
  }
};

const getAllBranches = async (req, res) => {
  console.log('Getting all branches');
  try {
    console.log('Executing query: SELECT * FROM branches ORDER BY name');
    const result = await pool.query('SELECT * FROM branches ORDER BY name');
    console.log(`Retrieved ${result.rows.length} branches`);
    console.log('Branches:', result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error('Error in getAllBranches:', err);
    console.error('SQL Error details:', err.code, err.detail, err.hint, err.position);
    res.status(500).send('Server error: ' + err.message);
  }
};

const createBranch = async (req, res) => {
  const { name, code } = req.body;
  console.log('Creating new branch:', { name, code });
  
  if (!name || name.trim() === '' || !code || code.trim() === '') {
    console.log('Branch name or code is empty or missing');
    return res.status(400).send('Branch name and code are required');
  }
  
  try {
    console.log('Executing query: INSERT INTO branches (name, code, timestamp) VALUES ($1, $2, NOW()) RETURNING *');
    console.log('Parameters:', [name, code]);
    
    const result = await pool.query(
      'INSERT INTO branches (name, code, timestamp) VALUES ($1, $2, NOW()) RETURNING *',
      [name, code]
    );
    console.log('Branch created successfully:', result.rows[0]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error in createBranch:', err);
    console.error('SQL Error details:', err.code, err.detail, err.hint, err.position);
    res.status(500).send('Server error: ' + err.message);
  }
};

module.exports = {
  getAllVisitorLogs,
  getVisitorLogsByPhoneNumber,
  getVisitorLogById,
  createVisitorLog,
  updateVisitorLog,
  deleteVisitorLog,
  getAllDepartments,
  createDepartment,
  getAllBranches,
  createBranch
};