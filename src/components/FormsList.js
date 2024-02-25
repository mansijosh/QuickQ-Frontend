import React, { useState, useEffect } from 'react';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import {
  Paper,
  Button,
  Typography,
  Container,
  IconButton,
  Modal,
} from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';

const FormsList = ({ searchQuery }) => {
  const [forms, setForms] = useState([]);
  const [error, setError] = useState(null);
  const [deleteFormId, setDeleteFormId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/apii/get_all_forms/');
        const data = response.data;

        if (Array.isArray(data)) {
          setForms(data);
        } else {
          console.error('Data received is not an array:', data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('An error occurred while fetching forms.');
      }
    };

    fetchData();
  }, []);

  const handleCopyLinkClick = (formId) => {
    const formLink = `${window.location.origin}/renderform/${formId}`;
    const tempInput = document.createElement('input');
    tempInput.value = formLink;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
  };

  const handleDeleteClick = (formId) => {
    setDeleteFormId(formId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/delete_form/${deleteFormId}`);
      setForms(forms.filter((form) => form.form_id !== deleteFormId));
    } catch (error) {
      console.error('Error deleting form:', error);
    } finally {
      setDeleteFormId(null);
      setIsDeleteModalOpen(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteFormId(null);
    setIsDeleteModalOpen(false);
  };

  // Filter forms based on search query
  const filteredForms = forms.filter(form =>
    form.form_title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom style={{ color: '#1976D2', marginTop: '20px', marginBottom: '20px' }}>
        Forms List
      </Typography>
      {error ? (
        <Typography variant="body1" style={{ color: 'red' }}>{error}</Typography>
      ) : filteredForms.length === 0 ? (
        <Typography variant="body1">No forms available.</Typography>
      ) : (
        <div>
          {/* Reverse the order of forms array while mapping */}
          {filteredForms.slice().reverse().map((form, index) => (
            <div key={form.form_id} style={{ marginBottom: '20px' }}>
              <Paper elevation={3} style={{ padding: '20px', boxShadow: '0px 0px 10px 0px #888' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h5" style={{ color: '#1976D2', marginBottom: '10px' }}>
                    {form.form_title}
                  </Typography>

                  <div style={{ marginTop: '10px' }}>
                    <Link to={`/editform/${form.form_id}`}>
                      <Button
                        variant="outlined"
                        color="primary"
                        disabled={form.responses_count > 0}
                      >
                        {form.responses_count > 0 ? 'Responses received' : 'Edit'}
                      </Button>
                    </Link>
                    <Link to={`/renderform/${form.form_id}`}>
                      <Button
                        variant="outlined"
                        color="primary"
                        style={{ marginLeft: '10px' }}
                        disabled={form.responses_count > 0}
                      >
                        {form.responses_count > 0 ? 'Responses received' : 'Publish'}
                      </Button>
                    </Link>
                    {form.questions.length > 0 && (
                      <Link to={`/form-responses/${form.form_id}`}>
                        <Button variant="outlined" color="primary" style={{ marginLeft: '10px' }}>
                          Responses
                        </Button>
                      </Link>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}>
                      {/* Delete Icon */}
                      <IconButton
                        style={{ marginLeft: '10px', color: 'red' }}
                        onClick={() => handleDeleteClick(form.form_id)}
                      >
                        <DeleteIcon />
                      </IconButton>

                      {/* Copy Link Icon */}
                      <IconButton
                        style={{ marginLeft: '10px', color: 'blue' }}
                        onClick={() => handleCopyLinkClick(form.form_id)}
                      >
                        <FileCopyIcon />
                      </IconButton>
                    </div>
                  </div>
                </div>
              </Paper>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        open={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-form-modal-title"
        aria-describedby="delete-form-modal-description"
      >
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'white', padding: '20px' }}>
          <Typography variant="h6" id="delete-form-modal-title">
            Confirm Deletion
          </Typography>
          <Typography variant="body1" id="delete-form-modal-description">
            Are you sure you want to delete this form?
          </Typography>
          <Button onClick={handleDeleteConfirm} color="secondary" style={{ marginRight: '10px' }}>
            Delete
          </Button>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
        </div>
      </Modal>
    </Container>
  );
};

export default FormsList;
