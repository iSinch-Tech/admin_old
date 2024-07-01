import React from 'react';
import { Box } from "@mui/material";

const CustomBox = ({children, style}) => {
	return (
		<Box style={{...style, background: 'white', padding: '20px', borderRadius: '4px', boxShadow: 'box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)'}}>
			{children}
		</Box>
	)
};

export default CustomBox;
