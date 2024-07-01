import api, { buildFilter } from './apiHelper';

export const getPages = (offset = 0, limit = 100) => {
	const params = {
		offset,
		limit,
		orderType: 'desc',
	};
	return api.get('/pages', { params });
};

export const searchPages = (filter, offset = 0, limit = 10) => {
	const params = {
		...buildFilter(filter),
		offset,
		limit,
		orderType: 'desc'
	};
	return api.get('/pages', { params });
};

export const getPage = (id) => api.get(`/pages/${id}`);

export const createPage = (data) => api.post('/pages', {
	title: data.title,
	value: data.value,
});

export const updatePage = (id, data) => api.patch(`/pages/${id}`, {
	title: data.title,
	value: data.value,
});


export const deletePage = (id) => api.delete(`/pages/${id}`);
