import * as React from "react";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from '@mui/material/styles';

import router from './constants/router';
import theme from './constants/theme';
import { isAuthorized, getToken } from './api/auth';

const App = () => {
	if (isAuthorized()) {
		window?.navigator?.serviceWorker?.ready?.then(() => {
			window?.navigator?.serviceWorker?.controller?.postMessage({
				type: 'UPDATE_TOKEN',
				payload: getToken(),
			});
		});
	}
	return (
		<ThemeProvider theme={theme}>
			<RouterProvider router={router} />
		</ThemeProvider>
	);
}

export default App;
