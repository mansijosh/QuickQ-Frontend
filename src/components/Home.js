import React, { useState } from 'react';
import { Paper, InputBase, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FormsList from './FormsList';  // Assuming you have a FormsList component

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreateFormClick = () => {
    navigate('/create-form');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '20px 0' }}>
      <Paper style={{ width: '100%', position: 'relative', marginBottom: 10, borderRadius: '2px', padding: '5px' }}>
        <InputBase
          placeholder="Search..."
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ padding: '5px 5px' }}
        />
      </Paper>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
        <Button
          variant="outlined"
          size="small"
          onClick={handleCreateFormClick}
          sx={{ color: 'navy', borderColor: 'navy', marginRight: 1 }}
        >
          Create Form
        </Button>
        <Button variant="outlined" size="small" sx={{ color: 'navy', borderColor: 'navy', marginRight: 1 }}>
          Draft
        </Button>
        <Button variant="outlined" size="small" sx={{ color: 'navy', borderColor: 'navy', marginRight: 1 }}>
          Active Forms
        </Button>
    
        <Button variant="outlined" size="small" sx={{ color: 'navy', borderColor: 'navy' }}>
          Closed Forms
        </Button>
      </div>

      {/* Include the FormsList component with the searchQuery prop */}
      <FormsList searchQuery={searchQuery} />
    </div>
  );
};

export default Home;
