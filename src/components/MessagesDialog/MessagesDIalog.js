import React, { useState } from 'react';
import {
	DialogTitle,
	Dialog,
	DialogContent,
	Button,
  IconButton,
} from '@mui/material';

import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import Messages from '../Messages';

const MessagesDialog = ({userId}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button
        color="info"
        sx={{height: '36px', marginBottom: '10px'}}
        variant="contained"
        fullWidth
        onClick={() => setIsOpen(true)}
        startIcon={<ChatIcon />}
      >
        Сообщения
      </Button>
      {isOpen && (<Dialog onClose={() => setIsOpen(false)} open={isOpen} maxWidth="md">
        <DialogTitle sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          Сообщения
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
          <Messages userId={userId} />
        </DialogContent>
      </Dialog>)}
    </>
  );
};

export default MessagesDialog;