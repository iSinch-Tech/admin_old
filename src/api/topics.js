import api from './apiHelper';

export const getTopics = (offset = 0, limit = 100) => {
	const params = {
		offset,
		limit
	};
	return api.get('/topics', { params });
};

export const getTopic = (id) => api.get(`/topics/${id}`);

export const createTopic = (data) => api.post('/topics', {
	name: data.name,
	questions: data.questions,
});

export const updateTopic = (id, data) => api.patch(`/topics/${id}`, {
	name: data.name,
	questions: data.questions,
});


export const deleteTopic = (id) => api.delete(`/topics/${id}`);
