import React, { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { updateUser, deleteUser, searchUsers } from "../../api/users";

import Page from "../../components/Page";
import RemoveConfirmDialog from "../../components/RemoveConfirmDialog"
import CreateUserDialog from "../../components/CreateUserDialog"
import EditUserDialog from "../../components/EditUserDialog";
import CustomBox from "../../components/CustomBox"

import {
	Table,
	Button,
	TableHead,
	TableBody,
	TableCell,
	Typography,
	TableContainer,
	TableRow,
	Paper,
	IconButton,
	TextField,
	Grid,
	Box,
	Tabs,
	Tab,
} from '@mui/material'
import Pagination from '@mui/material/Pagination';

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import PersonSearchOutlinedIcon from '@mui/icons-material/PersonSearchOutlined';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import PersonIcon from '@mui/icons-material/Person';
import UserStatuses from "../../constants/userStatuses";

const UsersPage = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [users, setUsers] = useState([]);
	const [searchValue, setSearchValue] = useState('');
	const [status, setStatus] = useState(UserStatuses.ACTIVE);
	const [isOpenConfirm, setOpenConfirmState] = useState(false);
	const [isOpenCreate, setOpenCreateState] = useState(false);
	const [selectedUser, setSelectedUser] = useState(null);
	const [paginationState, setPaginationState] = useState({
		count: 0,
		page: +(searchParams.get('page') ?? 1),
		limit: 10,
	});
	const [forceReload, setForceReload] = useState(0);

	const renderTableBody = useMemo(
		() => (
			<TableBody>
				{users.map((user) => (
					<TableRow key={user.login} hover>
						<TableCell style={{padding: '0 16px'}} component="th" scope="row">
							<Typography variant="overline" style={{margin: '20px 0'}}>
								<Link to={`/users/${user.id}`} style={{ display: 'flex', alignItems: 'center'}}>
									<PersonIcon style={{ margin: '0 10px 0 0'}}/>
									{user.name}
								</Link>
							</Typography>
						</TableCell>
						<TableCell style={{width: 130, padding: '0 16px'}} align="right">
							<Typography variant="overline" style={{margin: '20px 0'}}>{user.login}</Typography>
						</TableCell>
						<TableCell style={{width: 130, padding: '0 16px'}} align="right">
							<Typography variant="overline" style={{margin: '20px 0'}}>{user.phone}</Typography>
						</TableCell>
						<TableCell style={{width: 130, padding: '0 16px'}} align="right">
							<Typography variant="overline" style={{margin: '20px 0'}}>{user.category?.name}</Typography>
						</TableCell>
						<TableCell style={{width: 130, padding: '0 16px'}} align="right">
							{
								status === UserStatuses.UNCONFIRMED && (
									<IconButton
										onClick={() => {
											const userId = user.id;
											updateUser(userId, { status: UserStatuses.ACTIVE }).then(() => {
												setUsers((users) => users.filter(u => u.id !== userId));
											});
										}}
										aria-label="first page"
									>
										<HowToRegIcon color="success"/>
									</IconButton>
								)
							}
							<EditUserDialog user={user} onlyIcon={true} onSave={(updatedUser) => {
								setUsers(users => {
									const index = users.findIndex(u => u.id === user.id);
									if (users[index].status !== updatedUser.status) {
										users.splice(index, 1);
									}	else {
										users[index] = updatedUser;
									}
									return [...users];
								})
							}}/>
							<IconButton
								onClick={() => {
									setSelectedUser({id: user.id, name: user.name});
									setOpenConfirmState(true);
								}}
								aria-label="first page"
							>
								<DeleteForeverIcon color="error"/>
							</IconButton>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		),
		[users]
	);

	const searchHandler = () => {
		searchUsers({status, name: `%${searchValue}%`}).then(({ rows, count }) => {
			setUsers(rows);
			setPaginationState(p => ({
				...p,
				count: Math.ceil(count / paginationState.limit),
			}));
		});
	};

	const reloadPage = (page) => {
		if (page !== paginationState.page) {
			setPaginationState(p => ({
				...p,
				page,
			}));
		} else {
			setForceReload(it => ++it)
		}
	}

	useEffect(() => {
		searchUsers(
			{ status },
			(paginationState.page - 1) * paginationState.limit,
			paginationState.limit
		).then(({ rows, count }) => {
			setUsers(rows);
			setPaginationState(p => ({
				...p,
				count: Math.ceil(count / paginationState.limit),
			}));
			setSearchParams({
				page: paginationState.page
			});
		});
	},[paginationState.page, paginationState.limit, status, forceReload])

	return (
		<Page title="Пользователи">
			<RemoveConfirmDialog
				open={isOpenConfirm}
				closeHandler={() => setOpenConfirmState(false)}
				keyword="пользователя"
				data={selectedUser?.name}
				submitHandler={() => {
					(status === UserStatuses.ACTIVE ? updateUser(selectedUser.id, {status: UserStatuses.INACTIVE}) : deleteUser(selectedUser.id)).then(() => {
						setOpenConfirmState(false);
						reloadPage(paginationState.page);
					});
				}}
			/>
			<CreateUserDialog
				open={isOpenCreate}
				closeHandler={() => {
					setOpenCreateState(false);
				}}
				submitHandler={() => {
					setOpenCreateState(false);
					reloadPage(1);
				}}
			/>
			<CustomBox style={{margin: '40px 0 10px 0'}}>
				<Grid container spacing={2} alignItems="center">
					<Grid item xs={8}>
						<Typography
							variant="h4"
							gutterBottom
							style={{ fontWeight: '700'}}
						>
							Пользователи
						</Typography>
					</Grid>
					<Grid item xs={4}>
						<Button
							style={{height: '36px', display: 'flex'}}
							variant="contained"
							fullWidth
							onClick={() => setOpenCreateState(p => !p)}
						>
							<PersonAddAltOutlinedIcon style={{margin: '0 10px 0 0'}}/>
							Создать нового пользователя
						</Button>
					</Grid>
				</Grid>
				<Grid container spacing={2} alignItems="center">
					<Grid item xs={10}>
						<TextField
							style={{margin: '24px 0 0 0'}}
							fullWidth
							label="Имя пользователя"
							placeholder="Введите имя пользователя"
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
							<PersonSearchOutlinedIcon style={{margin: '0 10px 0 0'}}/>
							Найти
						</Button>
					</Grid>
				</Grid>
			</CustomBox>
			<TableContainer component={Paper} style={{margin: '0 0 15px 0'}}>
				<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
					<Tabs value={status} onChange={(_, value) => setStatus(value)}>
						<Tab label="Активные" value={UserStatuses.ACTIVE} />
						<Tab label="Не активные" value={UserStatuses.INACTIVE} />
						<Tab label="Ожидающие подтверждения" value={UserStatuses.UNCONFIRMED} />
					</Tabs>
				</Box>
				<Table sx={{minWidth: 500}} aria-label="custom pagination table">
					<TableHead style={{opacity: '0.5'}}>
						<TableRow>
							<TableCell style={{fontWeight: 'bold'}} component="th" scope="row">
								<Typography variant="overline" style={{margin: '20px 0'}}>Имя пользователя</Typography>
							</TableCell>
							<TableCell style={{width: 130, fontWeight: 'bold'}} align="right">
								<Typography variant="overline" style={{margin: '20px 0'}}>Логин</Typography>
							</TableCell>
							<TableCell style={{width: 130, fontWeight: 'bold'}} align="right">
								<Typography variant="overline" style={{margin: '20px 0'}}>Телефон</Typography>
							</TableCell>
							<TableCell style={{width: 130, fontWeight: 'bold'}} align="right">
								<Typography variant="overline" style={{margin: '20px 0'}}>Категория</Typography>
							</TableCell>
							<TableCell style={{width: 130, fontWeight: 'bold'}} align="right"></TableCell>
						</TableRow>
					</TableHead>
					{renderTableBody}
				</Table>
			</TableContainer>
			<div style={{ display: 'flex', justifyContent: 'center'}}>
				{(users.length) ? (
					<Pagination
						style={{margin: '0 auto 40px'}}
						count={paginationState.count}
						defaultPage={1}
						page={paginationState.page}
						siblingCount={0}
						onChange={(e, pn) => {setPaginationState(p => ({...p, page: pn}))}}
					/>
				) : (
					<Typography variant="overline" style={{margin: '20px 0'}}>Ничего не найдено</Typography>
				)}

			</div>
		</Page>
	)
}

export default UsersPage;