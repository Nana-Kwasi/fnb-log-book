// import React, { useState, useEffect } from 'react';
// import { getFirestore, doc, setDoc } from "firebase/firestore";
// import app from '../Config';
// import { v4 as uuidv4 } from 'uuid';

// function FirstTime() {
//   const db = getFirestore(app);

//   const [formData, setFormData] = useState({
//     name: '',
//     reason: '',
//     department: '',
//     purpose: '',
//     telephone: '',
//     company: '',
//     timeOut: '',
//     picture: null,
//     id: '',
//   });

//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [showTimeoutForm, setShowTimeoutForm] = useState(false);

//   useEffect(() => {
//     const savedState = localStorage.getItem('showTimeoutForm');
//     const savedFormData = localStorage.getItem('formData');

//     if (savedState === 'true' && savedFormData) {
//       try {
//         setFormData(JSON.parse(savedFormData));
//         setShowTimeoutForm(true);
//       } catch {
//         console.error('Error parsing formData from localStorage');
//       }
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handlePictureCapture = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (file.size > 5 * 1024 * 1024) { // Limit increased to 5MB
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

//     if (!formData.picture) {
//       setError('Please take a picture before submitting.');
//       return;
//     }

//     setIsLoading(true);
//     const entryId = uuidv4();
//     const now = new Date();
//     const formattedDate = now.toLocaleDateString();
//     const formattedTime = now.toLocaleTimeString();

//     const submissionData = {
//       ...formData,
//       date: formattedDate,
//       timeIn: formattedTime,
//       id: entryId,
//     };

//     try {
//       await setDoc(doc(db, "VisitorEntries", entryId), submissionData);
//       alert('Form submitted successfully!');
//       setFormData({ ...formData, id: entryId });
//       setShowTimeoutForm(true);

//       localStorage.setItem('showTimeoutForm', 'true');
//       localStorage.setItem('formData', JSON.stringify({ ...formData, id: entryId }));
//     } catch (error) {
//       console.error("Error submitting data to Firestore:", error);
//       setError('Failed to submit the form. Please try again later.');
//     }

//     setIsLoading(false);
//   };

//   const handleTimeoutSubmit = async () => {
//     if (!formData.timeOut) {
//       alert('Please enter the time out before submitting.');
//       return;
//     }

//     setIsLoading(true);

//     try {
//       await setDoc(
//         doc(db, "VisitorEntries", formData.id),
//         { timeOut: formData.timeOut },
//         { merge: true }
//       );

//       alert('Timeout recorded successfully! Thank you for visiting us.');
//       setShowTimeoutForm(false);
//       setFormData({
//         name: '',
//         reason: '',
//         department: '',
//         purpose: '',
//         telephone: '',
//         company: '',
//         timeOut: '',
//         picture: null,
//         id: '',
//       });

//       localStorage.removeItem('showTimeoutForm');
//       localStorage.removeItem('formData');
//     } catch (error) {
//       console.error("Error submitting timeout to Firestore:", error);
//       alert('An error occurred while recording timeout.');
//     } finally {
//       setIsLoading(false);
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

//         {!showTimeoutForm && (
//           <form onSubmit={handleSubmit} style={styles.form}>
//             {renderInput('Name', 'name', 'text', formData, handleChange)}
//             {renderInput('Reason to See', 'reason', 'text', formData, handleChange, false)}
//             {renderInput('Department', 'department', 'text', formData, handleChange, false)}
//             {renderInput('Purpose', 'purpose', 'text', formData, handleChange, false)}
//             {renderInput('Telephone', 'telephone', 'tel', formData, handleChange)}
//             {renderInput('Company', 'company', 'text', formData, handleChange)}

//             <div style={styles.formGroup}>
//               <label style={styles.label}>Take a Picture:</label>
//               <input
//   type="file"
//   accept="image/*"
//   onChange={handlePictureCapture}
//   style={styles.inputFile}
// />

//             </div>
//             {error && <div style={styles.error}>{error}</div>}
//             <button type="submit" style={styles.submitButton} disabled={isLoading}>
//               {isLoading ? "Submitting..." : "Submit"}
//             </button>
//           </form>
//         )}

//         {showTimeoutForm && (
//           <div style={styles.timeoutForm}>
//             <h2 style={{ color: 'red' }}>Please record your Time Out when you are leaving:</h2>
//             {renderInput('Time Out', 'timeOut', 'time', formData, handleChange)}
//             <button
//               onClick={handleTimeoutSubmit}
//               style={styles.submitButton}
//               disabled={isLoading}
//             >
//               {isLoading ? "Submitting..." : "Submit Time Out"}
//             </button>
//           </div>
//         )}
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

// const styles = {
//   formContainer: {
//     maxWidth: '100%',
//     margin: '20px auto',
//     padding: '20px',
//     backgroundColor: '#f0f4ff',
//     borderRadius: '15px',
//     boxShadow: '0 12px 24px rgba(0, 0, 0, 0.3)',
//     width: '90%',
//   },
//   logoContainer: {
//     textAlign: 'center',
//     marginBottom: '20px',
//   },
//   logo: {
//     width: '80px',
//     height: '80px',
//     borderRadius: '50%',
//   },
//   logoText: {
//     fontSize: '20px',
//     fontWeight: 'bold',
//     color: '#003366',
//     marginTop: '10px',
//   },
//   formHeader: {
//     textAlign: 'center',
//     marginBottom: '20px',
//     color: '#003366',
//   },
//   form: {
//     display: 'flex',
//     flexDirection: 'column',
//   },
//   formGroup: {
//     marginBottom: '15px',
//   },
//   label: {
//     display: 'block',
//     marginBottom: '6px',
//     fontWeight: 'bold',
//     color: '#046063',
//   },
//   input: {
//     width: '100%',
//     padding: '10px',
//     borderRadius: '8px',
//     border: '1px solid #d3d3d3',
//     fontSize: '16px',
//     outline: 'none',
//   },
//   inputFile: {
//     marginTop: '10px',
//     fontSize: '16px',
//     border: 'none',
//   },
//   submitButton: {
//     backgroundColor: '#007bff',
//     color: '#fff',
//     padding: '12px',
//     borderRadius: '10px',
//     border: 'none',
//     cursor: 'pointer',
//     fontSize: '18px',
//     marginTop: '20px',
//   },
//   picturePreview: {
//     marginTop: '20px',
//     textAlign: 'center',
//   },
//   previewImage: {
//     maxWidth: '100%',
//     height: 'auto',
//     borderRadius: '15px',
//     marginTop: '15px',
//   },
//   error: {
//     color: 'red',
//     marginBottom: '20px',
//   },
//   prompt: {
//     marginTop: '20px',
//     padding: '15px',
//     backgroundColor: '#ffeeba',
//     border: '1px solid #f5c6cb',
//     borderRadius: '10px',
//     textAlign: 'center',
//   },
//   promptButton: {
//     margin: '5px',
//     padding: '10px 20px',
//     backgroundColor: '#28a745',
//     color: '#fff',
//     border: 'none',
//     borderRadius: '5px',
//     cursor: 'pointer',
//     fontSize: '16px',
//   },
//   goodbyeMessage: {
//     marginTop: '20px',
//     padding: '15px',
//     backgroundColor: '#d4edda',
//     border: '1px solid #c3e6cb',
//     borderRadius: '10px',
//     textAlign: 'center',
//     color: '#155724',
//     fontWeight: 'bold',
//   },
// };

// export default FirstTime;


// import React, { useState, useEffect } from 'react';
// import { getFirestore, doc, setDoc, collection, getDocs, query, where, getDoc } from "firebase/firestore";
// import app from '../Config';
// import { v4 as uuidv4 } from 'uuid';
// import { useNavigate } from 'react-router-dom'; // Add this import


// function FirstTime() {
//   const db = getFirestore(app);
//   const navigate = useNavigate()
//   const [formData, setFormData] = useState({
//     name: '',
//     reason: '',
//     department: '',
//     purpose: '',
//     telephone: '',
//     company: '',
//     timeOut: '',
//     picture: null,
//     id: '',
//   });

//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [showTimeoutForm, setShowTimeoutForm] = useState(false);
//   const [lastFourDigits, setLastFourDigits] = useState('');
//   const [timeRemaining, setTimeRemaining] = useState(120); // 2 minutes
//   const [showCodeInput, setShowCodeInput] = useState(false);
//   const [codeInput, setCodeInput] = useState('');
//   const [verifiedUser, setVerifiedUser] = useState(null);

//   useEffect(() => {
//     const savedState = localStorage.getItem('showTimeoutForm');
//     const savedFormData = localStorage.getItem('formData');

//     if (savedState === 'true' && savedFormData) {
//       try {
//         const parsedData = JSON.parse(savedFormData);
//         setFormData(parsedData);
//         setLastFourDigits(parsedData.id.slice(-4));
//         setShowTimeoutForm(true);
//       } catch {
//         console.error('Error parsing formData from localStorage');
//       }
//   }, []);

//   useEffect(() => {
//     let timer;
//     if (lastFourDigits && timeRemaining > 0) {
//       timer = setInterval(() => {
//         setTimeRemaining(prev => {
//           if (prev <= 1) {
//             clearInterval(timer);
//             setLastFourDigits('');
//             setShowCodeInput(true);
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);
//     }
//     return () => clearInterval(timer);
//   }, [lastFourDigits]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handlePictureCapture = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (file.size > 5 * 1024 * 1024) { // 5MB limit
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

//     if (!formData.picture) {
//         setError('Please take a picture before submitting.');
//         return;
//     }

//     setIsLoading(true);

//     try {
//         // Check if the telephone number has been registered before
//         const querySnapshot = await getDocs(query(collection(db, "VisitorEntries"), where("telephone", "==", formData.telephone)));

//         if (!querySnapshot.empty) {
//             setError('This Phone number has been used to check in before. Please click "Been Here Before" on the home page to log in with your number.');
//             setIsLoading(false);
//             return;
//         }

//         // Proceed with form submission if number is new
//         const entryId = uuidv4();
//         const now = new Date();
//         const formattedDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
//         const formattedTime = now.toTimeString().split(' ')[0]; // HH:mm:ss

//         const submissionData = {
//             name: formData.name,
//             reason: formData.reason,
//             department: formData.department,
//             purpose: formData.purpose,
//             telephone: formData.telephone,
//             company: formData.company,
//             date: formattedDate,
//             timeIn: formattedTime,
//             id: entryId,
//         };

//         await setDoc(doc(db, "VisitorEntries", entryId), submissionData);
//         alert('Form submitted successfully!');
        
//         // Set last four digits and start timer
//         const lastFour = entryId.slice(-4);
//         setLastFourDigits(lastFour);
//         setTimeRemaining(120);
//         setShowTimeoutForm(true);

//         localStorage.setItem('showTimeoutForm', 'true');
//         localStorage.setItem('formData', JSON.stringify({ ...formData, id: entryId }));
//     } catch (error) {
//         console.error("Error submitting data to Firestore:", error);
//         setError('Failed to submit the form. Please try again later.');
//     }

//     setIsLoading(false);
//   };

//   const handleCodeVerification = async () => {
//     if (codeInput.length !== 4) {
//       alert('Please enter a 4-digit code');
//       return;
//     }

//     try {
//       // Query to find the user with the matching ID ending with the code
//       const q = query(
//         collection(db, "VisitorEntries"), 
//         where("id", ">=", ""), 
//         where("id", "<=", "zzzzzzz")
//       );
      
//       const querySnapshot = await getDocs(q);
      
//       const matchedUser = querySnapshot.docs.find(doc => 
//         doc.data().id.slice(-4) === codeInput
//       );

//       if (matchedUser) {
//         setVerifiedUser(matchedUser.data());
//         setShowCodeInput(false);
//       } else {
//         alert('No matching user found. Please check the code.');
//       }
//     } catch (error) {
//       console.error("Error verifying code:", error);
//       alert('An error occurred while verifying the code.');
//     }
//   };

//   const handleTimeoutSubmit = async () => {
//     if (!formData.timeOut) {
//         alert('Please enter the time out before submitting.');
//         return;
//     }

//     setIsLoading(true);

//     try {
//         const now = new Date();
//         const formattedTimeOut = formData.timeOut || now.toTimeString().split(' ')[0]; // Default to current time if not provided

//         await setDoc(
//             doc(db, "VisitorEntries", verifiedUser.id),
//             { timeOut: formattedTimeOut },
//             { merge: true }
//         );

//         alert('Timeout recorded successfully! Thank you for visiting us.');
//         setShowTimeoutForm(false);
//         setFormData({
//             name: '',
//             reason: '',
//             department: '',
//             purpose: '',
//             telephone: '',
//             company: '',
//             timeOut: '',
//             picture: null,
//             id: '',
//         });

//         localStorage.removeItem('showTimeoutForm');
//         localStorage.removeItem('formData');
//         setVerifiedUser(null);
//     } catch (error) {
//         console.error("Error submitting timeout to Firestore:", error);
//         alert('An error occurred while recording timeout.');
//     } finally {
//         setIsLoading(false);
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

//         {!showTimeoutForm && (
//           <form onSubmit={handleSubmit} style={styles.form}>
//             {renderInput('Name', 'name', 'text', formData, handleChange)}
//             {renderInput('Reason to See', 'reason', 'text', formData, handleChange, false)}
//             {renderInput('Department', 'department', 'text', formData, handleChange, false)}
//             {renderInput('Purpose', 'purpose', 'text', formData, handleChange, false)}
//             {renderInput('Telephone', 'telephone', 'tel', formData, handleChange)}
//             {renderInput('Company', 'company', 'text', formData, handleChange)}

//             <div style={styles.formGroup}>
//               <label style={styles.label}>Take a Picture:</label>
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handlePictureCapture}
//                 style={styles.inputFile}
//               />
//             </div>
//             {error && <div style={styles.error}>{error}</div>}
//             <button type="submit" style={styles.submitButton} disabled={isLoading}>
//               {isLoading ? "Submitting..." : "Submit"}
//             </button>
//           </form>
//         )}

//         {lastFourDigits && (
//           <div style={styles.codeContainer}>
//             <h2>Please copy your verification code for time out:</h2>
//             <p style={styles.verificationCode}>{lastFourDigits}</p>
//             <p>Time Remaining: {Math.floor(timeRemaining / 60)}:{timeRemaining % 60 < 10 ? '0' : ''}{timeRemaining % 60}</p>
//           </div>
//         )}

//         {showCodeInput && (
//           <div style={styles.codeInputContainer}>
//             <h2>Enter Verification Code</h2>
//             <input 
//               type="text" 
//               value={codeInput} 
//               onChange={(e) => setCodeInput(e.target.value)}
//               maxLength="4"
//               style={styles.input}
//               placeholder="Enter 4-digit code"
//             />
//             <button 
//               onClick={handleCodeVerification} 
//               style={styles.submitButton}
//             >
//               Verify Code
//             </button>
//           </div>
//         )}

//         {verifiedUser && (
//           <div style={styles.timeoutForm}>
//             <h2 style={{ color: 'red' }}>Hello, {verifiedUser.name}. Please record your Time Out:</h2>
//             {renderInput('Time Out', 'timeOut', 'time', formData, handleChange)}
//             <button
//               onClick={handleTimeoutSubmit}
//               style={styles.submitButton}
//               disabled={isLoading}
//             >
//               {isLoading ? "Submitting..." : "Submit Time Out"}
//             </button>
//           </div>
//         )}
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


// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { v4 as uuidv4 } from 'uuid';

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

//   // Load departments from localStorage or use default list
//   const [departments, setDepartments] = useState(() => {
//     const savedDepartments = localStorage.getItem('departments');
//     return savedDepartments ? JSON.parse(savedDepartments) : [
//       'Select Department',
//       'Human Resources',
//       'Finance',
//       'Information Technology',
//       'Operations',
//       'Marketing',
//       'Legal',
//       'Customer Service',
//       'Risk Management',
//       'Compliance',
//       'Treasury'
//     ];
//   });

//   // Load branches from localStorage or use default list
//   const [branches, setBranches] = useState(() => {
//     const savedBranches = localStorage.getItem('branches');
//     return savedBranches ? JSON.parse(savedBranches) : [
//       { label: 'Select Branch', value: '' },
//       { label: 'ACCRA BRANCH', value: '330102' },
//       { label: 'MAKOLA BRANCH', value: '330111' },
//       { label: 'TEMA BRANCH (COMM', value: '330120' },
//       { label: 'AIRPORT BRANCH', value: '330119' },
//       { label: 'MARKET CIRCLE BRANCH TAKORADI', value: '330401' },
//       { label: 'ADUM BRANCH KUMASI', value: '330601' },
//       { label: 'WEST HILLS MALL', value: '330108' },
//       { label: 'JUNCTION SHOPPING CENTRE BRANCH', value: '330101' },
//       { label: 'TEMA BRANCH (COMM 11)', value: '330112' },
//       { label: 'ACHIMOTA MALL BRANCH', value: '330107' },
//       { label: 'ACCRA MALL BRANCH', value: '330106' },
//       { label: 'KEJETIA BRANCH', value: '330602' }
//     ];
//   });

//   // New state for adding new department and branch
//   const [newDepartment, setNewDepartment] = useState('');
//   const [newBranch, setNewBranch] = useState({ label: '', value: '' });
//   const [showAddDepartment, setShowAddDepartment] = useState(false);
//   const [showAddBranch, setShowAddBranch] = useState(false);
  
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   // Save to localStorage when departments or branches change
//   useEffect(() => {
//     localStorage.setItem('departments', JSON.stringify(departments));
//   }, [departments]);

//   useEffect(() => {
//     localStorage.setItem('branches', JSON.stringify(branches));
//   }, [branches]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   // Handle adding new department
//   const handleAddDepartment = () => {
//     if (!newDepartment.trim()) {
//       setError('Department name cannot be empty');
//       return;
//     }
    
//     if (departments.includes(newDepartment)) {
//       setError('Department already exists');
//       return;
//     }
    
//     setDepartments([...departments, newDepartment]);
//     setNewDepartment('');
//     setShowAddDepartment(false);
//     setError('');
//   };

//   // Handle adding new branch
//   const handleAddBranch = () => {
//     if (!newBranch.label.trim() || !newBranch.value.trim()) {
//       setError('Branch name and code cannot be empty');
//       return;
//     }
    
//     if (branches.some(branch => branch.value === newBranch.value)) {
//       setError('Branch code already exists');
//       return;
//     }
    
//     setBranches([...branches, newBranch]);
//     setNewBranch({ label: '', value: '' });
//     setShowAddBranch(false);
//     setError('');
//   };

//   const handlePictureCapture = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ 
//         video: { facingMode: 'environment' } // Use back camera if available
//       });
      
//       const video = document.createElement('video');
//       const canvas = document.createElement('canvas');
//       video.srcObject = stream;
      
//       await new Promise(resolve => video.addEventListener('loadedmetadata', resolve));
//       video.play();
      
//       canvas.width = video.videoWidth;
//       canvas.height = video.videoHeight;
      
//       canvas.getContext('2d').drawImage(video, 0, 0);
      
//       const picture = canvas.toDataURL('image/jpeg');
      
//       const base64Size = picture.length * (3/4);
//       if (base64Size > 5 * 1024 * 1024) {
//         setError('Captured image is too large. Please try again.');
//         return;
//       }
      
//       setFormData({ ...formData, picture });
      
//       stream.getTracks().forEach(track => track.stop());
      
//     } catch (err) {
//       if (err.name === 'NotAllowedError') {
//         setError('Camera access denied. Please allow camera access to capture photos.');
//       } else {
//         setError('Failed to access camera. Please try again.');
//       }
//       console.error('Camera error:', err);
//     }
//   };

//   const validateTelephone = async () => {
//     if (!formData.telephone || formData.telephone.trim() === '') {
//       setError('Please enter a telephone number.');
//       return false;
//     }
  
//     try {
//       // Log the request URL for debugging
//       const url = `http://localhost:5001/visitors/check-telephone/${encodeURIComponent(formData.telephone)}`;
//       console.log(`Making request to: ${url}`);
      
//       const response = await fetch(url, {
//         method: 'GET',
//         headers: {
//           'Accept': 'application/json',
//         },
//       });
  
//       // Log the response status
//       console.log(`Response status: ${response.status}`);
  
//       if (!response.ok) {
//         if (response.status === 404) {
//           throw new Error(`Endpoint not found (404). Please check server routes.`);
//         } else {
//           throw new Error(`Server responded with status: ${response.status}`);
//         }
//       }
  
//       const data = await response.json();
//       console.log('Telephone check response:', data);
      
//       if (data.exists) {
//         setError('Telephone number already registered.');
//         return false;
//       }
//       return true;
//     } catch (error) {
//       console.error('Error validating telephone:', error);
//       setError(`Failed to validate telephone number: ${error.message}`);
//       return false;
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Check required fields first
//     if (!formData.name || !formData.telephone || !formData.department || !formData.branch) {
//       setError('Please fill in all required fields.');
//       return;
//     }

//     const isValid = await validateTelephone();
//     if (!isValid) return;

//     if (!formData.picture) {
//       setError('Please take a picture before submitting.');
//       return;
//     }

//     // Find the selected branch object to get both code and name
//     const selectedBranch = branches.find(branch => branch.value === formData.branch);
//     const branchName = selectedBranch ? selectedBranch.label : '';

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
//           branch: formData.branch, // Branch code
//           branchName: branchName, // Branch name
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
//             <div style={styles.departmentContainer}>
//               <select
//                 name="department"
//                 value={formData.department}
//                 onChange={handleChange}
//                 style={{...styles.input, width: '80%'}}
//                 required
//               >
//                 {departments.map((dept, index) => (
//                   <option key={index} value={index === 0 ? '' : dept}>
//                     {dept}
//                   </option>
//                 ))}
//               </select>
//               <button 
//                 type="button" 
//                 onClick={() => setShowAddDepartment(!showAddDepartment)}
//                 style={styles.addButton}
//               >
//                 {showAddDepartment ? 'Cancel' : 'Add New'}
//               </button>
//             </div>
            
//             {showAddDepartment && (
//               <div style={styles.addNewContainer}>
//                 <input
//                   type="text"
//                   value={newDepartment}
//                   onChange={(e) => setNewDepartment(e.target.value)}
//                   placeholder="Enter new department"
//                   style={styles.input}
//                 />
//                 <button 
//                   type="button" 
//                   onClick={handleAddDepartment}
//                   style={styles.saveButton}
//                 >
//                   Save
//                 </button>
//               </div>
//             )}
//           </div>
          
//           <div style={styles.formGroup}>
//             <label style={styles.label}>Branch:</label>
//             <div style={styles.departmentContainer}>
//               <select
//                 name="branch"
//                 value={formData.branch}
//                 onChange={handleChange}
//                 style={{...styles.input, width: '80%'}}
//                 required
//               >
//                 {branches.map((branch, index) => (
//                   <option key={index} value={branch.value}>
//                     {branch.value && `${branch.label} (${branch.value})`}
//                     {!branch.value && branch.label}
//                   </option>
//                 ))}
//               </select>
//               <button 
//                 type="button" 
//                 onClick={() => setShowAddBranch(!showAddBranch)}
//                 style={styles.addButton}
//               >
//                 {showAddBranch ? 'Cancel' : 'Add New'}
//               </button>
//             </div>
            
//             {showAddBranch && (
//               <div style={styles.addNewContainer}>
//                 <div style={{display: 'flex', gap: '10px', marginBottom: '10px'}}>
//                   <input
//                     type="text"
//                     value={newBranch.label}
//                     onChange={(e) => setNewBranch({...newBranch, label: e.target.value})}
//                     placeholder="Enter branch name"
//                     style={{...styles.input, flex: '2'}}
//                   />
//                   <input
//                     type="text"
//                     value={newBranch.value}
//                     onChange={(e) => setNewBranch({...newBranch, value: e.target.value})}
//                     placeholder="Enter branch code"
//                     style={{...styles.input, flex: '1'}}
//                   />
//                 </div>
//                 <button 
//                   type="button" 
//                   onClick={handleAddBranch}
//                   style={styles.saveButton}
//                 >
//                   Save
//                 </button>
//               </div>
//             )}
//           </div>
          
//           {renderInput('Purpose', 'purpose', 'text', formData, handleChange, false)}
//           {renderInput('Telephone', 'telephone', 'tel', formData, handleChange)}
//           {renderInput('Company', 'company', 'text', formData, handleChange)}

//           <div style={styles.formGroup}>
//             <label style={styles.label}>Take a Picture:</label>
//             <button 
//               type="button"
//               onClick={handlePictureCapture}
//               style={{
//                 ...styles.button,
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '8px',
//                 backgroundColor: '#4CAF50'
//               }}
//             >
//               <svg 
//                 width="24" 
//                 height="24" 
//                 viewBox="0 0 24 24" 
//                 fill="none" 
//                 stroke="currentColor" 
//                 strokeWidth="2"
//                 strokeLinecap="round" 
//                 strokeLinejoin="round"
//               >
//                 <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
//                 <circle cx="12" cy="13" r="4" />
//               </svg>
//               Open Camera
//             </button>
//             {formData.picture && (
//               <div style={styles.previewContainer}>
//                 <img 
//                   src={formData.picture} 
//                   alt="Captured" 
//                   style={styles.preview}
//                 />
//               </div>
//             )}
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



//mm
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

function FirstTime() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    reason: '',
    department: '',
    branch: '',
    purpose: '',
    telephone: '',
    company: '',
    picture: null,
  });

  // Load departments from localStorage or use default list
  const [departments, setDepartments] = useState(() => {
    const savedDepartments = localStorage.getItem('departments');
    return savedDepartments ? JSON.parse(savedDepartments) : [
      'Select Department',
      'Human Resources',
      'Finance',
      'Information Technology',
      'Operations',
      'Marketing',
      'Legal',
      'Customer Service',
      'Risk Management',
      'Compliance',
      'Treasury'
    ];
  });

  // Optimized branches state
  const [branches, setBranches] = useState([]);
  const [loadingBranches, setLoadingBranches] = useState(true);
  const [branchError, setBranchError] = useState('');

  // New state for adding new department
  const [newDepartment, setNewDepartment] = useState('');
  const [showAddDepartment, setShowAddDepartment] = useState(false);
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Optimized useEffect for fetching branches
  useEffect(() => {
    const fetchBranches = async () => {
      setLoadingBranches(true);
      setBranchError('');
      
      try {
        const response = await fetch('http://localhost:5001/visitorslog/fnb_branches');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Assuming your API returns an array of objects with branch_name and branch_code
        const formattedBranches = [
          { branch_name: 'Select Branch', branch_code: '' }, // Default option
          ...data
        ];
        
        setBranches(formattedBranches);
        
      } catch (error) {
        console.error('Error fetching branches:', error);
        setBranchError('Failed to load branches. Please try again.');
        
        // Fallback to default branches if API fails
        setBranches([
          { branch_name: 'Select Branch', branch_code: '' },
          { branch_name: 'Main Branch', branch_code: 'MB001' },
          { branch_name: 'Downtown Branch', branch_code: 'DB002' }
        ]);
      } finally {
        setLoadingBranches(false);
      }
    };

    fetchBranches();
  }, []);

  // Save to localStorage when departments change
  useEffect(() => {
    localStorage.setItem('departments', JSON.stringify(departments));
  }, [departments]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle adding new department
  const handleAddDepartment = () => {
    if (!newDepartment.trim()) {
      setError('Department name cannot be empty');
      return;
    }
    
    if (departments.includes(newDepartment)) {
      setError('Department already exists');
      return;
    }
    
    setDepartments([...departments, newDepartment]);
    setNewDepartment('');
    setShowAddDepartment(false);
    setError('');
  };

  const handlePictureCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Use back camera if available
      });
      
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      video.srcObject = stream;
      
      await new Promise(resolve => video.addEventListener('loadedmetadata', resolve));
      video.play();
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      canvas.getContext('2d').drawImage(video, 0, 0);
      
      const picture = canvas.toDataURL('image/jpeg');
      
      const base64Size = picture.length * (3/4);
      if (base64Size > 5 * 1024 * 1024) {
        setError('Captured image is too large. Please try again.');
        return;
      }
      
      setFormData({ ...formData, picture });
      
      stream.getTracks().forEach(track => track.stop());
      
    } catch (err) {
      if (err.name === 'NotAllowedError') {
        setError('Camera access denied. Please allow camera access to capture photos.');
      } else {
        setError('Failed to access camera. Please try again.');
      }
      console.error('Camera error:', err);
    }
  };

  const validateTelephone = async () => {
    if (!formData.telephone || formData.telephone.trim() === '') {
      setError('Please enter a telephone number.');
      return false;
    }
  
    try {
      // Log the request URL for debugging
      const url = `http://localhost:5001/visitorslog/visitors/check-telephone/${encodeURIComponent(formData.telephone)}`;
      console.log(`Making request to: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
  
      // Log the response status
      console.log(`Response status: ${response.status}`);
  
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Endpoint not found (404). Please check server routes.`);
        } else {
          throw new Error(`Server responded with status: ${response.status}`);
        }
      }
  
      const data = await response.json();
      console.log('Telephone check response:', data);
      
      if (data.exists) {
        setError('Telephone number already registered.');
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error validating telephone:', error);
      setError(`Failed to validate telephone number: ${error.message}`);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check required fields first
    if (!formData.name || !formData.telephone || !formData.department || !formData.branch) {
      setError('Please fill in all required fields.');
      return;
    }

    const isValid = await validateTelephone();
    if (!isValid) return;

    if (!formData.picture) {
      setError('Please take a picture before submitting.');
      return;
    }

    // Find the selected branch object to get both code and name
    const selectedBranch = branches.find(branch => branch.branch_code === formData.branch);
    
    if (!selectedBranch) {
      setError('Please select a valid branch.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5001/visitorslog/visitors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          reason: formData.reason,
          department: formData.department,
          branch: formData.branch, // This will be the branch_code
          branchName: selectedBranch.branch_name, // This will be the branch_name
          purpose: formData.purpose,
          telephone: formData.telephone,
          company: formData.company,
          picture: formData.picture,
          date: new Date().toISOString().split('T')[0],
          timeIn: new Date().toTimeString().split(' ')[0],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit the form. Please try again later.');
      }

      alert('Thank you for Visiting First National Bank!');
      navigate('/');
    } catch (error) {
      console.error("Error submitting data to the server:", error);
      setError(error.message);
    }

    setIsLoading(false);
  };

  // Retry function for branch loading
  const retryBranchLoading = async () => {
    setLoadingBranches(true);
    setBranchError('');
    
    try {
      const response = await fetch('http://localhost:5001/fnb_branches');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setBranches([{ branch_name: 'Select Branch', branch_code: '' }, ...data]);
    } catch (error) {
      setBranchError('Failed to load branches. Please try again.');
    } finally {
      setLoadingBranches(false);
    }
  };

  // Render optimized branch field
  const renderBranchField = () => (
    <div style={styles.formGroup}>
      <label style={styles.label}>Branch: *</label>
      
      {loadingBranches ? (
        <div style={styles.loadingContainer}>
          <span>Loading branches...</span>
        </div>
      ) : (
        <>
          <select
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            style={{
              ...styles.input,
              backgroundColor: branchError ? '#ffebee' : styles.input.backgroundColor
            }}
            required
          >
            {branches.map((branch, index) => (
              <option key={index} value={branch.branch_code}>
                {branch.branch_code ? 
                  `${branch.branch_name} (${branch.branch_code})` : 
                  branch.branch_name
                }
              </option>
            ))}
          </select>
          
          {branchError && (
            <div style={styles.fieldError}>
              {branchError}
              <button 
                type="button" 
                onClick={retryBranchLoading}
                style={styles.retryButton}
              >
                Retry
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );

  return (
    <div style={{ backgroundColor: '#0F384A' }}>
      <div style={styles.formContainer}>
        <div style={styles.logoContainer}>
          <img src="fnb back.png" alt="FNB Logo" style={styles.logo} />
          <h2 style={styles.logoText}>First National Bank</h2>
        </div>
        <header style={styles.formHeader}>
          <h1>Welcome Visitor</h1>
          <p>Please fill in the form below for your visit:</p>
        </header>

        <form onSubmit={handleSubmit} style={styles.form}>
          {renderInput('Name', 'name', 'text', formData, handleChange)}
          {renderInput('Reason to See', 'reason', 'text', formData, handleChange, false)}
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Department:</label>
            <div style={styles.departmentContainer}>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                style={{...styles.input, width: '95%'}}
                required
              >
                {departments.map((dept, index) => (
                  <option key={index} value={index === 0 ? '' : dept}>
                    {dept}
                  </option>
                ))}
              </select>
              {/* <button 
                type="button" 
                onClick={() => setShowAddDepartment(!showAddDepartment)}
                style={styles.addButton}
              >
                {showAddDepartment ? 'Cancel' : '+'}
              </button> */}
            </div>
            
            {/* {showAddDepartment && (
              <div style={styles.addNewContainer}>
                <input
                  type="text"
                  value={newDepartment}
                  onChange={(e) => setNewDepartment(e.target.value)}
                  placeholder="Enter new department"
                  style={styles.input}
                />
                <button 
                  type="button" 
                  onClick={handleAddDepartment}
                  style={styles.saveButton}
                >
                  Save
                </button>
              </div>
            )} */}
          </div>
          
          {renderBranchField()}
          
          {renderInput('Purpose', 'purpose', 'text', formData, handleChange, false)}
          {renderInput('Telephone', 'telephone', 'tel', formData, handleChange)}
          {renderInput('Company', 'company', 'text', formData, handleChange)}

          <div style={styles.formGroup}>
            <label style={styles.label}>Take a Picture:</label>
            <button 
              type="button"
              onClick={handlePictureCapture}
              style={{
                ...styles.button,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#4CAF50'
              }}
            >
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
              Open Camera
            </button>
            {formData.picture && (
              <div style={styles.previewContainer}>
                <img 
                  src={formData.picture} 
                  alt="Captured" 
                  style={styles.preview}
                />
              </div>
            )}
          </div>
          
          {error && <div style={styles.error}>{error}</div>}
          <button type="submit" style={styles.submitButton} disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}

const renderInput = (label, name, type, formData, handleChange, required = true) => (
  <div style={styles.formGroup} key={name}>
    <label style={styles.label}>{label}:</label>
    <input
      type={type}
      name={name}
      value={formData[name]}
      onChange={handleChange}
      required={required}
      style={styles.input}
    />
  </div>
);


// Add additional styles for

const styles = {
  formContainer: {
    maxWidth: '100%',
    margin: '20px auto',
    padding: '20px',
    backgroundColor: '#f0f4ff',
    borderRadius: '15px',
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.3)',
    width: '90%',
  },
  logoContainer: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  logo: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
  },
  codeContainer: {
    textAlign: 'center',
    backgroundColor: '#f0f4ff',
    padding: '20px',
    borderRadius: '10px',
    marginTop: '20px',
  },
  verificationCode: {
    fontSize: '48px',
    fontWeight: 'bold',
    color: '#007bff',
    letterSpacing: '10px',
  },
  codeInputContainer: {
    textAlign: 'center',
    backgroundColor: '#f0f4ff',
    padding: '20px',
    borderRadius: '10px',
    marginTop: '20px',
  },
  logoText: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#003366',
    marginTop: '10px',
  },
  formHeader: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#003366',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    fontWeight: 'bold',
    color: '#046063',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #d3d3d3',
    fontSize: '16px',
    outline: 'none',
  },
  inputFile: {
    marginTop: '10px',
    fontSize: '16px',
    border: 'none',
  },
  submitButton: {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '12px',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '18px',
    outline: 'none',
    transition: 'background-color 0.3s ease',
  },
  submitButtonDisabled: {
    backgroundColor: '#d6d6d6',
    color: '#fff',
    pointerEvents: 'none',
  },
  error: {
    color: 'red',
    marginBottom: '10px',
    fontSize: '14px',
  },
  timeoutForm: {
    textAlign: 'center',
  },
  codeContainer: {
    textAlign: 'center',
    backgroundColor: '#f0f4ff',
    padding: '20px',
    borderRadius: '10px',
    marginTop: '20px',
  },
  verificationCode: {
    fontSize: '48px',
    fontWeight: 'bold',
    color: '#007bff',
    letterSpacing: '10px',
  },
  codeInputContainer: {
    textAlign: 'center',
    backgroundColor: '#f0f4ff',
    padding: '20px',
    borderRadius: '10px',
    marginTop: '20px',
  },
};

export default FirstTime;




// import React, { useState, useEffect } from 'react';
// import { getFirestore, doc, setDoc } from "firebase/firestore";
// import app from '../Config';
// import { v4 as uuidv4 } from 'uuid';

// function FirstTime() {
//   const db = getFirestore(app);

//   const [formData, setFormData] = useState({
//     name: '',
//     reason: '',
//     department: '',
//     purpose: '',
//     telephone: '',
//     company: '',
//     timeOut: '',
//     picture: null,
//     id: '',
//   });

//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [showTimeoutForm, setShowTimeoutForm] = useState(false);

//   useEffect(() => {
//     const savedState = localStorage.getItem('showTimeoutForm');
//     const savedFormData = localStorage.getItem('formData');

//     if (savedState === 'true' && savedFormData) {
//       try {
//         setFormData(JSON.parse(savedFormData));
//         setShowTimeoutForm(true);
//       } catch {
//         console.error('Error parsing formData from localStorage');
//       }
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handlePictureCapture = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (file.size > 5 * 1024 * 1024) { // 5MB limit
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

//     if (!formData.picture) {
//       setError('Please take a picture before submitting.');
//       return;
//     }

//     setIsLoading(true);
//     const entryId = uuidv4();
//     const now = new Date();
//     const formattedDate = now.toLocaleDateString();
//     const formattedTime = now.toLocaleTimeString();

//     const submissionData = {
//       name: formData.name,
//       reason: formData.reason,
//       department: formData.department,
//       purpose: formData.purpose,
//       telephone: formData.telephone,
//       company: formData.company,
//       date: formattedDate,
//       timeIn: formattedTime,
//       id: entryId,
//     };

//     try {
//       await setDoc(doc(db, "VisitorEntries", entryId), submissionData);
//       alert('Form submitted successfully!');
//       setFormData({ ...formData, id: entryId });
//       setShowTimeoutForm(true);

//       localStorage.setItem('showTimeoutForm', 'true');
//       localStorage.setItem('formData', JSON.stringify({ ...formData, id: entryId }));
//     } catch (error) {
//       console.error("Error submitting data to Firestore:", error);
//       setError('Failed to submit the form. Please try again later.');
//     }

//     setIsLoading(false);
//   };

//   const handleTimeoutSubmit = async () => {
//     if (!formData.timeOut) {
//       alert('Please enter the time out before submitting.');
//       return;
//     }

//     setIsLoading(true);

//     try {
//       await setDoc(
//         doc(db, "VisitorEntries", formData.id),
//         { timeOut: formData.timeOut },
//         { merge: true }
//       );

//       alert('Timeout recorded successfully! Thank you for visiting us.');
//       setShowTimeoutForm(false);
//       setFormData({
//         name: '',
//         reason: '',
//         department: '',
//         purpose: '',
//         telephone: '',
//         company: '',
//         timeOut: '',
//         picture: null,
//         id: '',
//       });

//       localStorage.removeItem('showTimeoutForm');
//       localStorage.removeItem('formData');
//     } catch (error) {
//       console.error("Error submitting timeout to Firestore:", error);
//       alert('An error occurred while recording timeout.');
//     } finally {
//       setIsLoading(false);
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

//         {!showTimeoutForm && (
//           <form onSubmit={handleSubmit} style={styles.form}>
//             {renderInput('Name', 'name', 'text', formData, handleChange)}
//             {renderInput('Reason to See', 'reason', 'text', formData, handleChange, false)}
//             {renderInput('Department', 'department', 'text', formData, handleChange, false)}
//             {renderInput('Purpose', 'purpose', 'text', formData, handleChange, false)}
//             {renderInput('Telephone', 'telephone', 'tel', formData, handleChange)}
//             {renderInput('Company', 'company', 'text', formData, handleChange)}

//             <div style={styles.formGroup}>
//               <label style={styles.label}>Take a Picture:</label>
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handlePictureCapture}
//                 style={styles.inputFile}
//               />
//             </div>
//             {error && <div style={styles.error}>{error}</div>}
//             <button type="submit" style={styles.submitButton} disabled={isLoading}>
//               {isLoading ? "Submitting..." : "Submit"}
//             </button>
//           </form>
//         )}

//         {showTimeoutForm && (
//           <div style={styles.timeoutForm}>
//             <h2 style={{ color: 'red' }}>Please record your Time Out when you are leaving:</h2>
//             {renderInput('Time Out', 'timeOut', 'time', formData, handleChange)}
//             <button
//               onClick={handleTimeoutSubmit}
//               style={styles.submitButton}
//               disabled={isLoading}
//             >
//               {isLoading ? "Submitting..." : "Submit Time Out"}
//             </button>
//           </div>
//         )}
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

// const styles = {
//   formContainer: {
//     maxWidth: '100%',
//     margin: '20px auto',
//     padding: '20px',
//     backgroundColor: '#f0f4ff',
//     borderRadius: '15px',
//     boxShadow: '0 12px 24px rgba(0, 0, 0, 0.3)',
//     width: '90%',
//   },
//   logoContainer: {
//     textAlign: 'center',
//     marginBottom: '20px',
//   },
//   logo: {
//     width: '80px',
//     height: '80px',
//     borderRadius: '50%',
//   },
//   logoText: {
//     fontSize: '20px',
//     fontWeight: 'bold',
//     color: '#003366',
//     marginTop: '10px',
//   },
//   formHeader: {
//     textAlign: 'center',
//     marginBottom: '20px',
//     color: '#003366',
//   },
//   form: {
//     display: 'flex',
//     flexDirection: 'column',
//   },
//   formGroup: {
//     marginBottom: '15px',
//   },
//   label: {
//     display: 'block',
//     marginBottom: '6px',
//     fontWeight: 'bold',
//     color: '#046063',
//   },
//   input: {
//     width: '100%',
//     padding: '10px',
//     borderRadius: '8px',
//     border: '1px solid #d3d3d3',
//     fontSize: '16px',
//     outline: 'none',
//   },
//   inputFile: {
//     marginTop: '10px',
//     fontSize: '16px',
//     border: 'none',
//   },
//   submitButton: {
//     backgroundColor: '#007bff',
//     color: '#fff',
//     padding: '12px',
//     borderRadius: '10px',
//     border: 'none',
//     cursor: 'pointer',
//     fontSize: '18px',
//     marginTop: '20px',
//   },
//   error: {
//     color: 'red',
//     marginBottom: '20px',
//   },
// };

// export default FirstTime;
