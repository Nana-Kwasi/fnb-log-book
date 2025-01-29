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
//     }
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
//     }
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

import React, { useState, useEffect } from 'react';
import { getFirestore, doc, setDoc, collection, getDocs, query, where, addDoc } from "firebase/firestore";
import app from '../Config';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';

function FirstTime() {

  const db = getFirestore(app);
  const navigate = useNavigate()
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

  const [departments, setDepartments] = useState([
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
  ]);

  const [newDepartment, setNewDepartment] = useState('');
  const [showAddDepartment, setShowAddDepartment] = useState(false);
  const [newBranch, setNewBranch] = useState({ name: '', code: '' });
  const [showAddBranch, setShowAddBranch] = useState(false);


  // Fetch departments from Firestore on component mount
  useEffect(() => {
    fetchDepartments();
    fetchBranches();
  }, []);

  const fetchDepartments = async () => {
    try {
      const departmentsCollection = collection(db, "departments");
      const departmentsSnapshot = await getDocs(departmentsCollection);
      const departmentsList = departmentsSnapshot.docs.map(doc => doc.data().name);
      
      // Combine default departments with stored ones, removing duplicates
      const allDepartments = ['Select Department', ...new Set([...departments.slice(1), ...departmentsList])];
      setDepartments(allDepartments);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };
  const fetchBranches = async () => {
    try {
      const branchesCollection = collection(db, "branches");
      const branchesSnapshot = await getDocs(branchesCollection);
      const branchesList = branchesSnapshot.docs.map(doc => ({
        label: doc.data().name,
        value: doc.data().code
      }));
      const allBranches = [{ label: 'Select Branch', value: '' }, ...branches.slice(1), ...branchesList];
      setBranches(allBranches);
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };

  const handleAddDepartment = async () => {
    if (newDepartment.trim() === '') return;

    try {
      const departmentsCollection = collection(db, "departments");
      await addDoc(departmentsCollection, {
        name: newDepartment.trim(),
        timestamp: new Date()
      });

      setDepartments(prev => [...prev, newDepartment.trim()]);
      setNewDepartment('');
      setShowAddDepartment(false);
    } catch (error) {
      console.error("Error adding department:", error);
      setError('Failed to add department. Please try again.');
    }
  };

  const handleAddBranch = async () => {
    if (newBranch.name.trim() === '' || newBranch.code.trim() === '') return;

    try {
      const branchesCollection = collection(db, "branches");
      await addDoc(branchesCollection, {
        name: newBranch.name.trim(),
        code: newBranch.code.trim(),
        timestamp: new Date()
      });

      setBranches(prev => [...prev, { label: newBranch.name.trim(), value: newBranch.code.trim() }]);
      setNewBranch({ name: '', code: '' });
      setShowAddBranch(false);
    } catch (error) {
      console.error("Error adding branch:", error);
      setError('Failed to add branch. Please try again.');
    }
  };

  const handleRemoveDepartment = (deptToRemove) => {
    setDepartments(prev => prev.filter(dept => dept !== deptToRemove));
  };

  const handleRemoveBranch = (branchToRemove) => {
    setBranches(prev => prev.filter(branch => branch.value !== branchToRemove.value));
  };

 


  const [branches, setBranches] = useState([
    { label: 'Select Branch', value: '' },
    { label: 'ACCRA BRANCH', value: '330102' },
    { label: 'MAKOLA BRANCH', value: '330111' },
    { label: 'TEMA BRANCH (COMM', value: '330120' },
    { label: 'AIRPORT BRANCH', value: '330119' },
    { label: 'MARKET CIRCLE BRANCH TAKORADI', value: '330401' },
    { label: 'ADUM BRANCH KUMASI', value: '330601' },
    { label: 'WEST HILLS MALL', value: '330108' },
    { label: 'JUNCTION SHOPPING CENTRE BRANCH', value: '330101' },
    { label: 'TEMA BRANCH (COMM 11)', value: '330112' },
    { label: 'ACHIMOTA MALL BRANCH', value: '330107' },
    { label: 'ACCRA MALL BRANCH', value: '330106' },
    { label: 'KEJETIA BRANCH', value: '330602' }
  ]);

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePictureCapture = async () => {
    try {
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Use back camera if available
      });
      
      // Create video and canvas elements
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      video.srcObject = stream;
      
      // Wait for video to be ready
      await new Promise(resolve => video.addEventListener('loadedmetadata', resolve));
      video.play();
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Capture frame from video
      canvas.getContext('2d').drawImage(video, 0, 0);
      
      // Convert to base64
      const picture = canvas.toDataURL('image/jpeg');
      
      // Check file size (base64 string is ~33% larger than binary)
      const base64Size = picture.length * (3/4);
      if (base64Size > 5 * 1024 * 1024) {
        setError('Captured image is too large. Please try again.');
        return;
      }
      
      // Update form data with captured image
      setFormData({ ...formData, picture });
      
      // Stop camera stream
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.picture) {
        setError('Please take a picture before submitting.');
        return;
    }

    setIsLoading(true);

    try {
        const querySnapshot = await getDocs(query(collection(db, "VisitorEntries"), where("telephone", "==", formData.telephone)));

        if (!querySnapshot.empty) {
            setError('This Phone number has been used to check in before. Please click "Been Here Before" on the home page to log in with your number.');
            setIsLoading(false);
            return;
        }

        const entryId = uuidv4();
        const now = new Date();
        const formattedDate = now.toISOString().split('T')[0];
        const formattedTime = now.toTimeString().split(' ')[0];

        const submissionData = {
            name: formData.name,
            reason: formData.reason,
            department: formData.department,
            branch: formData.branch,
            purpose: formData.purpose,
            telephone: formData.telephone,
            company: formData.company,
            date: formattedDate,
            timeIn: formattedTime,
            id: entryId,
        };

        await setDoc(doc(db, "VisitorEntries", entryId), submissionData);
        alert('Thank you for Visiting First National Bank!');
        navigate('/');
        
    } catch (error) {
        console.error("Error submitting data to Firestore:", error);
        setError('Failed to submit the form. Please try again later.');
    }

    setIsLoading(false);
  };

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
                style={styles.departmentSelect}
                required
              >
                {departments.map((dept, index) => (
                  <option key={index} value={index === 0 ? '' : dept}>
                    {dept}
                    {index !== 0 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          handleRemoveDepartment(dept);
                        }}
                        style={styles.removeButton}
                      >
                        -
                      </button>
                    )}
                  </option>
                ))}
              </select>
              <button 
                type="button" 
                onClick={() => setShowAddDepartment(!showAddDepartment)}
                style={styles.addDepartmentButton}
              >
                +
              </button>
            </div>
            {showAddDepartment && (
              <div style={styles.addDepartmentForm}>
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
                  style={styles.submitDepartmentButton}
                >
                  Add
                </button>
              </div>
            )}
          </div>

           <div style={styles.formGroup}>
            <label style={styles.label}>Branch:</label>
            <div style={styles.departmentContainer}>
              <select
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                style={styles.input}
                required
              >
                {branches.map((branch, index) => (
                  <option key={index} value={branch.value}>
                    {branch.label}
                    {index !== 0 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          handleRemoveBranch(branch);
                        }}
                        style={styles.removeButton}
                      >
                        -
                      </button>
                    )}
                  </option>
                ))}
              </select>
              <button 
                type="button" 
                onClick={() => setShowAddBranch(!showAddBranch)}
                style={styles.addDepartmentButton}
              >
                +
              </button>
            </div>
            {showAddBranch && (
              <div style={styles.addBranchForm}>
                <input
                  type="text"
                  value={newBranch.name}
                  onChange={(e) => setNewBranch({ ...newBranch, name: e.target.value })}
                  placeholder="Enter branch name"
                  style={styles.input}
                />
                <input
                  type="text"
                  value={newBranch.code}
                  onChange={(e) => setNewBranch({ ...newBranch, code: e.target.value })}
                  placeholder="Enter branch code"
                  style={styles.input}
                />
                <button 
                  type="button"
                  onClick={handleAddBranch}
                  style={styles.submitBranchButton}
                >
                  Add
                </button>
              </div>
            )}
            </div>
          {renderInput('Purpose', 'purpose', 'text', formData, handleChange, false)}
          {renderInput('Telephone', 'telephone', 'tel', formData, handleChange)}
          {renderInput('Company', 'company', 'text', formData, handleChange)}

          <div style={styles.formGroup}>
  <label style={styles.label}>Take a Picture:</label>
  <button 
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


 const styles = {
  // ... (previous styles remain the same)
  departmentContainer: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },
  departmentSelect: {
    flex: 1,
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #d3d3d3',
    fontSize: '16px',
    outline: 'none',
  },
  addDepartmentButton: {
    padding: '8px 16px',
    backgroundColor: '#046063',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '18px',
  },
  addDepartmentForm: {
    marginTop: '10px',
    display: 'flex',
    gap: '10px',
  },
  submitDepartmentButton: {
    padding: '8px 16px',
    backgroundColor: '#046063',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  // ... (rest of the previous styles)
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
  removeButton: {
    padding: '6px 12px',
    backgroundColor: '#dc3545',
    color: 'red',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#c82333',
    },
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
  button: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    color: 'white',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  previewContainer: {
    marginTop: '10px',
    maxWidth: '300px',
  },
  preview: {
    width: '100%',
    height: 'auto',
    borderRadius: '4px',
    border: '1px solid #ddd'
  }
 
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
//     }
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
