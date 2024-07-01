import axios from 'axios';
import { logOut, getToken } from './auth';

export const baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000/api' : '/api';

const api = axios.create({
  baseURL
});

api.interceptors.response.use(
	res => res.data,
	error => {
		switch (error?.response?.status) {
			case 401:
				logOut();
				break;
			default:
				throw error;
		}
	},
);

api.interceptors.request.use(config => {
	const access_token = getToken();
	if (access_token) {
		config.headers['Authorization'] = `Bearer ${access_token}`;
	}
	return config;
});

export const buildFilter = (filter) => {
	return Object.fromEntries(
		Object.entries(filter)
			.filter(([_, value]) => value !== undefined)
			.map(([field, value]) => [`filter[${field}]`, value]
		)
	);
}

export default api