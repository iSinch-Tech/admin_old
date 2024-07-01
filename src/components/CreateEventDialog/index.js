import React, { useState } from 'react';
import moment from 'moment';
import {
	DialogTitle,
	Dialog,
	DialogContent,
	IconButton,
  TextField,
  Button,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const CreateEventDialog = ({ slot, onClose }) => {
  const [count, setCount] = useState(3);
  return (slot &&
    (<Dialog onClose={() => onClose()} open={true} maxWidth="sm">
      <DialogTitle sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        Добавить на {moment(slot.start).format('DD.MM.YYYY')}
        <IconButton 
          type="submit"
          variant="contained"
          sx={{marginLeft: '10px'}}
          onClick={() => onClose()}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers style={{width: '400px'}}>
        <TextField
            fullWidth
            style={{ margin: '10px 0 0 0'}}
            label="Кол-во слотов"
            variant="outlined"
            name="count"
            onChange={(e) => setCount(e.target.value)}
            value={count}
          />
        <Box sx={{textAlign: 'right', marginTop: '20px'}}>
          <Button variant="contained" color="primary" onClick={() => onClose(count)}>Добавить</Button>
        </Box>
      </DialogContent>
    </Dialog>)
  )
};

export default CreateEventDialog;