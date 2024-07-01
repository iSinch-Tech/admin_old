import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {getTopic, createTopic, updateTopic, deleteTopic} from '../../api/topics';

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
	IconButton,
} from '@mui/material'

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const TopicPage = () => {
	const { topicId } = useParams();
	const isNew = topicId === 'new';
	const [loading, setLoading] = useState(true);
	const [isOpenConfirm, setOpenConfirmState] = useState(false);
	const [isOpenAddDialog, setOpenAddDialog] = useState(false);
	const [topic, setTopic] = useState({
		name: '',
		questions: []
	});

	const navigate = useNavigate();

	const saveHandler = () => {
		if (isNew) {
			createTopic({
				name: topic.name,
				questions: topic.questions.map(i => i.id)
			}).then(() => {
				navigate('/topics');
			});
		} else {
			updateTopic(
				topic.id,
				{
					name: topic.name,
					questions: topic.questions.map(i => i.id)
				}
			).then(() => {
				navigate('/topics');
			});
		}
	};

	useEffect(() => {
		async function fetchData() {
			setLoading(true);
			if (!isNew) {
				await getTopic(topicId).then(res => {
					setTopic(res);
				});
			}
			setLoading(false);
		}

		fetchData();
	},[topicId, isNew]);

	return (
		<Page title={isNew
			? `Создание новой темы`
			: `${topic?.name}`
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
						keyword="темы"
						data={`${topic?.name}`}
						submitHandler={() => {
							deleteTopic(topic.id).then(() => {
								navigate('/topics');
							});
						}}
					/>
					<AddQuestionDialog
						open={isOpenAddDialog}
						closeHandler={ () => setOpenAddDialog(false) }
						changeQuestion={(id, name) => {
							setTopic(p => {
								p.questions.push({ id, name });
								return { ...p };
							});
							setOpenAddDialog(false);
						}}
					/>
					<RollBack onClick={() => navigate(-1)} title="На страницу тем"/>
					<CustomBox style={{margin: '5px 0 10px 0'}}>
						<Grid container spacing={2} alignItems="center">
							<Grid item xs={isNew ? 8 : 6}>
								<Typography
									variant="h4"
									gutterBottom
									style={{fontWeight: '700'}}
								>
									{isNew
										? `Создание новой темы`
										: `${topic?.name}`
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
									Сохранить тему
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
										Удалить тему
									</Button>
								</Grid>
							)}
						</Grid>
					</CustomBox>
					<CustomBox style={{margin: '0 0 40px 0'}}>
						<TextField
							style={{margin: '24px 0 0 0'}}
							fullWidth
							label="Название темы"
							placeholder="Введите название темы"
							variant="outlined"
							key={topic.id}
							value={topic.name}
							onChange={(e) => setTopic(p => ({...p, name: e.target.value}))}
						/>
						<Typography
							variant="h5"
							gutterBottom
							style={{fontWeight: '700',margin: '20px 0 0 0'}}
						>
							Блок вопросов
							<Button
								style={{
									height: '36px',
									display: 'inline-flex',
									marginLeft: "20px",
								}}
								variant="contained"
								onClick={() => {
									setOpenAddDialog(true);
								}}
							>
								Добавить вопрос
							</Button>
						</Typography>
						{topic?.questions.map((item, i) => (
								<div
									key={i}
									style={{
										display: 'flex',
										flexDirection: 'column',
										border: '1px solid #cbcbcb',
										borderRadius: '4px',
										margin: '10px 0 0 0',
										boxSizing: 'border-box',
										padding: '8px',
									}}
								>
									<Typography variant="caption" style={{color: '#676767'}}><b>{`Вопрос №${i + 1} `}</b></Typography>
									<div style={{display: 'flex'}}>
										<Typography variant="body1" style={{margin: '8px 0'}}>{item.name}</Typography>
										<IconButton
											onClick={() => {
												topic.questions.splice(i, 1);
												setTopic({ ...topic });
											}}
											aria-label="first page"
											style={{marginLeft: 'auto'}}
										>
											<DeleteForeverIcon color="error"/>
										</IconButton>
									</div>
								</div>
							)
						)}
						<Button
							style={{height: '56px', display: 'flex', margin: '20px 0 0 0'}}
							variant="contained"
							fullWidth
							onClick={() => {saveHandler()}}
						>
							<CheckCircleIcon style={{margin: '0 10px 0 0'}}/>
							Сохранить тему
						</Button>
					</CustomBox>
				</>
			)}
		</Page>
	)
}

export default TopicPage;
