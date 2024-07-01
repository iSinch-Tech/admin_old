import api, { buildFilter } from './apiHelper';

export const getMessages = (userId, offset = 0, limit = 100) => {
	const params = {
		offset,
		limit,
		...buildFilter({
			recipientId: userId,
		}),
	};
	return api.get('/messages', { params });
};

export const sendMessage = (userId, text) => api.post('/messages', {
	recipientId: userId,
	text: text,
});


export const deleteMessage = (id) => api.delete(`/messages/${id}`);
