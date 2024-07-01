import api, { buildFilter } from './apiHelper';

export const getNews = (offset = 0, limit = 100) => {
	const params = {
		offset,
		limit,
		orderBy: 'createdAt',
		orderType: 'desc',
	};
	return api.get('/news', { params });
};

export const searchNews = (filter, offset = 0, limit = 10) => {
	const params = {
		...buildFilter(filter),
		offset,
		limit,
		orderType: 'desc'
	};
	return api.get('/news', { params });
};

export const getNewsPost = (id) => api.get(`/news/${id}`);

export const createNewsPost = (data) => api.post('/news', {
	title: data.title,
	description: data.description,
	images: data.images,
});

export const updateNewsPost = (id, data) => api.patch(`/news/${id}`, {
	title: data.title,
	description: data.description,
	images: data.images,
});


export const deleteNewsPost = (id) => api.delete(`/news/${id}`);
