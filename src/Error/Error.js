// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// function FirstTime() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: '',
//     reason: '',
//     department: '',
//     branch: '',
//     purpose: '',
//     telephone: '',
//     company: '',
//     picture: null,
//   });

//   const departments = [
//     'Select Department',
//     'Human Resources',
//     'Finance',
//     'Information Technology',
//     'Operations',
//     'Marketing',
//     'Legal',
//     'Customer Service',
//     'Risk Management',
//     'Compliance',
//     'Treasury'
//   ];

//   const branches = [
//     'Select Branch',
//     'Main Branch',
//     'Downtown Branch',
//     'West End Branch',
//     'East Side Branch',
//     'North Branch',
//     'South Branch',
//     'Central Branch',
//     'Business District Branch',
//     'Industrial Area Branch',
//     'Suburban Branch'
//   ];

//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [telephoneChecked, setTelephoneChecked] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
    
//     // Reset telephone checked status when telephone is changed
//     if (name === 'telephone') {
//       setTelephoneChecked(false);
//     }
//   };

//   // Function to check if telephone exists in database
//   const checkTelephoneExists = async (telephone) => {
//     try {
//       const response = await fetch(`http://localhost:5001/visitors/check-telephone/${telephone}`);
      
//       if (!response.ok) {
//         throw new Error('Failed to check telephone number. Please try again.');
//       }
      
//       const data = await response.json();
//       return data.exists;
//     } catch (error) {
//       console.error("Error checking telephone:", error);
//       setError(error.message);
//       return false;
//     }
//   };

//   // Function to validate telephone before proceeding with form
//   const validateTelephone = async () => {
//     if (!formData.telephone) {
//       setError('Please enter a telephone number');
//       return false;
//     }
    
//     setIsLoading(true);
    
//     try {
//       const exists = await checkTelephoneExists(formData.telephone);
      
//       if (exists) {
//         alert('This telephone number is already registered. Redirecting to the "Been Here Before" login screen.');
//         navigate('/returning-visitor');
//         return false;
//       }
      
//       setTelephoneChecked(true);
//       setError('');
//       return true;
//     } catch (error) {
//       console.error("Validation error:", error);
//       return false;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handlePictureCapture = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (file.size > 5 * 1024 * 1024) {
//         setError('File size must be less than 5MB.');
//         return;
//       }

//       if (!['image/jpeg', 'image/png'].includes(file.type)) {
//         setError('Only JPEG and PNG formats are supported.');
//         return;
//       }

//       const reader = new FileReader();
//       reader.onloadend = () => setFormData({ ...formData, picture: reader.result });
//       reader.onerror = () => setError('Failed to process the image. Please try again.');
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Check if telephone has already been validated
//     if (!telephoneChecked) {
//       const isValid = await validateTelephone();
//       if (!isValid) return;
//     }

//     if (!formData.picture) {
//       setError('Please take a picture before submitting.');
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const response = await fetch('http://localhost:5001/visitors', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           name: formData.name,
//           reason: formData.reason,
//           department: formData.department,
//           branch: formData.branch,
//           purpose: formData.purpose,
//           telephone: formData.telephone,
//           company: formData.company,
//           picture: formData.picture,
//           date: new Date().toISOString().split('T')[0],
//           timeIn: new Date().toTimeString().split(' ')[0],
//         }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to submit the form. Please try again later.');
//       }

//       alert('Thank you for Visiting First National Bank!');
//       navigate('/');
//     } catch (error) {
//       console.error("Error submitting data to the server:", error);
//       setError(error.message);
//     }

//     setIsLoading(false);
//   };

//   // Add blur event handler for telephone field
//   const handleTelephoneBlur = async () => {
//     if (formData.telephone) {
//       await validateTelephone();
//     }
//   };

//   return (
//     <div style={{ backgroundColor: '#0F384A' }}>
//       <div style={styles.formContainer}>
//         <div style={styles.logoContainer}>
//           <img src="fnb back.png" alt="FNB Logo" style={styles.logo} />
//           <h2 style={styles.logoText}>First National Bank</h2>
//         </div>
//         <header style={styles.formHeader}>
//           <h1>Welcome Visitor</h1>
//           <p>Please fill in the form below for your visit:</p>
//         </header>

//         <form onSubmit={handleSubmit} style={styles.form}>
//           {renderInput('Name', 'name', 'text', formData, handleChange)}
//           {renderInput('Reason to See', 'reason', 'text', formData, handleChange, false)}
//           <div style={styles.formGroup}>
//             <label style={styles.label}>Department:</label>
//             <select
//               name="department"
//               value={formData.department}
//               onChange={handleChange}
//               style={styles.input}
//               required
//             >
//               {departments.map((dept, index) => (
//                 <option key={index} value={index === 0 ? '' : dept}>
//                   {dept}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div style={styles.formGroup}>
//             <label style={styles.label}>Branch:</label>
//             <select
//               name="branch"
//               value={formData.branch}
//               onChange={handleChange}
//               style={styles.input}
//               required
//             >
//               {branches.map((branch, index) => (
//                 <option key={index} value={index === 0 ? '' : branch}>
//                   {branch}
//                 </option>
//               ))}
//             </select>
//           </div>
//           {renderInput('Purpose', 'purpose', 'text', formData, handleChange, false)}
//           <div style={styles.formGroup}>
//             <label style={styles.label}>Telephone:</label>
//             <input
//               type="tel"
//               name="telephone"
//               value={formData.telephone}
//               onChange={handleChange}
//               onBlur={handleTelephoneBlur}
//               required
//               style={styles.input}
//             />
//           </div>
//           {renderInput('Company', 'company', 'text', formData, handleChange)}

//           <div style={styles.formGroup}>
//             <label style={styles.label}>Take a Picture:</label>
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handlePictureCapture}
//               style={styles.inputFile}
//             />
//           </div>
//           {error && <div style={styles.error}>{error}</div>}
//           <button type="submit" style={styles.submitButton} disabled={isLoading}>
//             {isLoading ? "Submitting..." : "Submit"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// const renderInput = (label, name, type, formData, handleChange, required = true) => (
//   <div style={styles.formGroup} key={name}>
//     <label style={styles.label}>{label}:</label>
//     <input
//       type={type}
//       name={name}
//       value={formData[name]}
//       onChange={handleChange}
//       required={required}
//       style={styles.input}
//     />
//   </div>
// );



PS C:\Users\f8877557\file-backend> cd new-backend          
PS C:\Users\f8877557\file-backend\new-backend> node server.js          
Server is running on port 5001
Health check available at: http://localhost:5001/health
Check telephone endpoint: http://localhost:5001/visitors/check-telephone/:telephone
Connected to the database
2025-03-11T13:29:43.176Z - POST /visitors
error: invalid input syntax for type time: ""
    at C:\Users\f8877557\file-backend\node_modules\pg-pool\index.js:45:11
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async createVisitorLog (C:\Users\f8877557\file-backend\new-backend\controllers\visitorsLogsController.js:175:20) {
  length: 138,
  severity: 'ERROR',
  code: '22007',
  detail: undefined,
  hint: undefined,
  position: undefined,
  internalPosition: undefined,
  internalQuery: undefined,
  where: "unnamed portal parameter $3 = ''",
  schema: undefined,
  table: undefined,
  column: undefined,
  dataType: undefined,
  constraint: undefined,
  file: 'datetime.c',
  line: '4051',
  routine: 'DateTimeParseError'
}
