const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.picture) {
      setError('Please take a picture before submitting.');
      return;
    }

    setIsLoading(true);

    try {
      const phoneResponse = await fetch(`http://localhost:5001/visitors?telephone=${formData.telephone}`);
      const existingUsers = await phoneResponse.json();

      if (existingUsers.length > 0) {
        setError('This Phone number has been used to check in before. Please click "Been Here Before" on the home page to log in with your number.');
        setIsLoading(false);
        return;
      }

      const entryId = uuidv4();
      const now = new Date();
      const formattedDate = now.toISOString().split('T')[0];
      const formattedTime = now.toTimeString().split(' ')[0];

      const submissionData = {
        id: entryId,
        name: formData.name,
        reason: formData.reason,
        department: formData.department,
        branch: formData.branch,
        purpose: formData.purpose,
        telephone: formData.telephone,
        company: formData.company,
        picture: formData.picture,
        date: formattedDate,
        timeIn: formattedTime,
        timeOut: null
      };

      const response = await fetch('http://localhost:5001/visitors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit the form');
      }

      alert('Thank you for Visiting First National Bank!');
      navigate('/');
    } catch (error) {
      console.error("Error submitting data:", error);
      setError('Failed to submit the form. Please try again later.');
    }

    setIsLoading(false);
  };