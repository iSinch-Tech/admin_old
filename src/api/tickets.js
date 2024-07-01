import api, { buildFilter } from './apiHelper';

export const getTickets = (filter = {}, offset = 0, limit = 100) => {
	const params = {
		...buildFilter(filter),
		offset,
		limit,
	};
	return api.get('/tickets', { params });
};

export const getTicket = (id) => api.get(`/tickets/${id}`);

export const createTicket = (data) => api.post('/tickets', {
	name: data.name,
	categoryId: data.categoryId,
	questions: data.questions,
});

export const updateTicket = (id, data) => api.patch(`/tickets/${id}`, {
	name: data.name,
	categoryId: data.categoryId,
	questions: data.questions,
});


export const deleteTicket = (id) => api.delete(`/tickets/${id}`);
