import React, { useState, useEffect } from "react";
import {Link, useParams, useSearchParams} from "react-router-dom";
import {getCategorie} from '../../api/categories';
import {getTickets, deleteTicket} from '../../api/tickets';

import Page from "../../components/Page";
import RemoveConfirmDialog from "../../components/RemoveConfirmDialog"
import CustomBox from "../../components/CustomBox"
import RollBack from "../../components/RollBack"

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
	Grid,
	CircularProgress,
} from '@mui/material'
import Pagination from '@mui/material/Pagination';

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';

const TicketsPage = () => {
	const { categoryId } = useParams();
	const [searchParams, setSearchParams] = useSearchParams();
	const [tickets, setTickets] = useState([]);
	const [loading, setLoading] = useState(true);
	const [category, setCategory] = useState(null);
	const [isOpenConfirm, setOpenConfirmState] = useState(false);
	const [selectedTicket, setSelectedTicket] = useState(null);
	const [paginationState, setPaginationState] = useState({
		count: 0,
		page: +(searchParams.get('page') ?? 1),
		limit: 100,
	});
	const [forceReload, setForceReload] = useState(0);

	useEffect(() => {
		async function fetchData() {
			setLoading(true);
			await getCategorie(categoryId).then((res) => setCategory(res));
			await getTickets(
				{ categoryId },
				(paginationState.page - 1) * paginationState.limit,
				paginationState.limit
			).then(({ rows, count }) => {
				setTickets(rows);
				setPaginationState(p => ({
					...p,
					count: Math.ceil(count / paginationState.limit),
				}));
			});
			setLoading(false);
			setSearchParams({
				page: paginationState.page
			});
		}
		
		fetchData();
	},[categoryId, paginationState.page, paginationState.limit, forceReload])

	return (
		<Page title={`Билеты ${categoryId.toUpperCase()}`}>
			{loading ? (
				<CircularProgress style={{ position: 'absolute', top: '50%', left: '50%'}}/>
			) : (
				<>
					<RemoveConfirmDialog
						open={isOpenConfirm}
						closeHandler={() => setOpenConfirmState(p => false)}
						keyword="билета"
						data={<>билет <b>{selectedTicket?.name}</b></>}
						submitHandler={
							() => {
								deleteTicket(selectedTicket.id).then(() => {
									setOpenConfirmState(false);
									setForceReload(it => ++it);
								});
							}
						}
					/>
					<RollBack to="/categories" title="На страницу категорий"/>
					<CustomBox style={{margin: '5px 0 10px 0'}}>
						<Grid container spacing={2} alignItems="center">
							<Grid item xs={9}>
								<Typography
									variant="h4"
									gutterBottom
									style={{fontWeight: '700'}}
								>
									Билеты (категория {category?.name})
								</Typography>
							</Grid>
							<Grid item xs={3}>
								<Link to={`/tickets/${category?.id}/new`}>
									<Button
										style={{height: '36px', display: 'flex'}}
										variant="contained"
										fullWidth
										onClick={() => {}}
									>
										<AddCircleOutlineIcon style={{margin: '0 10px 0 0'}}/>
										Создать новый билет
									</Button>
								</Link>
							</Grid>
						</Grid>
					</CustomBox>
					<TableContainer component={Paper} style={{margin: '0 0 15px 0'}}>
						<Table sx={{minWidth: 500}} aria-label="custom pagination table">
							<TableHead style={{opacity: '0.5'}}>
								<TableRow>
									<TableCell style={{fontWeight: 'bold'}} component="th" scope="row">
										<Typography variant="overline" style={{margin: '20px 0'}}>Название</Typography>
									</TableCell>
									<TableCell style={{width: 260, fontWeight: 'bold'}} align="right"></TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{tickets.map((ticket, idx) => (
									<TableRow key={ticket.name} hover style={{ background: !(idx % 2) ? '#f4f4f4' : 'white'}}>
										<TableCell style={{padding: '0 16px'}} component="th" scope="row">
											<Typography variant="overline" style={{margin: '20px 0'}}>
												<Link to={`/tickets/${category?.id}/${ticket.id}`} style={{ display: 'flex', alignItems: 'center'}}>
													<ConfirmationNumberIcon style={{ margin: '0 10px 0 0'}}/>
													{ticket.name}
												</Link>
											</Typography>
										</TableCell>
										<TableCell style={{width: 260, padding: '0 16px'}} align="right">
											<IconButton
												onClick={() => {
													setSelectedTicket({id: ticket.id, name: ticket.name});
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
						</Table>
					</TableContainer>
					<div style={{ display: 'flex', justifyContent: 'center'}}>
						{tickets.length ? (
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
				</>
			)}

		</Page>
	)
}

export default TicketsPage;
