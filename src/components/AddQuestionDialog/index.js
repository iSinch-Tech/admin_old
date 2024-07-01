import React, { useState } from 'react';
import { searchQuestion } from "../../api/questions";

import {
	DialogTitle,
	Dialog,
	DialogContent,
	TextField,
	DialogActions,
	Button, Grid, Typography,
} from '@mui/material';
import SearchIcon from "@mui/icons-material/Search";


const AddQuestionDialog = ({open, closeHandler, changeQuestion, filter = {}}) => {
	const [searchValue, setSearchValue] = useState('');
	const [questions, setQuestions] = useState([]);

	const searchHandler = () => {
		searchQuestion({
			...filter,
			name: `%${searchValue}%`,
		}).then(({ rows }) => setQuestions(rows));
	};

	return (
		<Dialog onClose={closeHandler} maxWidth={'1000px'} open={open}>
			<DialogTitle>Выбрать вопрос</DialogTitle>
			<DialogContent style={{ width: '1000px', maxWidth: '1000px' }}>
				<Grid container spacing={2} alignItems="center" marginBottom="20px">
					<Grid item xs={10}>
						<TextField
							style={{margin: '24px 0 0 0'}}
							fullWidth
							label="Вопрос"
							placeholder="Введите вопрос"
							variant="outlined"
							value={searchValue}
							onChange={(e) => setSearchValue(e.target.value)}
						/>
					</Grid>
					<Grid item xs={2}>
						<Button
							style={{height: '56px', margin: '24px 0 0 0'}}
							variant="contained"
							fullWidth
							onClick={searchHandler}
						>
							<SearchIcon style={{margin: '0 10px 0 0'}}/>
							Найти
						</Button>
					</Grid>
				</Grid>
				{questions.map(item => {
					return (
						<Grid key={item.id} container alignItems="flex-start" padding="16px 0" id="quest">
							<Grid item xs={9}>
								<Typography variant="overline" lineHeight={2.06}>{item.name}</Typography>
								{
									item.tickets.length > 0 && (
										<Typography variant="subtitle2">
											Добавлен в билеты: {item.tickets.map(t => t.name).join(', ')}	
										</Typography>
									)
								}
								{
									item.topics.length > 0 && (
										<Typography variant="subtitle2">
											Добавлен в темы: {item.topics.map(t => t.name).join(', ')}	
										</Typography>
									)
								}
							</Grid>
							<Grid item xs={3}>
								<Button
									style={{height: '36px'}}
									variant="contained"
									fullWidth
									onClick={() => {
										changeQuestion(item.id, item.name);
										setSearchValue('');
										setQuestions([]);
									}}
								>
									Выбрать вопрос
								</Button>
							</Grid>
						</Grid>
					)
				})}
			</DialogContent>
			<DialogActions>
				<Button onClick={closeHandler}>Отменить</Button>
			</DialogActions>
		</Dialog>
	)
};

export default AddQuestionDialog;