import api, { buildFilter } from './apiHelper';

export const getPartners = (offset = 0, limit = 100) => {
	const params = {
		offset,
		limit,
		orderType: 'desc',
	};
	return api.get('/partners', { params });
};

export const searchPartners = (filter, offset = 0, limit = 10) => {
	const params = {
		...buildFilter(filter),
		offset,
		limit,
		orderType: 'desc'
	};
	return api.get('/partners', { params });
};

export const getPartner = (id) => api.get(`/partners/${id}`);

export const createPartner = (data) => api.post('/partners', {
	title: data.title,
	url: data.url,
	imageId: data.imageId,
});

export const updatePartner = (id, data) => api.patch(`/partners/${id}`, {
	title: data.title,
	url: data.url,
	imageId: data.imageId,
});


export const deletePartner = (id) => api.delete(`/partners/${id}`);
