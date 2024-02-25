import React, { useState, useEffect } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { Typography, Button, Paper, Grid, Radio, FormControlLabel, Checkbox as MuiCheckbox, RadioGroup as MuiRadioGroup, Select, MenuItem, InputLabel, TextField, Box } from '@mui/material';
import RichTextEditor from './RichTextEditor';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DateRangeIcon from '@mui/icons-material/DateRange';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import QrCodeIcon from '@mui/icons-material/QrCode';
import axios from 'axios';

const RadioGroup = MuiRadioGroup;

const componentIcons = {
  'Text Paragraph': <TextFieldsIcon fontSize="small" />,
  'Radio Button': <RadioButtonCheckedIcon fontSize="small" />,
  'Checkbox': <CheckBoxIcon fontSize="small" />,
  'Multiple-Choice Grid': <ViewModuleIcon fontSize="small" />,
  'Tick-Box Grid': <CheckBoxOutlineBlankIcon fontSize="small" />,
  'Drop-down': <ArrowDropDownIcon fontSize="small" />,
  'Add Image': <AddPhotoAlternateIcon fontSize="small" />,
  'File Upload': <AttachFileIcon fontSize="small" />,
  'Date': <DateRangeIcon fontSize="small" />,
  'Time': <AccessTimeIcon fontSize="small" />,
  'QR Code': <QrCodeIcon fontSize="small" />,
};

const cleanHtml = (html) => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
};

const CreateFormPage = ({ editMode, initialFormData }) => {
  const navigate = useNavigate();
  const [undoStack, setUndoStack] = useState([]);
  const [formData, setFormData] = useState({
    formTitle: editMode ? initialFormData.formTitle : 'Untitled',
    components: editMode ? initialFormData.components : [],
  });
  const [savedSuccessfully, setSavedSuccessfully] = useState(false);
  const [published, setPublished] = useState(false);
  const [formLink, setFormLink] = useState('');

  useEffect(() => {
    let timeout;
    if (savedSuccessfully) {
      timeout = setTimeout(() => {
        setSavedSuccessfully(false);
      }, 3000);
    }
    return () => clearTimeout(timeout);
  }, [savedSuccessfully]);

  const handleMoveQuestion = (fromIndex, toIndex) => {
    setFormData((prevData) => {
      const updatedComponents = [...prevData.components];
      const [movedComponent] = updatedComponents.splice(fromIndex, 1);
      updatedComponents.splice(toIndex, 0, movedComponent);

      setUndoStack((prevUndoStack) => [...prevUndoStack, prevData]);
      return { ...prevData, components: updatedComponents };
    });
  };


  const handleSaveForm = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/create_form/', {
        formTitle: formData.formTitle,
        components: formData.components,
      });
  
      console.log('response=', response);
  
      if (response.data.message) {
        alert(response.data.message);
  
        setPublished(true);
  
        // Redirect to the home page instead of the form link
        window.location.href = 'http://localhost:3000';  // Replace with your home page URL
      }
    } catch (error) {
      console.error('Error saving form data:', error);
    }
  };
  
  
  const handlePublishForm = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/publish_form/', {
        formTitle: formData.formTitle,
        components: formData.components,
      });
  
      console.log('Publish Form API response:', response.data);
  
      const formId = response.data.message.match(/with ID: (\w+)$/)[1];
  
      const link = `http://localhost:3000/form/${formId}`;
  
      setFormLink(link);
      setPublished(true);
  
      // Redirect to the form link if needed
      navigate(`/form/${formId}`);
    } catch (error) {
      console.error('Error publishing form:', error);
    }
  };
  
  
  const handleAddComponent = (componentType) => {
    const newComponent = {
      type: componentType,
      title: '',
      question: `Enter your ${componentType} question here`,
      answer: '',
      options: componentType === 'Multiple-Choice Grid' || componentType === 'Tick-Box Grid' ? ['Option 1'] : [],
      displayNames: componentType === 'Multiple-Choice Grid' || componentType === 'Tick-Box Grid' ? ['Option 1'] : [],
    };

    setFormData((prevData) => {
      const newFormData = {
        ...prevData,
        components: [...prevData.components, newComponent],
      };

      setUndoStack((prevUndoStack) => [...prevUndoStack, prevData]); // Save the previous state to the undo stack
      return newFormData;
    });
  };

  const handleUndo = () => {
    if (undoStack.length > 0) {
      const previousState = undoStack.pop();
      setFormData(previousState);
      setUndoStack([...undoStack]);
      console.log('Undo clicked');
    }
  };

  const handleRemoveComponent = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      components: prevData.components.filter((_, i) => i !== index),
    }));
  };

  const handleOptionChange = (componentIndex, optionIndex, value) => {
    setFormData((prevData) => {
      const updatedComponents = [...prevData.components];
      updatedComponents[componentIndex].options[optionIndex] = value;

      // **Key change for checkboxes and radio buttons:**
      if (updatedComponents[componentIndex].type === 'Checkbox' || updatedComponents[componentIndex].type === 'Radio Button') {
        updatedComponents[componentIndex].options[optionIndex] = false; // Uncheck the option
      }

      updatedComponents[componentIndex].displayNames[optionIndex] = value;
      return { ...prevData, components: updatedComponents };
    });
  };

  const handleOptionCheckboxChange = (componentIndex, optionIndex, checked) => {
    setFormData((prevData) => {
      const updatedComponents = [...prevData.components];
  
      if (updatedComponents[componentIndex].type === 'Radio Button') {
        updatedComponents[componentIndex].options = updatedComponents[componentIndex].options.map((_, index) => index === optionIndex);
      } else {
        updatedComponents[componentIndex].options[optionIndex] = Boolean(checked);
      }
  
      return { ...prevData, components: updatedComponents };
    });
  };
  
  
  const handleAddOption = (componentIndex) => {
    setFormData((prevData) => {
      const updatedComponents = [...prevData.components];
      updatedComponents[componentIndex].options.push(false);
      updatedComponents[componentIndex].displayNames.push(`Option ${updatedComponents[componentIndex].options.length}`);
      return { ...prevData, components: updatedComponents };
    });
  };

  const handleTitleChange = (componentIndex, value) => {
    setFormData((prevData) => {
      const updatedComponents = [...prevData.components];
      updatedComponents[componentIndex].title = value;
      return { ...prevData, components: updatedComponents };
    });
  };

  const handleQuestionChange = (componentIndex, value) => {
    setFormData((prevData) => {
      const updatedComponents = [...prevData.components];
      updatedComponents[componentIndex].question = value; // Update to plain text
      return { ...prevData, components: updatedComponents };
    });
  };
  
  const handleAnswerChange = (componentIndex, value) => {
    setFormData((prevData) => {
      const updatedComponents = [...prevData.components];
      updatedComponents[componentIndex].answer = value; // Update to plain text
      return { ...prevData, components: updatedComponents };
    });
  };
  

  const handleFormTitleChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      formTitle: value,
    }));
  };

 const renderFormComponents = () => {
    return (
      
      formData.components &&
      formData.components.length > 0 &&
      formData.components.map((component, componentIndex) => (
        <Grid item xs={12} key={componentIndex}>
          <Paper style={{ marginBottom: '20px', padding: '10px', borderRadius: '12px', position: 'relative' }}>
            <Typography
              variant="subtitle1"
              display="flex"
              alignItems="center"
              style={{ marginBottom: '10px', background: '#f1f1f1', padding: '5px', borderRadius: '12px' }}
            >
              {componentIcons[component.type]} {component.type}
            </Typography>

            <Button
              variant="outlined"
              size="small"
              onClick={() => handleMoveQuestion(componentIndex, componentIndex - 1)}
              disabled={componentIndex === 0}
              style={{ marginRight: '10px' }}
            >
              <ArrowUpwardIcon />
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleMoveQuestion(componentIndex, componentIndex + 1)}
              disabled={componentIndex === formData.components.length - 1}
            >
              <ArrowDownwardIcon />
            </Button>
            
          {component.type === 'Text Paragraph' && (
            <div>
              <div>
                <label>Question:</label>
                <RichTextEditor
                  theme="snow"
                  value={component.question}
                  onChange={(value) => handleQuestionChange(componentIndex, value)}
                />
                
              </div>
              <div>
                <label>Answer:</label>
                <RichTextEditor
                  theme="snow"
                  value={component.answer}
                  onChange={(value) => handleAnswerChange(componentIndex, value)}
                />
              </div>
            </div>
          )}

          {['Radio Button', 'Checkbox', 'Multiple-Choice Grid', 'Tick-Box Grid', 'Drop-down'].includes(component.type) && (
            <div>
              <div>
                <label>Question:</label>
                <RichTextEditor
                  theme="snow"
                  value={component.question}
                  onChange={(value) => handleQuestionChange(componentIndex, value)}
                />
              </div>
              <div>
              {component.type === 'Radio Button' && (
              <div>
                {component.options.map((option, optionIndex) => (
                  <div key={optionIndex} style={{ marginBottom: '10px' }}>
                    <FormControlLabel
                      control={
                        <Radio
                          checked={option}
                          onChange={(e) => handleOptionCheckboxChange(componentIndex, optionIndex, e.target.checked)}
                        />
                      }
                      label={
                        <div>
                          <input
                            type="text"
                            value={component.displayNames[optionIndex]}
                            onChange={(e) => handleOptionChange(componentIndex, optionIndex, e.target.value)}
                          />
                        </div>
                      }
                    />
                  </div>
                ))}
                <Button variant="outlined" size="small" onClick={() => handleAddOption(componentIndex)}>
                  Add Option
                </Button>
              </div>
            )}


                {component.type === 'Checkbox' && (
                  <div>
                    {component.options.map((option, optionIndex) => (
                      <div key={optionIndex} style={{ marginBottom: '10px' }}>
                        <FormControlLabel
                          control={<MuiCheckbox checked={option} onChange={(e) => handleOptionCheckboxChange(componentIndex, optionIndex, e.target.checked)} />}
                          label={
                            <div>
                              <input
                                type="text"
                                value={component.displayNames[optionIndex]}
                                onChange={(e) => handleOptionChange(componentIndex, optionIndex, e.target.value)}
                              />
                            </div>
                          }
                        />
                      </div>
                    ))}
                    <Button variant="outlined" size="small" onClick={() => handleAddOption(componentIndex)}>
                      Add Option
                    </Button>
                  </div>
                )}

                {['Multiple-Choice Grid', 'Tick-Box Grid', 'Drop-down'].includes(component.type) && (
                  <div>
                    {component.options.map((option, optionIndex) => (
                      <div key={optionIndex} style={{ marginBottom: '10px' }}>
                        {component.type === 'Drop-down' ? (
                          <TextField
                            style={{ marginTop: 7 }}
                            label={`Option ${optionIndex + 1}`}
                            value={option}
                            onChange={(e) => handleOptionChange(componentIndex, optionIndex, e.target.value)}
                          />
                        ) : (
                          <>
                            <InputLabel>{`Option ${optionIndex + 1}:`}</InputLabel>
                            <RichTextEditor
                              theme="snow"
                              value={option}
                              onChange={(value) => handleOptionChange(componentIndex, optionIndex, value)}
                            />
                          </>
                        )}
                      </div>
                    ))}
                    <Button variant="outlined" size="small" onClick={() => handleAddOption(componentIndex)}>
                      Add Option
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {['Add Image', 'File Upload', 'Date', 'Time', 'QR Code'].includes(component.type) && (
            <div>
              <div>
                <label>Question:</label>
                <RichTextEditor
                  theme="snow"
                  value={component.question}
                  onChange={(value) => handleQuestionChange(componentIndex, value)}
                />
              </div>
              <div>
                {component.type === 'Add Image' && (
                  <div>
                    <InputLabel>Click to Upload Image:</InputLabel>
                    <input type="file" onChange={(e) => handleOptionChange(componentIndex, 0, e.target.files[0])} />
                  </div>
                )}

                {component.type === 'File Upload' && (
                  <div>
                    <InputLabel>Click to Upload File:</InputLabel>
                    <input type="file" onChange={(e) => handleOptionChange(componentIndex, 0, e.target.files[0])} />
                  </div>
                )}

                {component.type === 'Date' && (
                  <div>
                    <InputLabel>Select Date:</InputLabel>
                    <TextField
                      type="date"
                      value={component.options[0]}
                      onChange={(e) => handleOptionChange(componentIndex, 0, e.target.value)}
                    />
                  </div>
                )}

                {component.type === 'Time' && (
                  <div>
                    <InputLabel>Select Time:</InputLabel>
                    <TextField
                      type="time"
                      value={component.options[0]}
                      onChange={(e) => handleOptionChange(componentIndex, 0, e.target.value)}
                    />
                  </div>
                )}

                {component.type === 'QR Code' && (
                  <div>
                    <InputLabel>QR Code Content:</InputLabel>
                    <TextField
                      value={component.options[0]}
                      onChange={(e) => handleOptionChange(componentIndex, 0, e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          <Button variant="outlined" size="small" onClick={() => handleRemoveComponent(componentIndex)}>
            Remove
          </Button>
        </Paper>
      </Grid>
      )
    ));
  };

  const componentsList = [
    'Text Paragraph',
    'Radio Button',
    'Checkbox',
    'Multiple-Choice Grid',
    'Tick-Box Grid',
    'Drop-down',
    'Add Image',
    'File Upload',
    'Date',
    'Time',
    'QR Code',
  ];

  const renderComponent = (componentType) => {
    return (
      <div>
        {componentIcons[componentType]}
        <Typography variant="subtitle2">{componentType}</Typography>
      </div>
    );
  };


  return (
    <div>
    <nav>
        <Link to="/">Home</Link>
      </nav>

    <Grid container spacing={2}>
      <Grid item xs={3} style={{ borderRight: '1px solid #ccc', padding: '20px' }}>
        <Typography variant="h6">Form Components</Typography>
        {componentsList.map((component) => (
          <Button
            key={component}
            variant="outlined"
            size="small"
            onClick={() => handleAddComponent(component)}
            style={{ marginBottom: '10px', width: '100%' }}
          >
            {renderComponent(component)}
          </Button>
        ))}
      </Grid>

      <Grid item xs={8} style={{ margin: '0 auto', paddingLeft: '80px', paddingRight: '80px' }}>
        <Box position="absolute" top={80} right={10} display="flex" flexDirection="column">
          <Button variant="contained" color="primary" onClick={handleSaveForm}>
            Save
          </Button>
          <Button variant="contained" color="primary" onClick={handleUndo} style={{ marginTop: '10px' }}>
            Undo
          </Button>
        </Box>

        <Grid style={{ border: '1px solid #f1f1f1', padding: 10, borderRadius: 15, backgroundColor: '#f1f1f1' }}>
          <Typography style={{ fontSize: 30 }}>Form Title</Typography>
          <TextField
            label="Form Title"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.formTitle}
            onChange={(e) => handleFormTitleChange(e.target.value)}
            style={{ fontSize: '50px', background: '#f1f1f1', color: 'white', border: '2px solid' }}
          />
        </Grid>

        {(formData.components && formData.components.length === 0) ? (
          <Typography variant="body2" style={{ textAlign: 'center', fontStyle: 'italic' }}>
            Select a component to start editing
          </Typography>
        ) : (
          <Grid container spacing={2}>
            {renderFormComponents()}
          </Grid>
        )}
      </Grid>
    </Grid>
    </div>
  );
};

export default CreateFormPage;
