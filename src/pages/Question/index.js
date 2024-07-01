import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import { useNavigate, useParams } from "react-router-dom";
import { createQuestion, getQuestion, updateQuestion, deleteQuestion } from "../../api/questions";
import { getCategories } from "../../api/categories";

import Page from "../../components/Page";
import RemoveConfirmDialog from "../../components/RemoveConfirmDialog"
import CustomBox from "../../components/CustomBox"
import Previews from "../../components/DropZone"
import RollBack from "../../components/RollBack"

import {
	Button,
	Typography,
	TextField,
	Grid,
	FormControlLabel,
	Checkbox,
	FormControl,
	InputLabel,
	Select,
	MenuItem
} from '@mui/material'

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const dataURLtoFile = (dataurl, filename) => {
	if (dataurl.length > 60) {
		var arr = dataurl.split(','),
			mime = arr[0].match(/:(.*?);/)[1],
			bstr = atob(arr[1]),
			n = bstr.length,
			u8arr = new Uint8Array(n);

		while(n--){
			u8arr[n] = bstr.charCodeAt(n);
		}

		const file = new File([u8arr], filename, {type:mime});

		return [file].map(file => Object.assign(file, {
			preview: URL.createObjectURL(file)
		}))
	} else {
		return []
	}
};

const initQuestion = {
	image: [],
	name: '',
	text: '',
	categoryId: '',
	answers: [
		{
			id: uuidv4(),
			text: '',
			isRight: false
		},
		{
			id: uuidv4(),
			text: '',
			isRight: false
		},
		{
			id: uuidv4(),
			text: '',
			isRight: false
		},
		{
			id: uuidv4(),
			text: '',
			isRight: false
		},
		{
			id: uuidv4(),
			text: '',
			isRight: false
		},
	]
}

const QuestionPage = () => {
	const { id } = useParams();
	const isNew = id === 'new';
	const [question, setQuestion] = useState(initQuestion);
	const [categories, setCategories] = useState([]);
	const [isOpenConfirm, setOpenConfirmState] = useState(false);

	const navigate = useNavigate();

	useEffect(() => {
		getCategories().then(({rows}) => {
			setCategories(rows);
			if (!question.categoryId && rows.length) {
				setQuestion(q => ({...q, categoryId: rows[0].id}))
			}
		});
	}, []);

	useEffect(() => {
		if (!isNew) {
			getQuestion(id).then(res => {
				setQuestion({
					image: res.image ? dataURLtoFile(res.image, 'picture').map(img => ({...img, base64: res.image, name: 'picture'})) : [],
					name: res.name,
					text: res.text,
					answers: res.answers,
					categoryId: res.categoryId,
				})
			})
		}
	}, [id, isNew]);

	const changeOptionHandler = (item) => {
		const newOptions = question.answers.map(it => {
			return it.id === item.id ? item : { ...it, isRight: item.isRight ? false : it.isRight };
		});

		setQuestion(p => ({...p, answers: newOptions}));
	}

	const submitHandler = () => {
		if (isNew) {
			createQuestion({
				name: question.name,
				text: question.text,
				image: question?.image[0]?.base64 || null,
				answers: question.answers,
				categoryId: question.categoryId,
			}).then(() => {
				navigate(-1);
			});
		} else {
			updateQuestion(
				id,
				{
					name: question.name,
					text: question.text,
					image: question?.image[0]?.base64 || 'test',
					answers: question.answers,
					categoryId: question.categoryId,
				}
			).then(() => {
				navigate(-1);
			});
		}
	};

	return (
		<Page title={isNew ? 'Новый Вопрос' : 'Вопрос'}>
			<RemoveConfirmDialog
				open={isOpenConfirm}
				closeHandler={() => setOpenConfirmState(p => false)}
				keyword="вопроса"
				data="данный вопрос"
				submitHandler={() => {
					deleteQuestion(id).then(() => {
						navigate(-1);
					});
				}}
			/>
			<RollBack onClick={() => navigate(-1)} title="На страницу вопросов"/>
			<CustomBox style={{margin: '5px 0 10px 0'}}>
				<Typography
					variant="h5"
					gutterBottom
					style={{fontWeight: '700', margin: '0 0 20px 0'}}
				>
					Вопрос
				</Typography>
				<Grid container spacing={2} alignItems="center">
					<Grid item xs={4}>
						<Previews
							files={question.image}
							attachHandler={(file) => setQuestion(p => ({...p, image: file}))}
						/>
					</Grid>
					<Grid item xs={8}>
						<textarea
							name="quest"
							placeholder="Введите текст вопроса"
							style={{height: '140px'}}
							value={question.name}
							onChange={(e) => {setQuestion(p => ({...p, name: e.target.value}))}}
						/>
						<FormControl fullWidth style={{marginTop: '10px'}}>
							<InputLabel id="select-category-label">Категория</InputLabel>
							<Select
								labelId="select-category-label"
								id="select-category"
								value={question.categoryId}
								label="Категория"
								onChange={(e) => { setQuestion(p => ({...p, categoryId: e.target.value})) }}
							>
								{categories?.map(c => (
									<MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>
				</Grid>
			</CustomBox>
			<CustomBox style={{margin: '0 0 10px 0'}}>
				<Typography
					variant="h5"
					gutterBottom
					style={{fontWeight: '700', margin: '0 0 20px 0'}}
				>
					Ответы
				</Typography>
				{question.answers.map((item, idx) => {
					return (
						<Grid key={item.id} container spacing={2} alignItems="center" style={{ marginBottom: '20px'}}>
							<Grid item xs={10}>
								<TextField
									fullWidth
									label={`Ответ ${idx + 1}`}
									placeholder="Введите вариант ответа"
									variant="outlined"
									value={item.text}
									onChange={(e) => changeOptionHandler({ ...item, text: e.target.value })}
								/>
							</Grid>
							<Grid item xs={2}>
								<FormControlLabel
									control={<Checkbox disabled={!item.text} checked={item.isRight} onChange={() => changeOptionHandler({ ...item, isRight: true })} />}
									label="Верный ответ"
								/>
							</Grid>
						</Grid>
					)
				})}
			</CustomBox>
			<CustomBox style={{margin: '0 0 10px 0'}}>
				<Typography
					variant="h5"
					gutterBottom
					style={{fontWeight: '700', margin: '0 0 20px 0'}}
				>
					Подсказка
				</Typography>
				<Grid item xs={12}>
						<textarea
							name="text"
							id="text"
							cols="30"
							rows="10"
							placeholder="Введите текст подсказки"
							value={question.text}
							onChange={(e) => {setQuestion(p => ({...p, text: e.target.value}))}}
						/>
				</Grid>
			</CustomBox>
			<CustomBox style={{margin: '0 0 40px 0'}}>
				<Grid container spacing={2}>
					<Grid item xs={isNew ? 12 : 6}>
						<Button
							style={{height: '36px', display: 'flex'}}
							variant="contained"
							fullWidth
							onClick={() => {submitHandler()}}
							disabled={!question.name || !question.answers.some(i => i.isRight)}
						>
							<CheckCircleIcon style={{margin: '0 10px 0 0'}}/>
							Сохранить вопрос
						</Button>
					</Grid>
					{!isNew && (
						<Grid item xs={6}>
							<Button
								color="error"
								style={{height: '36px', display: 'flex'}}
								variant="contained"
								fullWidth
								onClick={() => setOpenConfirmState(true)}
							>
								<DeleteForeverIcon style={{margin: '0 10px 0 0'}}/>
								Удалить вопрос
							</Button>
						</Grid>
					)}
				</Grid>
			</CustomBox>
		</Page>
	)
}

export default QuestionPage;
