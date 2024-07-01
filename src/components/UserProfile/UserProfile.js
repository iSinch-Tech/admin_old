import React, { useState, useEffect } from 'react';
import { getCategories } from "../../api/categories";
import { updateUser } from "../../api/users";
import { downloadLink } from "../../api/files";
import UserRoles from '../../constants/userRoles';
import UserStatuses from '../../constants/userStatuses';

import {
	TextField,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
  Button,
  Box
} from '@mui/material';

const UserProfile = ({ user, onSave }) => {

	// const [error, setError] = useState(false);
  const [editUser, setEditUser] = useState(user);
	const [categories, setCategories] = useState([]);

	useEffect(() => {
		getCategories().then(({rows}) => {
			setCategories(rows);
		});
	}, []);

	const handleSubmit = (e) => {
    e.preventDefault();
		updateUser(user.id, editUser).then(() => {
      onSave && onSave(editUser);
    });
	};

	return (
    <form onSubmit={handleSubmit}>
      <TextField
        fullWidth
        style={{ margin: '10px 0 0 0'}}
        label="ФИО пользователя"
        variant="outlined"
        name="name"
        value={editUser.name ?? ''}
        onChange={(e) => { setEditUser(u => ({...u, name: e.target.value})) }}
      />
      <TextField
        fullWidth
        style={{ margin: '20px 0 0 0'}}
        label="Логин пользователя"
        variant="outlined"
        name="login"
        value={editUser.login ?? ''}
        onChange={(e) => { setEditUser(u => ({...u, login: e.target.value})) }}
      />
      <TextField
        fullWidth
        style={{ margin: '20px 0 0 0'}}
        label="Телефон"
        name="phone"
        variant="outlined"
        value={editUser.phone ?? ''}
        onChange={(e) => { setEditUser(u => ({...u, phone: e.target.value})) }}
      />
      {categories.length && (<FormControl fullWidth style={{marginTop: '20px'}}>
        <InputLabel id="select-category-label">Категория</InputLabel>
        <Select
          labelId="select-category-label"
          id="select-category"
          name="categoryId"
          value={editUser.categoryId ?? ''}
          label="Категория"
          onChange={(e) => { setEditUser(u => ({...u, categoryId: e.target.value})) }}
        >
          {categories?.map(c => (
            <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
          ))}
        </Select>
      </FormControl>)}
      <FormControl fullWidth style={{marginTop: '20px'}}>
        <InputLabel id="select-role-label">Роль</InputLabel>
        <Select
          labelId="select-role-label"
          id="select-role"
          name="role"
          value={editUser.role ?? ''}
          label="Роль"
          onChange={(e) => { setEditUser(u => ({...u, role: e.target.value})) }}
        >
          {Object.values(UserRoles).map(role => (<MenuItem key={role} value={role}>{role}</MenuItem>))}
        </Select>
      </FormControl>
      <FormControl fullWidth style={{marginTop: '20px'}}>
        <InputLabel id="select-status-label">Статус</InputLabel>
        <Select
          labelId="select-status-label"
          id="select-status"
          name="status"
          value={editUser.status ?? ''}
          label="Статус"
          onChange={(e) => { setEditUser(u => ({...u, status: e.target.value})) }}
        >
          {Object.values(UserStatuses).map(status => (<MenuItem key={status} value={status}>{status}</MenuItem>))}
        </Select>
      </FormControl>
      { editUser.driverLicenseId &&
        (
          <FormControl fullWidth style={{marginTop: '20px'}}>
            <label>Документ</label>
            <img width="300" src={downloadLink(editUser.driverLicenseId)} alt="Driver license" />
          </FormControl>
        )
      }
      <Box sx={{textAlign: 'right', marginTop: '20px'}}>
        <Button color="success" type="submit">Сохранить</Button>
      </Box>
    </form>
	)
};

export default UserProfile;