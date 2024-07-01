import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
	Button,
	Typography,
	Grid,
	CircularProgress,
} from '@mui/material'
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { getCategories } from "../../api/categories";
import Page from "../../components/Page";
import CustomBox from "../../components/CustomBox"

const CategoriesPage = () => {
	const [categories, setCategories] = useState([]);
	useEffect(() => {
		getCategories().then(({ rows }) => {setCategories(rows)});
	}, [])

	return (
		<Page title="Категории">
			<CustomBox style={{margin: '40px 0 10px 0'}}>
				<Grid container spacing={2} alignItems="center">
					<Grid item xs={9}>
						<Typography
							variant="h4"
							gutterBottom
							style={{fontWeight: '700'}}
						>
							Категории
						</Typography>
					</Grid>
				</Grid>
			</CustomBox>
			{
				categories.length
					? (
						<Grid container spacing={3} alignItems="center">
							{categories.map((item, index) => {
								return (
									<Grid item xs={6} key={index}>
										<CustomBox>
											<Typography
												variant="h5"
												gutterBottom
												style={{margin: '0 0 16px 0', fontWeight: '700', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
											>
												{item.name === 'AB' ? <TwoWheelerIcon style={{margin: '0 10px 0 0'}}/> : <LocalShippingIcon style={{margin: '0 10px 0 0'}}/>}
												{item.name.toUpperCase()}
												{item.name === 'AB' ? <DirectionsCarIcon style={{margin: '0 0 0 10px'}}/> : <AirportShuttleIcon style={{margin: '0 0 0 10px'}}/>}
											</Typography>

											<Link to={`/tickets/${item.id}`}>
												<Button variant="contained" fullWidth>Билеты</Button>
											</Link>
										</CustomBox>
									</Grid>
								)
							})}
						</Grid>
					)
					: (
						<CircularProgress style={{ position: 'absolute', top: '50%', left: '50%'}}/>
					)
			}
		</Page>
	)
}

export default CategoriesPage;