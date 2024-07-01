import React from 'react';
import { Link } from "react-router-dom";
import moment from 'moment';
import {
	DialogTitle,
	Dialog,
	DialogContent,
	IconButton,
  TextField,
  Button,
  Box,
  InputAdornment
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';

const EditEventDialog = ({ event, onClose }) => {
  return (event &&
    (<Dialog onClose={() => onClose({action: 'close'})} open={true} maxWidth="sm">
      <DialogTitle sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        {moment(event.start).format('DD.MM.YYYY')}
        <IconButton 
          type="submit"
          variant="contained"
          sx={{marginLeft: '10px'}}
          onClick={() => onClose({action: 'close'})}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers style={{width: '400px'}}>
        {event.cell.userId &&
          (<TextField
            fullWidth
            style={{ margin: '10px 0 0 0'}}
            label="ФИО пользователя"
            variant="outlined"
            name="name"
            readOnly
            value={event.cell.user.name}
            InputProps={{
              endAdornment: <InputAdornment position="end">
                  <IconButton component={Link} to={`/users/${event.cell.userId}`} target="_blank">
                    <AssignmentIndIcon />
                  </IconButton>
                </InputAdornment>
            }}
          />)
        }
        <Box sx={{textAlign: 'right', marginTop: '20px'}}>
          {event.cell.userId &&
            <Button variant="contained" color="warning" onClick={() => onClose({action: 'update', data: {id: event.id, userId: null}})}>Освободить слот</Button>
          }
          <Button sx={{marginLeft: '10px'}} variant="contained" color="error" onClick={() => onClose({action: 'delete', data: {id: event.id}})}>Удалить слот</Button>
        </Box>
      </DialogContent>
    </Dialog>)
  )
};

export default EditEventDialog;