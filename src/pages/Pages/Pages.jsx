import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Page from "../../components/Page";
import RemoveConfirmDialog from "../../components/RemoveConfirmDialog"
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
	Stack,
} from '@mui/material'
import Pagination from '@mui/material/Pagination';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutline from '@mui/icons-material/AddCircleOutline';
import WebOutlined from '@mui/icons-material/WebOutlined';
import { searchPages, getPages, deletePage } from "../../api/pages";

const PagesPage = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [pages, setPages] = useState([]);
	const [searchValue, setSearchValue] = useState('');
	const [isOpenConfirm, setOpenConfirmState] = useState(false);
	const [selectedPage, setSelectedPage] = useState(null);
	const [paginationState, setPaginationState] = useState({
		count: 0,
		page: +(searchParams.get('page') ?? 1),
		limit: 20,
	});
	const [forceReload, setForceReload] = useState(0);

	const searchHandler = () => {
		searchPages({ title: `%${searchValue}%` }).then(({ rows, count }) => {
			setPages(rows);
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
		getPages(
			(paginationState.page - 1) * paginationState.limit,
			paginationState.limit
		).then(({ rows, count }) => {
			setPages(rows);
			setPaginationState(p => ({
				...p,
				count: Math.ceil(count / paginationState.limit),
			}));
			setSearchParams({
				page: paginationState.page
			});
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [paginationState.page, paginationState.limit, forceReload])

	return (
		<Page title="Страницы">
			<RemoveConfirmDialog
				open={isOpenConfirm}
				closeHandler={() => setOpenConfirmState(false)}
				keyword="страницы"
				data={<>страницы <b>{selectedPage?.name}</b></>}
				submitHandler={() => {
					deletePage(selectedPage.id).then(() => {
						setOpenConfirmState(false);
						reloadPage(paginationState.page);
					});
				}}
			/>
			<Paper sx={{ margin: '40px 0 10px 0', p: 2.5 }}>
				<Stack direction="row" justifyContent="space-between" alignItems="center" gap={2}>
					<Typography variant="h4" gutterBottom>
						<b>Страницы</b>
					</Typography>
					<Button
						startIcon={<AddCircleOutline />}
						to="/pages/new"
						component={Link}
						variant="contained"
						size="medium"
					>
						Добавить страницу
					</Button>
				</Stack>
				<Grid container spacing={2} alignItems="center" sx={{ mt: 1 }}>
					<Grid item xs={10}>
						<TextField
							fullWidth
							label="Страница"
							placeholder="Введите название страницы"
							variant="outlined"
							value={searchValue}
							onChange={(e) => setSearchValue(e.target.value)}
						/>
					</Grid>
					<Grid item xs={2}>
						<Button
							startIcon={<SearchIcon />}
							sx={{ height: '56px' }}
							variant="contained"
							fullWidth
							onClick={searchHandler}
						>
							Найти
						</Button>
					</Grid>
				</Grid>
			</Paper>
			<TableContainer component={Paper} style={{ margin: '0 0 15px 0' }}>
				<Table sx={{ minWidth: 500 }}>
					<TableHead sx={{ opacity: '0.5' }}>
						<TableRow>
							<TableCell colSpan={2} component="th" scope="row">
								<Typography variant="overline">
									Название страницы
								</Typography>
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{pages.map((page, idx) => (
							<TableRow key={idx} hover style={{ background: !(idx % 2) ? '#f4f4f4' : 'white' }}>
								<TableCell style={{ padding: '8px 16px' }} component="th" scope="row">
									<Link to={`/pages/${page.id}`} style={{ display: 'flex', alignItems: 'center' }}>
										<WebOutlined sx={{ mr: 1.25 }} />
										<Typography variant="overline" sx={{ lineHeight: 'initial' }}>{page.title}</Typography>
									</Link>
								</TableCell>
								<TableCell style={{ width: 260, padding: '0 16px' }} align="right">
									<IconButton
										onClick={() => {
											setSelectedPage({ id: page.id, name: page.title });
											setOpenConfirmState(true);
										}}
									>
										<DeleteForeverIcon color="error" />
									</IconButton>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			<div style={{ display: 'flex', justifyContent: 'center' }}>
				{pages.length ? (
					<Pagination
						style={{ margin: '0 auto 40px' }}
						count={paginationState.count}
						defaultPage={1}
						page={paginationState.page}
						siblingCount={0}
						onChange={(e, pn) => { setPaginationState(p => ({ ...p, page: pn })) }}
					/>
				) : (
					<Typography variant="overline" style={{ margin: '20px 0' }}>Ничего не найдено</Typography>
				)}
			</div>
		</Page>
	)
}

export default PagesPage;
