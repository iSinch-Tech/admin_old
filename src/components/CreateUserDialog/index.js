import React, { useState, useEffect } from 'react';
import { getCategories } from "../../api/categories";
import translitRuEn from '../../utils';
import { createUser } from '../../api/users';
import UserRoles from '../../constants/userRoles';

import {
	DialogTitle,
	Dialog,
	DialogContent,
	TextField,
	DialogActions,
	Button,
	Select,
	MenuItem,
	FormControl,
	InputLabel
} from '@mui/material';

const EMPTY_USER = {name: '', login: '', password: '', role: 'USER'};

const CreateUserDialog = ({open, closeHandler, submitHandler }) => {

	const [newUser, setNewUser] = useState(EMPTY_USER);
	const [error, setError] = useState(false);
	const [categories, setCategories] = useState([]);

	useEffect(() => {
		getCategories().then(({rows}) => {
			if (rows.length) {
				setNewUser(u => ({...u, categoryId: rows[0].id}))
			}
			setCategories(rows);
		});
	}, []);

	const handleClose = () => {
		closeHandler();
	};

	const handleSubmit = () => {
		setError(false);
		createUser(newUser)
			.then((user) => {
				submitHandler(user);
				setNewUser(EMPTY_USER);
			})
			.catch(() => setError(true));
	};

	return (
		<Dialog onClose={handleClose} open={open}>
			<DialogTitle>Создание пользователя</DialogTitle>
			<DialogContent style={{ width: '400px' }}>
				<TextField
					fullWidth
					style={{ margin: '10px 0 0 0'}}
					label="Введите ФИО пользователя"
					variant="outlined"
					value={newUser.name}
					onChange={ (e) => setNewUser(u => ({...u, name: e.target.value, login: translitRuEn(e.target.value)})) }
				/>
				<TextField
					fullWidth
					style={{ margin: '20px 0 0 0'}}
					label="Введите логин пользователя"
					variant="outlined"
					value={newUser.login}
					error={error}
					helperText={error ? "Пользователь с таким логином уже существует" : null}
					onChange={ (e) => setNewUser(u => ({...u, login: e.target.value})) }
				/>
				<TextField
					fullWidth
					style={{ margin: '20px 0 0 0'}}
					label="Введите пароль"
					variant="outlined"
					value={newUser.password}
					onChange={ (e) => setNewUser(u => ({...u, password: e.target.value})) }
				/>
				<FormControl fullWidth style={{marginTop: '20px'}}>
					<InputLabel id="select-category-label">Категория</InputLabel>
					<Select
						labelId="select-category-label"
						id="select-category"
						value={newUser.categoryId ?? ''}
						label="Категория"
						onChange={(e) => { setNewUser(u => ({...u, categoryId: e.target.value})) }}
					>
						{categories?.map(c => (
							<MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
						))}
					</Select>
				</FormControl>
				<div style={{width: '100%', height: '1px', background: '#cbcbcb', margin: '20px 0 20px 0'}}/>
				<Select
					fullWidth
					value={newUser.role}
					defaultValue="USER"
					onChange={(e) => { setNewUser(u => ({...u, role: e.target.value})) }}
				>
					{Object.values(UserRoles).map(role => (<MenuItem key={role} value={role}>{role}</MenuItem>))}
				</Select>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose}>Отменить</Button>
				<Button onClick={() => handleSubmit()} autoFocus color="success" disabled={!newUser.name || !newUser.login || !newUser.password}>Создать</Button>
			</DialogActions>
		</Dialog>
	)
};

export default CreateUserDialog;