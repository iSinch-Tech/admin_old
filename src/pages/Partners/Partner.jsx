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
import { createPartner, deletePartner, getPartner, updatePartner } from "../../api/partners";
import { deleteFile } from "../../api/files";
import { useFileDropzone } from "../../components/FileDropzone";

const PartnerPage = () => {
	const { partnerId: id } = useParams();
	const isNew = id === 'new';
	const title = isNew ? 'Добавить Партнера' : 'Редактировать Партнера';

	const [partner, setPartner] = useState({
		title: '',
		url: '',
		createdAt: null,
		updatedAt: null,
		imageId: null,
		deletedImages: [],
	});

	const [isOpenConfirm, setOpenConfirmState] = useState(false);

	const navigate = useNavigate();
	const navigateBack = () => navigate(-1);

	useEffect(() => {
		if (isNew) return;

		getPartner(id).then(res => {
			setPartner({
				title: res.title,
				url: res.url,
				createdAt: res.createdAt,
				updatedAt: res.updatedAt,
				imageId: res.imageId,
				deletedImages: [],
			})
		});
	}, [id, isNew]);

	const submitHandler = () => {
		const { title, url, imageId, deletedImages } = partner;
		const postData = { title, url, imageId };

		try {
			deletedImages.map(deleteFile);
		} catch { }

		if (isNew) {
			createPartner(postData).then(navigateBack);
		} else {
			updatePartner(id, postData).then(navigateBack);
		}
	};

	const onChange = (e) => {
		if (!e?.target) return;

		const { value, name } = e.target;
		setPartner(prev => ({ ...prev, [name]: value }));
	};

	const onImageLoad = useCallback((imageId) => {
		setPartner(prev => ({ ...prev, imageId }));
	}, []);

	const onImageDelete = useCallback((id) => {
		setPartner(prev => ({
			...prev,
			imageId: null,
			deletedImages: [...prev.deletedImages, id],
		}));
	}, []);

	const { FileDropzone, isLoading } = useFileDropzone({
		images: partner.imageId ? [partner.imageId] : [],
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
				keyword="партнера"
				data="данного партнера"
				submitHandler={() => {
					deletePartner(id).then(navigateBack);
				}}
			/>
			<RollBack onClick={() => navigate(-1)} title="На страницу партнеров" />
			<Stack gap={1.25} mt="5px" mb="40px">
				<CustomBox>
					<Typography variant="h5" mb={2.5}>
						<b>{title}</b>
					</Typography>
					<Grid container spacing={3} alignItems="stretch">
						<Grid item xs={4} display="flex">
							<Stack sx={{ width: '100%', height: '100%', pt: 1, pb: 0.5 }}>
								<Box sx={{ flex: 1, maxHeight: '270px' }}>
									{FileDropzone}
								</Box>
							</Stack>
						</Grid>
						<Divider orientation="vertical" flexItem sx={{ mr: '-1px', transform: 'translate(12px, 12px)' }} />
						<Grid item xs={8}>
							<TextField
								name="title"
								value={partner.title}
								onChange={onChange}
								label="Заголовок"
								variant="outlined"
								fullWidth
								margin="dense"
								inputProps={{ maxLength: 100 }}
							/>
							<TextField
								name="url"
								value={partner.url}
								onChange={onChange}
								label="Ссылка на партнера"
								variant="outlined"
								fullWidth
								margin="dense"
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
								disabled={!partner.title || !partner.url || isLoading}
							>
								Сохранить партнера
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
									Удалить партнера
								</Button>
							</Grid>
						)}
					</Grid>
				</CustomBox>
			</Stack>
		</Page>
	)
}

export default PartnerPage;
