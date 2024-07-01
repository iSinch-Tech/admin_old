import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Page from "../../components/Page";
import RemoveConfirmDialog from "../../components/RemoveConfirmDialog"
import CustomBox from "../../components/CustomBox"
import RollBack from "../../components/RollBack"
import { RichTextEditor } from "../../components/RichTextEditor";

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
import { createPage, deletePage, getPage, updatePage } from "../../api/pages";
import { getDate } from "../../utils";

const PagePage = () => {
	const { pageId: id } = useParams();
	const isNew = id === 'new';
	const title = isNew ? 'Добавить Страницу' : 'Редактировать Страницу';

	const valueRef = useRef('');
	const [isValueDirty, setIsDirty] = useState(false);

	const [page, setPage] = useState({
		title: '',
		value: '',
		createdAt: null,
		updatedAt: null,
		imageId: null,
		deletedImages: [],
	});
	const createdAt = getDate(page.createdAt);
	const updatedAt = getDate(page.updatedAt);

	const [isOpenConfirm, setOpenConfirmState] = useState(false);

	const navigate = useNavigate();
	const navigateBack = () => navigate(-1);

	useEffect(() => {
		if (isNew) return;

		getPage(id).then(res => {
			valueRef.current = res.value;
			setPage({
				title: res.title,
				value: res.value,
				createdAt: res.createdAt,
				updatedAt: res.updatedAt,
			});
		});
	}, [id, isNew]);

	const submitHandler = () => {
		if (!valueRef.current) return;

		const title = page.title;
		const value = valueRef.current;
		const postData = { title, value };

		if (isNew) {
			createPage(postData).then(navigateBack);
		} else {
			updatePage(id, postData).then(navigateBack);
		}
	};

	const onChange = (e) => {
		if (!e?.target) return;

		const { value, name } = e.target;
		setPage(prev => ({ ...prev, [name]: value }));
	};

	return (
		<Page title={title}>
			<RemoveConfirmDialog
				open={isOpenConfirm}
				closeHandler={() => setOpenConfirmState(p => false)}
				keyword="страницы"
				data="данную страницу"
				submitHandler={() => {
					deletePage(id).then(navigateBack);
				}}
			/>
			<RollBack onClick={() => navigate(-1)} title="К списку страниц" />
			<Stack gap={1.25} mt="5px" mb="40px">
				<CustomBox>
					<Typography variant="h5" mb={2.5}>
						<b>{title}</b>
					</Typography>
					<Grid container spacing={3} alignItems="stretch">
						<Grid item xs={4} display="flex">
							<Stack sx={{ width: '100%', height: '100%', pt: 1, pb: 0.5 }}>
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
								value={page.title}
								onChange={onChange}
								label="Заголовок"
								variant="outlined"
								fullWidth
								margin="dense"
								inputProps={{ maxLength: 100 }}
							/>
							<RichTextEditor
								valueRef={valueRef}
								setIsDirty={setIsDirty}
								initialValue={page.value}
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
								disabled={!page.title || (isNew && !isValueDirty)}
							>
								Сохранить страницу
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
									Удалить страницу
								</Button>
							</Grid>
						)}
					</Grid>
				</CustomBox>
			</Stack>
		</Page>
	)
}

export default PagePage;
