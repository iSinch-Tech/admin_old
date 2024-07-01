import React, { useState } from 'react';

import {
	DialogTitle,
	Dialog,
	DialogContent,
	Button,
	IconButton,
} from '@mui/material';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import CloseIcon from '@mui/icons-material/Close';
import UserProfile from '../UserProfile';

const EditUserDialog = ({ user, onlyIcon, onSave }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      { onlyIcon ? (
        <IconButton
          color="info"
          variant="contained"
          onClick={() => setIsOpen(true)}
        >
          <AssignmentIndIcon />
        </IconButton>
      ) : (
      <Button
        
        sx={{height: '36px', marginBottom: '10px'}}
        variant="contained"
        fullWidth
        onClick={() => setIsOpen(true)}
        startIcon={<AssignmentIndIcon />}
      >
        Профиль
      </Button>
      )}
      {isOpen && (<Dialog onClose={() => setIsOpen(false)} open={isOpen} maxWidth="md">
        <DialogTitle sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
					Профиль
          <IconButton 
            type="submit"
            variant="contained"
            sx={{marginLeft: '10px'}}
            onClick={() => setIsOpen(false)}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers style={{width: '852px'}}>
          <UserProfile user={user} onSave={(updatedUser) => {
            setIsOpen(false);
            onSave && onSave(updatedUser);
          }}/>
        </DialogContent>
      </Dialog>)}
    </>
  );
};

export default EditUserDialog;

