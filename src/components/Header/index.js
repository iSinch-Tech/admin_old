import React, { useState } from "react";
import {NavLink} from "react-router-dom";

import { logOut } from "../../api/auth";

import {
	AppBar,
	Box,
	Toolbar,
	IconButton,
	Typography,
	Menu,
	Container,
	Avatar,
	Button,
	Tooltip,
	MenuItem,
	Link
} from '@mui/material';

import { pages } from '../../constants'

import logo from '../../assets/icon.jpeg';

const Header = () => {
	const [anchorElUser, setAnchorElUser] = useState(null);

	const handleOpenUserMenu = (event) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	return (
		<AppBar position="static">
			<Container maxWidth="xl">
				<Toolbar disableGutters>
					<Box sx={{flexGrow: 1, display: {xs: 'flex', md: 'flex'}}}>
						{pages.map(({title, to, icon: Icon}) => (
							<Button
								{...(Icon && {startIcon: <Icon />})}
								variant="contained"
								key={title}
								component={NavLink}
								to={to}
								sx={{
									my: 2,
									color: 'white',
									display: 'flex',
									alignItems: 'center',
									margin: '0 20px 0 0',
									background: '#545454',
									'&.active': {
										color: 'red'
									}
								}}
							>
								{title}
							</Button>
						))}
					</Box>
					<Box sx={{flexGrow: 0}}>
						<Tooltip title="Открыть меню">
							<IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
								<Avatar>
									<img src={logo} alt="" style={{ width: '40px', objectFit: 'contain'}}/>
								</Avatar>
							</IconButton>
						</Tooltip>
						<Menu
							sx={{mt: '45px'}}
							id="menu-appbar"
							anchorEl={anchorElUser}
							anchorOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							keepMounted
							transformOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							open={Boolean(anchorElUser)}
							onClose={handleCloseUserMenu}
						>
							<MenuItem>
								<Link href="https://school.cpvptz.ru">
									<Typography textAlign="center">На сайт</Typography>
								</Link>
							</MenuItem>
							<MenuItem onClick={() => {logOut()}}>
								<Typography textAlign="center">Выйти</Typography>
							</MenuItem>
						</Menu>
					</Box>
				</Toolbar>
			</Container>
		</AppBar>
	)
}

export default Header;