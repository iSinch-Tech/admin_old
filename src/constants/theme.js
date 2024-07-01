import { createTheme } from "@mui/material/styles";

const theme = createTheme({
	palette: {
		type: 'light',
		primary: {
			main: '#676767',
			light: '#dedede',
		},
		secondary: {
			main: '#f50057',
		},
		background: {
			default: '#b5b5b5',
			paper: '#ffffff',
		},
	}
});

export default theme;