import React, { useState, useEffect } from 'react';
import { Typography, Paper } from '@mui/material';
import { Link,useParams } from 'react-router-dom';
import axios from 'axios';

const FormResponses = () => {
  const { formId } = useParams(); // Use useParams here to access route parameters
  const [responses, setResponses] = useState([]);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch form details
        const formResponse = await axios.get(`http://127.0.0.1:8000/api2/get-forms/${formId}`); 
        const formData = formResponse.data;

        // Fetch form responses
        const response = await axios.get(`http://127.0.0.1:8000/api2/get-responses/${formId}`);
        const responseData = response.data;

        console.log('Form Data:', formData);
        console.log('Responses Data:', responseData);

        if (Array.isArray(responseData)) {
          setResponses(responseData);
          setForm(formData);
        } else {
          console.error('Responses data received is not an array:', responseData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('An error occurred while fetching responses.');
      }
    };

    fetchData();
  }, [formId]);

  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
      </nav>
      <div>
        <Typography variant="h4" gutterBottom style={{ color: '#1976D2', marginTop: '20px', marginBottom: '20px' }}>
          {form && form.form_title}
        </Typography>

        {error ? (
          <Typography variant="body1" style={{ color: 'red' }}>{error}</Typography>
        ) : responses.length === 0 ? (
          <Typography variant="body1">No responses available for this form.</Typography>
        ) : (
          <div>
            <Typography variant="body1" style={{ textAlign: 'right', color: '#888', marginRight: '10px' }}>
              {responses.length} {responses.length === 1 ? 'Response' : 'Responses'}
            </Typography>

            {responses.map((response) => (
              <Paper key={response._id} elevation={3} style={{ padding: '20px', marginBottom: '20px', boxShadow: '0px 0px 10px 0px #888' }}>
                <Typography variant="body1">
                  {/* You can add more form details as needed */}
                </Typography>
                <Typography variant="body1">
                  {response.responses.map((item) => (
                    <div key={item.name}>
                      {item.name}: {item.value}
                    </div>
                  ))}
                </Typography>
                {/* Add more details as needed */}
              </Paper>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FormResponses;
