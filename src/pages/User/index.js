import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getUser, getStatistics } from "../../api/users";
import { getExams, deleteExams } from "../../api/exams";
// import { getCategories } from "../../api/categories";

import { timeFormat } from '../../utils';

import Page from "../../components/Page";
import RemoveConfirmDialog from "../../components/RemoveConfirmDialog";
import CustomBox from "../../components/CustomBox";
import RollBack from "../../components/RollBack";
import MessagesDialog from "../../components/MessagesDialog";

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
	Grid,
	Tooltip,
	Box,
	Tabs,
	Tab,
	// FormControl,
	// InputLabel,
	// Select,
	// MenuItem
} from '@mui/material'

import CircularProgress from "@mui/material/CircularProgress";
import PersonIcon from '@mui/icons-material/Person';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditUserDialog from "../../components/EditUserDialog";

const UserPage = () => {
	const { userId } = useParams();
	const [isOpenConfirm, setOpenConfirmState] = useState(false);
	const [user, setUser] = useState({});
	const [statistics, setStatistics] = useState(null);
	// const [categories, setCategories] = useState([]);
	const [exams, setExams] = useState([]);
	const [examType, setExamType] = useState('TICKET');
	const [isLoading, setIsLoading] = useState(false);
	const isLoadingRef = useRef(false);
	const hasMore = useRef(false);
	const [paginationState, setPaginationState] = useState({
		count: 0,
		page: 1,
		limit: 20,
	});

	const navigate = useNavigate();

	const loadMoreRef = useRef(null);
	const observFn = useCallback(() => {
		if (isLoadingRef.current || !hasMore.current) {
			return;
		}
		setPaginationState(state => ({...state, page: state.page + 1}));
	}, []);
	const observer = useRef(
		new IntersectionObserver((entries) => {
			const first = entries[0];
			if (first.isIntersecting) {
				observFn();
			}
		})
	);

	// useEffect(() => {
	// 	getCategories().then(({rows}) => {
	// 		setCategories(rows);
	// 	});
	// }, []);

	const entityLink = (item) => {
		switch(item.type) {
			case 'TICKET':
				return `/tickets/${item.entity.categoryId}/${item.entity.id}`;
			case 'TOPIC':
				return `/topics/${item.entity.id}`;
			default:
				return '';
		}
	}

	const renderTableBody = useMemo(
		() => (
			<TableBody>
				{exams.map((item, idx) => {
					const correct = item.answers?.filter(i => i.isRight) || [];
					const incorrect = item.answers?.filter(i => !i.isRight) || [];
					const isCompleted = item.answers?.length === item.questions?.length;
					return (
						<TableRow key={item.id} hover style={{ background: !(idx % 2) ? '#f4f4f4' : 'white'}}>
							<TableCell style={{padding: '8px 16px'}} component="th" scope="row">
								<Typography variant="overline" style={{margin: '20px 0'}}>
									<Link to={entityLink(item)} style={{display: 'flex', alignItems: 'center'}}>
										<ConfirmationNumberIcon style={{ margin: '0 10px 0 0'}}/>
										<b>{item.entity?.name}</b>
									</Link>
								</Typography>
							</TableCell>
							<TableCell style={{padding: '8px 16px'}} component="th" scope="row">
								<Typography variant="overline" style={{margin: '20px 0'}}>
									{item.updatedAt.split('T')[0]}
								</Typography>
							</TableCell>
							<TableCell style={{padding: '8px 16px'}} component="th" scope="row">
								<Typography variant="overline" style={{margin: '20px 0'}}>
									{item.answers?.length ? (<b>{`${correct.length} из ${item.answers.length}`}</b>) : '' }
								</Typography>
							</TableCell>
							<TableCell style={{padding: '8px 16px'}} component="th" scope="row">
								<Typography variant="overline" style={{margin: '20px 0'}}>
									{timeFormat(item.time)}
								</Typography>
							</TableCell>
							<TableCell style={{padding: '8px 16px'}} component="th" scope="row">
								<Typography variant="overline" style={{margin: '20px 0'}}>
									{!isCompleted ? (<b style={{ color: 'orange'}}>Не завершён</b>) : incorrect.length ? (
										<Tooltip
											title={
												<div style={{ width: '200px'}}>
													{incorrect.map((a, index) => {
														const question = item.questions.find(q => q.id === a.questionId);
														const answer = question.answers.find(an => an.id === a.answerId);
														return (<div style={{ margin: '0 0 10px 0'}} key={index}>
															<div style={{ margin: '0 0 0 0'}}>{`Вопрос: ${question.name}`}</div>
															<div>Ответ: {answer.text}</div>
														</div>)
													})}
												</div>
											}
											placement="left"
										>
											<b style={{ color: '#d32f2f', textDecoration: 'underline', cursor: 'pointer'}}>Не пройдён</b>
										</Tooltip>
										) : (<b style={{ color: 'green'}}>Пройдён</b>)
									}
								</Typography>
							</TableCell>
						</TableRow>
					)
				})}
			</TableBody>
		),
		[exams]
	);

	const requestUser = (id) => {
		getUser(id).then(res => setUser(res));
	}

	const requestStatistics = (id) => {
		getStatistics(id).then(res => setStatistics(res));
	}

	useEffect(() => {
		requestUser(userId);
		requestStatistics(userId);
	}, [userId]);

	useEffect(() => {
		setIsLoading(true);
		getExams({ userId, type: examType }, (paginationState.page - 1) * paginationState.limit, paginationState.limit)
			.then(({ rows, count }) => {
				setExams((exams) => {
          if (paginationState.page === 1) {
            return rows
          }
          return [...exams, ...rows]
        });
				setPaginationState(p => ({
					...p,
					count: Math.ceil(count / paginationState.limit),
				}));
				hasMore.current = paginationState.page < Math.ceil(count / paginationState.limit);
			})
			.finally(() => setIsLoading(false));
	},[userId, examType, paginationState.page, paginationState.limit]);

	useEffect(() => {
		const currentObserver = observer.current;
		const currentElement = loadMoreRef.current;
		currentElement && currentObserver.observe(currentElement);
		return () => {
			currentElement && currentObserver.unobserve(currentElement);
		}
	}, [loadMoreRef]);

	// const updateCategory = (categoryId) => {
	// 	updateUser(userId, { categoryId });
	// 	setUser(u => ({...u, categoryId}))
	// };

	const changeType = (newType) => {
		setExamType(newType);
		setPaginationState({
			count: 0,
			page: 1,
			limit: 20,
		});
	};

	useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

	return (
		<Page title={user?.name}>
			<RemoveConfirmDialog
				open={isOpenConfirm}
				closeHandler={() => setOpenConfirmState(p => !p)}
				keyword="истории"
				data="историю экзаменов пользователя"
				submitHandler={() => {
					deleteExams(userId, examType).then(() => {
						navigate(-1);
					});
				}}
			/>
			<RollBack onClick={() => navigate(-1)} title="На страницу пользователей"/>
			<CustomBox style={{margin: '5px 0 10px 0'}}>
				<Grid container spacing={2} alignItems="center">
					<Grid item xs={9}>
						<Typography
							variant="h4"
							gutterBottom
							style={{fontWeight: '700', display: 'flex', alignItems: 'center'}}
						>
							<PersonIcon style={{marginRight: '10px'}}/>
							{user?.name}
						</Typography>
						{statistics && (
							<div>
								Пройдёно билетов {statistics.ticketsCompleted} из {statistics.ticketsCount} (всего попыток {statistics.ticketsStarted})<br />
								Пройдёно тем {statistics.topicsCompleted} из {statistics.topicsCount} (всего попыток {statistics.topicsStarted})<br />
							</div>
						)}
						{/* <FormControl style={{marginTop: '10px'}}>
							<InputLabel id="select-category-label">Категория</InputLabel>
							<Select
								sx={{width: '200px'}}
								labelId="select-category-label"
								id="select-category"
								value={user.categoryId ?? ''}
								label="Категория"
								onChange={(e) => { e.target.value !== user.categoryId && updateCategory(e.target.value) }}
							>
								{categories?.map(c => (
									<MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
								))}
							</Select>
						</FormControl> */}
					</Grid>
					<Grid item xs={3}>
						{user.firebaseToken?.length > 0 && (<MessagesDialog userId={userId}/>)}
						{user.id > 0 && (<EditUserDialog user={user} onSave={() => requestUser(userId)}/>)}
						{exams.length > 0 && (
							<Button
								color="error"
								style={{height: '36px'}}
								variant="contained"
								fullWidth
								startIcon={<DeleteForeverIcon />}
								onClick={() => setOpenConfirmState(p => !p)}
							>
								Удалить историю
							</Button>
						)}
					</Grid>
				</Grid>
			</CustomBox>
			<TableContainer component={Paper} style={{margin: '0px 0 15px 0'}}>
				<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
					<Tabs value={examType} onChange={(_, value) => changeType(value)}>
						<Tab label="Билеты" value={'TICKET'} />
						<Tab label="Темы" value={'TOPIC'} />
						<Tab label="Экзамены" value={'EXAM'} />
					</Tabs>
				</Box>
				<Table sx={{minWidth: 500}} aria-label="custom pagination table">
					<TableHead style={{opacity: '0.5'}}>
						<TableRow>
							<TableCell style={{fontWeight: 'bold'}} component="th" scope="row">
								<Typography variant="overline" style={{margin: '20px 0'}}>
									{
										(() => {
											switch(examType) {
												case 'TICKET':
													return 'Билет';
												case 'TOPIC':
													return 'Тема';
												default:
													return 'Экзамен';
											}
										})()
									}
								</Typography>
							</TableCell>
							<TableCell style={{fontWeight: 'bold'}} component="th" scope="row">
								<Typography variant="overline" style={{margin: '20px 0'}}>Время завершение</Typography>
							</TableCell>
							<TableCell style={{fontWeight: 'bold'}} component="th" scope="row">
								<Typography variant="overline" style={{margin: '20px 0'}}>Результат</Typography>
							</TableCell>
							<TableCell style={{fontWeight: 'bold'}} component="th" scope="row">
								<Typography variant="overline" style={{margin: '20px 0'}}>Время выполнение</Typography>
							</TableCell>
							<TableCell style={{fontWeight: 'bold'}} component="th" scope="row">
								<Typography variant="overline" style={{margin: '20px 0'}}>Статус</Typography>
							</TableCell>
						</TableRow>
					</TableHead>
					{renderTableBody}
				</Table>
			</TableContainer>
			<div ref={loadMoreRef} style={{display: 'flex', justifyContent: 'center', padding: '20px'}}>{isLoading && <CircularProgress />}</div>
		</Page>
	)
}

export default UserPage;