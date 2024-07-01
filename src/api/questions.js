import api, { buildFilter } from './apiHelper';

export const getQuestions = (offset = 0, limit = 10) => {
	const params = {
		offset,
		limit,
		orderType: 'desc'
	};
	return api.get('/questions', { params });
};

export const getQuestion = (id) => api.get(`/questions/${id}`);

export const searchQuestion = (filter, offset = 0, limit = 10) => {
	const params = {
		...buildFilter(filter),
		offset,
		limit,
		orderType: 'desc'
	}
	return api.get('/questions', { params });
};

export const createQuestion = (data) => api.post('/questions', {
	image: data.image,
	name: data.name,
	text: data.text,
	answers: data.answers,
	categoryId: data.categoryId,
});

export const updateQuestion = (id, data) => api.patch(`/questions/${id}`, {
	image: data.image,
	name: data.name,
	text: data.text,
	answers: data.answers,
	categoryId: data.categoryId,
});

export const deleteQuestion = (id) => api.delete(`/questions/${id}`);
