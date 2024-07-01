import api, { buildFilter } from './apiHelper';

export const searchUsers = (filter = {}, offset = 0, limit = 10) => {
	const params = {
		...buildFilter(filter),
		offset,
		limit,
		orderType: 'desc',
	};

	return api.get('/users', { params });
}

export const getUsers = (offset = 0, limit = 10) => searchUsers({}, offset, limit);

export const getUser = (id) => api.get(`/users/${id}`);

export const getStatistics = (id) => api.get(`/statistics/user/${id}`);

export const createUser = (user) => api.post('/users', {
	login: user.login,
	name: user.name,
	password: user.password,
	role: user.role,
	categoryId: user.categoryId,
});

export const updateUser = (id, user) => api.patch(`/users/${id}`, user);

export const deleteUser = (id) => api.delete(`/users/${id}`);
