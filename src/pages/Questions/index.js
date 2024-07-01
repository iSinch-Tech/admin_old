import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getQuestions, searchQuestion, deleteQuestion } from "../../api/questions";
import Page from "../../components/Page";
import RemoveConfirmDialog from "../../components/RemoveConfirmDialog"
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
} from '@mui/material'
import Pagination from '@mui/material/Pagination';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import SearchIcon from '@mui/icons-material/Search';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';

const QuestionsPage = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [questions, setQuestions] = useState([]);
	const [searchValue, setSearchValue] = useState('');
	const [isOpenConfirm, setOpenConfirmState] = useState(false);
	const [selectedQusetion, setSelectedQusetion] = useState(null);
	const [paginationState, setPaginationState] = useState({
		count: 0,
		page: +(searchParams.get('page') ?? 1),
		limit: 20,
	});
	const [forceReload, setForceReload] = useState(0);

	const searchHandler = () => {
		searchQuestion({name: `%${searchValue}%`}).then(({ rows, count }) => {
			setQuestions(rows);
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
		getQuestions(
			(paginationState.page - 1) * paginationState.limit,
			paginationState.limit
		).then(({ rows, count }) => {
			setQuestions(rows);
			setPaginationState(p => ({
				...p,
				count: Math.ceil(count / paginationState.limit),
			}));
			setSearchParams({
				page: paginationState.page
			});
		});
	},[paginationState.page, paginationState.limit, forceReload])

	return (
		<Page title="Вопросы">
			<RemoveConfirmDialog
				open={isOpenConfirm}
				closeHandler={() => setOpenConfirmState(false)}
				keyword="вопроса"
				data={<>вопрос <b>{selectedQusetion?.name}</b></>}
				submitHandler={() => {
					deleteQuestion(selectedQusetion.id).then(() => {
						setOpenConfirmState(false);
						reloadPage(paginationState.page);
					});
				}}
			/>
			<CustomBox style={{margin: '40px 0 10px 0'}}>
				<Grid container spacing={2} alignItems="center">
					<Grid item xs={9}>
						<Typography
							variant="h4"
							gutterBottom
							style={{ fontWeight: '700'}}
						>
							Вопросы
						</Typography>
					</Grid>
					<Grid item xs={3}>
						<Link to="/questions/new">
							<Button
								style={{height: '36px', display: 'flex'}}
								variant="contained"
								fullWidth
							>
								<QuestionAnswerIcon style={{margin: '0 10px 0 0'}}/>
								Создать новый вопрос
							</Button>
						</Link>
					</Grid>
				</Grid>
				<Grid container spacing={2} alignItems="center">
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
			</CustomBox>
			<TableContainer component={Paper} style={{margin: '0 0 15px 0'}}>
				<Table sx={{minWidth: 500}} aria-label="custom pagination table">
					<TableHead style={{opacity: '0.5'}}>
						<TableRow>
							<TableCell style={{fontWeight: 'bold'}} component="th" scope="row">
								<Typography variant="overline" style={{margin: '20px 0'}}>Название вопроса</Typography>
							</TableCell>
							<TableCell style={{width: 60, fontWeight: 'bold'}} align="right">
								<Typography variant="overline" style={{margin: '20px 0'}}></Typography>
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{questions.map((question, idx) => (
							<TableRow key={idx} hover style={{ background: !(idx % 2) ? '#f4f4f4' : 'white'}}>
								<TableCell style={{padding: '8px 16px'}} component="th" scope="row">
									<Typography variant="overline" style={{margin: '20px 0'}}>
										<Link to={`/questions/${question.id}`} style={{ display: 'flex', alignItems: 'center'}}>
											<QuestionAnswerIcon style={{ margin: '0 10px 0 0'}}/>
											<Typography variant="overline" style={{lineHeight: 'initial'}}>{question.name}</Typography>
										</Link>
									</Typography>
								</TableCell>
								<TableCell style={{width: 260, padding: '0 16px'}} align="right">
									<IconButton
										onClick={() => {
											setSelectedQusetion({id: question.id, name: question.name});
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
				{questions.length ? (
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

export default QuestionsPage;
