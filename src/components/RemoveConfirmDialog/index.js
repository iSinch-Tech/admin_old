import React from 'react';

import {
	DialogTitle,
	Dialog,
	DialogContent,
	Typography,
	DialogActions,
	Button,
} from '@mui/material';

const RemoveConfirmDialog = ({ open, closeHandler, keyword, data, submitHandler }) => {
	return (
		<Dialog onClose={closeHandler} open={open}>
			<DialogTitle>Удаление {keyword}</DialogTitle>
			<DialogContent>
				<Typography variant="caption">Вы действительно хотите удалить {data} ?</Typography>
			</DialogContent>
			<DialogActions>
				<Button onClick={closeHandler}>Отменить</Button>
				<Button onClick={submitHandler} autoFocus color="error">Удалить</Button>
			</DialogActions>
		</Dialog>
	)
};

export default RemoveConfirmDialog;