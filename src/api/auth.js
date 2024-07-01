import api from './apiHelper';

export const logIn = (user) => {
	return api.post('/auth/login', {
		login: user.login,
		password: user.pass
	})
	.then(res => {
		if (res?.role !== 'ADMIN') {
			throw(new Error('Admin only'));
		}
		window.localStorage.setItem('access_token', res?.access_token);
		window?.navigator?.serviceWorker?.ready?.then(() => {
			window?.navigator?.serviceWorker?.controller?.postMessage({
				type: 'UPDATE_TOKEN',
				payload: getToken(),
			});
		});
	});
};

export const logOut = () => {
	window.localStorage.removeItem('access_token');
	window.location.reload();
};

export const getToken = () => {
	return window.localStorage.getItem('access_token');
}

export const isAuthorized = () => {
	return !!getToken();
}

