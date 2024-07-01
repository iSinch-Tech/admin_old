import React from "react";
import {Link} from "react-router-dom";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import {Typography} from "@mui/material";

const RollBack = ({to, title, onClick}) => {
	return (
		<Link to={to} onClick={onClick} style={{display: 'flex', margin: '10px 0 0 0'}}>
			<Typography
				variant="caption"
				gutterBottom
				style={{fontWeight: '700', display: 'flex', alignItems: 'center'}}
			>
				<ChevronLeftIcon style={{margin: '0 0 0 0'}}/>
				{title}
			</Typography>
		</Link>
	)
}

export default RollBack;