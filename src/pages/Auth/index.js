import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Container, Button, TextField } from "@mui/material";
import CustomBox from "../../components/CustomBox"
import { logIn, isAuthorized } from "../../api/auth";

const AuthPage = () => {
	const [user, setUser] = useState({ login: '', pass: ''})
	const [error, setError] = useState(false)

	const navigate = useNavigate();

	if (isAuthorized()) {
		return navigate('/');
	}

	return (
		<Container style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
			<Helmet>
				<title>Авторизация</title>
			</Helmet>
			<CustomBox style={{ width: '400px'}}>
				<TextField
					style={{margin: '0 0 10px 0'}}
					fullWidth
					label="Логин"
					placeholder="Введите логин"
					variant="outlined"
					value={user.login}
					error={error}
					helperText={error ? "Неверные имя пользолвателя или пароль" : null}
					onChange={(e) => setUser(p => ({...p, login: e.target.value}))}
				/>
				<TextField
					style={{margin: '0 0 30px 0'}}
					fullWidth
					type="password"
					label="Пароль"
					placeholder="Введите логин"
					variant="outlined"
					value={user.pass}
					error={error}
					helperText={error ? "Неверные имя пользолвателя или пароль" : null}
					onChange={(e) => setUser(p => ({...p, pass: e.target.value}))}
				/>
				<Button
					style={{height: '56px'}}
					variant="contained"
					fullWidth
					onClick={() => logIn(user)
						.then(() => {
							navigate('/users');
						})
						.catch(err => {
							setError(err)
						})
					}
				>
					Войти
				</Button>
			</CustomBox>
		</Container>
	)
}

export default AuthPage;