import api, { buildFilter } from './apiHelper';

export const getByMonth = (month) => {
	const params = {
		...buildFilter({
			date: `${month}%`,
		}),
	}
	return api.get('/schedule', { params });
};

export const createCell = (data) => api.post('/schedule', {
	date: data.date,
	count: data.count,
});

export const updateCell = (id, data) => api.patch(`/schedule/${id}`, {
	userId: data.userId,
	status: data.status,
});


export const deleteCell = (id) => api.delete(`/schedule/${id}`);
