import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Page from "../../components/Page";
import RemoveConfirmDialog from "../../components/RemoveConfirmDialog"
import CustomBox from "../../components/CustomBox"
import RollBack from "../../components/RollBack"

import {
	Button,
	Typography,
	TextField,
	Grid,
	Stack,
	Box,
	Divider,
} from '@mui/material'

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { createNewsPost, deleteNewsPost, getNewsPost, updateNewsPost } from "../../api/news";
import { deleteFile } from "../../api/files";
import { useFileDropzone } from "../../components/FileDropzone";
import { getDate } from "../../utils";

const NewsPostPage = () => {
	const { newsId: id } = useParams();
	const isNew = id === 'new';
	const title = isNew ? 'Добавить Новость' : 'Редактировать Новость';

	const [newsPost, setNewsPost] = useState({
		title: '',
		description: '',
		createdAt: null,
		updatedAt: null,
		images: [],
		deletedImages: [],
	});
	const createdAt = getDate(newsPost.createdAt);
	const updatedAt = getDate(newsPost.updatedAt);

	const [isOpenConfirm, setOpenConfirmState] = useState(false);

	const navigate = useNavigate();
	const navigateBack = () => navigate(-1);

	useEffect(() => {
		if (isNew) return;

		getNewsPost(id).then(res => {
			setNewsPost({
				title: res.title,
				description: res.description,
				createdAt: res.createdAt,
				updatedAt: res.updatedAt,
				images: res.images,
				deletedImages: [],
			})
		});
	}, [id, isNew]);

	const submitHandler = () => {
		const { title, description, images, deletedImages } = newsPost;
		const postData = { title, description, images };

		try {
			deletedImages.map(deleteFile);
		} catch { }

		if (isNew) {
			createNewsPost(postData).then(navigateBack);
		} else {
			updateNewsPost(id, postData).then(navigateBack);
		}
	};

	const onChange = (e) => {
		if (!e?.target) return;

		const { value, name } = e.target;
		setNewsPost(prev => ({ ...prev, [name]: value }));
	};

	const onImageLoad = useCallback((id) => {
		setNewsPost(prev => ({ ...prev, images: [...prev.images, id] }));
	}, []);

	const onImageDelete = useCallback((id) => {
		setNewsPost(prev => ({
			...prev,
			images: prev.images.filter(item => String(item) !== String(id)),
			deletedImages: [...prev.deletedImages, id],
		}));
	}, []);

	const { FileDropzone, isLoading } = useFileDropzone({
		images: newsPost.images,
		onLoad: onImageLoad,
		onDelete: onImageDelete,
		dropzoneConfig: {
			accept: { 'image/*': [] },
		}
	});

	return (
		<Page title={title}>
			<RemoveConfirmDialog
				open={isOpenConfirm}
				closeHandler={() => setOpenConfirmState(p => false)}
				keyword="новости"
				data="данную новость"
				submitHandler={() => {
					deleteNewsPost(id).then(navigateBack);
				}}
			/>
			<RollBack onClick={() => navigate(-1)} title="На страницу новостей" />
			<Stack gap={1.25} mt="5px" mb="40px">
				<CustomBox>
					<Typography variant="h5" mb={2.5}>
						<b>{title}</b>
					</Typography>
					<Grid container spacing={3} alignItems="stretch">
						<Grid item xs={4} display="flex">
							<Stack gap={2} sx={{ width: '100%', height: '100%', pt: 1, pb: 0.5 }}>
								<Box sx={{ flex: 1, maxHeight: '270px' }}>
									{FileDropzone}
								</Box>
								{(createdAt || updatedAt) && (
									<Box>
										{createdAt && (
											<Typography>
												<b>Дата создания:</b> {createdAt}
											</Typography>
										)}
										{updatedAt && (
											<Typography >
												<b>Дата обновления:</b> {updatedAt}
											</Typography>
										)}
									</Box>
								)}
							</Stack>
						</Grid>
						<Divider orientation="vertical" flexItem sx={{ mr: '-1px', transform: 'translate(12px, 12px)' }} />
						<Grid item xs={8}>
							<TextField
								name="title"
								value={newsPost.title}
								onChange={onChange}
								label="Заголовок"
								variant="outlined"
								fullWidth
								margin="dense"
								inputProps={{ maxLength: 100 }}
							/>
							<TextField
								name="description"
								value={newsPost.description}
								onChange={onChange}
								label="Текст новости"
								placeholder="Введите текст новости"
								multiline
								rows={10}
								variant="outlined"
								fullWidth
								margin="dense"
								inputProps={{ maxLength: 2000 }}
							/>
						</Grid>
					</Grid>
				</CustomBox>
				<CustomBox>
					<Grid container spacing={2}>
						<Grid item xs={isNew ? 12 : 6}>
							<Button
								startIcon={<CheckCircleIcon />}
								variant="contained"
								fullWidth
								onClick={submitHandler}
								disabled={!newsPost.title || !newsPost.description || isLoading}
							>
								Сохранить новость
							</Button>
						</Grid>
						{!isNew && (
							<Grid item xs={6}>
								<Button
									startIcon={<DeleteForeverIcon />}
									variant="contained"
									fullWidth
									color="error"
									onClick={() => setOpenConfirmState(true)}
								>
									Удалить новость
								</Button>
							</Grid>
						)}
					</Grid>
				</CustomBox>
			</Stack>
		</Page>
	)
}

export default NewsPostPage;
