
import React from 'react';
import Button from '@mui/material/Button';
import UndoIcon from '@mui/icons-material/Undo';

const UndoButton = ({ onUndo }) => {
  return (
    <Button
      variant="contained"
      color="secondary"
      startIcon={<UndoIcon />}
      onClick={onUndo}
      style={{ marginRight: '10px', marginTop: '10px' }}
    >
      Undo
    </Button>
  );
};

export default UndoButton;
