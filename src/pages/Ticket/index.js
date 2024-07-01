import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {getCategorie} from '../../api/categories';
import {getTicket, createTicket, updateTicket, deleteTicket} from '../../api/tickets';

import Page from "../../components/Page";
import RemoveConfirmDialog from "../../components/RemoveConfirmDialog"
import AddQuestionDialog from "../../components/AddQuestionDialog"
import CustomBox from "../../components/CustomBox"
import RollBack from "../../components/RollBack"

import {
	Button,
	Typography,
	Grid,
	TextField,
	CircularProgress,
} from '@mui/material'

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import './style.css';


const TicketPage = () => {
	const { categoryId, ticketId } = useParams();
	const isNew = ticketId === 'new';
	const [loading, setLoading] = useState(true);
	const [isOpenConfirm, setOpenConfirmState] = useState(false);
	const [isOpenAddDialog, setOpenAddDialog] = useState(false);
	const [categoryInfo, setCategoryInfo] = useState(null);
	const [ticket, setTicket] = useState({
		name: '',
		questions: []
	});
	const [selectedTicket, setSelectedTicket] = useState(null);

	const navigate = useNavigate();

	const saveHandler = () => {
		if (isNew) {
			createTicket({
				name: ticket.name,
				categoryId: categoryInfo.id,
				questions: ticket.questions.map(i => i.id)
			}).then(() => {
				navigate(`/tickets/${categoryInfo.id}`);
			});
		} else {
			updateTicket(
				ticket.id,
				{
					name: ticket.name,
					categoryId: ticket.categoryId,
					questions: ticket.questions.map(i => i.id)
				}
			).then(() => {
				navigate(`/tickets/${categoryInfo.id}`);
			});
		}
	};

	useEffect(() => {
		async function fetchData() {
			setLoading(true);
			await getCategorie(categoryId).then(res => setCategoryInfo(res));
			if (!isNew) {
				await getTicket(ticketId).then(res => {
					setTicket(res);
				});
			}
			setLoading(false);
		}

		fetchData();
	},[categoryId, ticketId, isNew]);

	const questionsCount = 20;

	return (
		<Page title={isNew
			? `Создание нового билета (категория ${categoryInfo?.name})`
			: `${ticket?.name} (категория ${categoryInfo?.name})`
		}>
			{loading ? (
				<CircularProgress style={{ position: 'absolute', top: '50%', left: '50%'}}/>
			) : (
				<>
					<RemoveConfirmDialog
						open={isOpenConfirm}
						closeHandler={() => {
							setOpenConfirmState(false)
						}}
						keyword="билета"
						data={`${ticket?.name}`}
						submitHandler={() => {
							deleteTicket(ticket.id).then(() => {
								navigate(`/tickets/${categoryInfo.id}`);
							});
						}}
					/>
					<AddQuestionDialog
						open={isOpenAddDialog}
						closeHandler={ () => setOpenAddDialog(false) }
						filter={{categoryId}}
						changeQuestion={(id, name) => {
							setTicket(p => {
								p.questions[selectedTicket] = { id, name };
								return { ...p };
							});
							setSelectedTicket(null);
							setOpenAddDialog(false);
						}}
					/>
					<RollBack onClick={() => navigate(-1)} title="На страницу билетов"/>
					<CustomBox style={{margin: '5px 0 10px 0'}}>
						<Grid container spacing={2} alignItems="center">
							<Grid item xs={isNew ? 8 : 6}>
								<Typography
									variant="h4"
									gutterBottom
									style={{fontWeight: '700'}}
								>
									{isNew
										? `Создание нового билета (категория ${categoryInfo?.name})`
										: `${ticket?.name} (категория ${categoryInfo?.name})`
									}
								</Typography>
							</Grid>
							<Grid item xs={isNew ? 4 : 3}>
								<Button
									style={{height: '36px', display: 'flex'}}
									variant="contained"
									fullWidth
									onClick={() => {saveHandler()}}
								>
									<CheckCircleIcon style={{margin: '0 10px 0 0'}}/>
									Сохранить билет
								</Button>
							</Grid>
							{!isNew && (
								<Grid item xs={3}>
									<Button
										color="error"
										style={{height: '36px', display: 'flex'}}
										variant="contained"
										fullWidth
										onClick={() => setOpenConfirmState(true)}
									>
										<DeleteForeverIcon style={{margin: '0 10px 0 0'}}/>
										Удалить билет
									</Button>
								</Grid>
							)}
						</Grid>
					</CustomBox>
					<CustomBox style={{margin: '0 0 40px 0'}}>
						<TextField
							style={{margin: '24px 0 0 0'}}
							fullWidth
							label="Название Билета"
							placeholder="Введите название билета"
							variant="outlined"
							key={ticket.id}
							value={ticket.name}
							onChange={(e) => setTicket(p => ({...p, name: e.target.value}))}
						/>
						<Typography
							variant="h5"
							gutterBottom
							style={{fontWeight: '700',margin: '20px 0 0 0'}}
						>
							Блок вопросов
						</Typography>
						<div>
						{Array(questionsCount).fill(null).map((_, i) => {
							const item = ticket?.questions[i] ?? {}
							return (
								<div
									key={i}
									className="question"
								>
									<Button
										style={{
											height: '36px',
											display: 'flex',
											position: 'absolute',
											top: '8px',
											right: '8px'
										}}
										variant="contained"
										onClick={() => {
											setOpenAddDialog(true);
											setSelectedTicket(i)
										}}
									>
										Выбрать вопрос
									</Button>
									<div style={{ boxSizing: 'border-box', padding: '0 200px 0 0'}}>
										<Typography variant="caption" style={{color: '#676767'}}><b>{`Вопрос №${i + 1} `}</b></Typography>
										{ 
											item.id && (
												<Link to={`/questions/${item.id}`} style={{margin: '8px 0'}}>
													<Typography variant="body1">{item.name}</Typography>
												</Link>
											)
										}
									</div>
								</div>
							)
						})}
						</div>
						<Button
							style={{height: '56px', display: 'flex', margin: '20px 0 0 0'}}
							variant="contained"
							fullWidth
							onClick={() => {saveHandler()}}
						>
							<CheckCircleIcon style={{margin: '0 10px 0 0'}}/>
							Сохранить билет
						</Button>
					</CustomBox>
				</>
			)}
		</Page>
	)
}

export default TicketPage;
