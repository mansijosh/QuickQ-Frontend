import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link ,useParams } from 'react-router-dom';

const YourComponent = () => {
  const { formId } = useParams();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submissionStatus, setSubmissionStatus] = useState(null);

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api2/get-forms/${formId}`);
        setFormData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching form data:', error);
        setLoading(false);
      }
    };

    fetchFormData();
  }, [formId]);

  
  
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Gather form data
    const form = event.target;
    const formData = new FormData(form);
    const responses = [];

    // Iterate through form elements and collect responses
    formData.forEach((value, name) => {
      responses.push({
        name,
        value,
      });
    });

    // Retrieve form_id from the formData obtained in the GET request
    const formId = formData.get('form_id');

    formData.getAll('textarea').forEach((value, index) => {
      responses.push({
        name: `textarea-${index}`, // Use a more descriptive naming convention
        value,
      });
    });

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/add_responses/', {
        form_id: formId,
        responses,
      });

      console.log('Response from add-responses API:', response.data);

      setSubmissionStatus('success');
    } catch (error) {
      console.error('Error submitting form responses:', error);

      // Update submission status
      setSubmissionStatus('error');
    }
  };



  return (
    <div>
    <nav>
        <Link to="/">Home</Link>
      </nav>
    <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'Arial, sans-serif', display: 'flex', justifyContent: 'center' }}>
      <div style={{ maxWidth: '600px', width: '100%' }}>
      
        {loading ? (
        <p>Loading...</p>
      ) : submissionStatus === 'success' ? (
        <div>
          <p style={{ color: 'black', fontSize: '18px', textAlign: 'center', marginBottom: '10px', lineHeight: '1.5' }}>
            Thank you for filling the form!
          </p>
          <p style={{ color: 'black', fontSize: '18px', textAlign: 'center', lineHeight: '1.5' }}>
            Your response has been submitted successfully!
          </p>
        </div>

      ) : submissionStatus === 'error' ? (
        <div>
          <p style={{ color: 'red' }}>Error submitting form. Please try again.</p>
        </div>
      ) : formData ? (
        <div>
          <h1 style={{ fontSize: '24px', marginBottom: '20px', color: '#4285F4' }}>{formData.form_title || 'Student Club Form'}</h1>
          <form onSubmit={handleSubmit}>
               <input type="hidden" name="form_id" value={formData.form_id} />

            <ul style={{ listStyleType: 'none', padding: '0', textAlign: 'left' }}>
              {formData.questions.map((question, index) => (
                <li
                  key={index}
                  style={{
                    marginBottom: '20px',
                    padding: '15px',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    backgroundColor: '#f8f8f8',
                  }}
                >
                  <p style={{ marginBottom: '10px', color: '#333' }} dangerouslySetInnerHTML={{ __html: question.question }} />
                  {question.type === 'Text Paragraph' ? (
                    <textarea
                    name="textareaName"
                      rows="4"
                      cols="50"
                      placeholder="Type your answer..."
                      style={{
                        width: '100%',
                        padding: '8px',
                        boxSizing: 'border-box',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                      }}
                    />
                  ) : question.type === 'Radio Button' ? (
                    <div>
                      {question.displayNames && question.displayNames.length > 0 ? (
                        question.displayNames.map((displayName, i) => (
                          <div key={i} style={{ marginBottom: '8px', textAlign: 'left' }}>
                            <input type="radio" id={`option-${i}`} name={`question-${index}`} value={displayName} />
                            <label htmlFor={`option-${i}`} style={{ marginLeft: '5px', color: '#555' }} dangerouslySetInnerHTML={{ __html: displayName }} />
                          </div>
                        ))
                      ) : (
                        <p>No options available for this question</p>
                      )}
                    </div>
                  ) : question.type === 'Multiple-Choice Grid' ? (
                    <div>
                      {question.displayNames && question.displayNames.length > 0 ? (
                        question.displayNames.map((displayName, i) => (
                          <div key={i} style={{ marginBottom: '8px', textAlign: 'left' }}>
                            <input type="checkbox" id={`option-${i}`} name={`question-${index}`} value={displayName} />
                            <label htmlFor={`option-${i}`} style={{ marginLeft: '5px', color: '#555' }} dangerouslySetInnerHTML={{ __html: displayName }} />
                          </div>
                        ))
                      ) : (
                        <p>No options available for this question</p>
                      )}
                    </div>
                  ) : question.type === 'Checkbox' ? (
                    <div>
                      {question.displayNames && question.displayNames.length > 0 ? (
                        question.displayNames.map((displayName, i) => (
                          <div key={i} style={{ marginBottom: '8px', textAlign: 'left' }}>
                            <input type="checkbox" id={`option-${i}`} name={`question-${index}`} value={displayName} />
                            <label htmlFor={`option-${i}`} style={{ marginLeft: '5px', color: '#555' }} dangerouslySetInnerHTML={{ __html: displayName }} />
                          </div>
                        ))
                      ) : (
                        <p>No options available for this question</p>
                      )}
                    </div>
                  ) : question.type === 'Date' ? (
                    <div>
                      <input
                        type="date"
                        id={`date-question-${index}`}
                        name={`question-${index}`}
                        style={{
                          width: '100%',
                          padding: '8px',
                          boxSizing: 'border-box',
                          borderRadius: '4px',
                          border: '1px solid #ccc',
                        }}
                      />
                    </div>
                  ) : question.type === 'Drop-down' ? (
                    <div>
                      {question.options && question.options.length > 0 ? (
                        <select
                          style={{
                            width: '100%',
                            padding: '8px',
                            boxSizing: 'border-box',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                          }}
                        >
                          <option value="" disabled selected>
                            Select an option
                          </option>
                          {question.options.map((option, i) => (
                            <option key={i} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <p>No options available for this question</p>
                      )}
                    </div>
                  ) : null}
                </li>
              ))}
              </ul>
              
            <button type="submit" style={{ marginTop: '20px', padding: '10px', backgroundColor: '#4285F4', color: '#fff', borderRadius: '5px' }}>
              Submit
            </button>
              </form>
              </div>
        ) : (
          <p>No form data found</p>
        )}
      </div>
    </div>
    </div>
  );
};

export default YourComponent;
