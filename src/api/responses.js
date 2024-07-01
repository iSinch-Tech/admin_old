import api from './apiHelper';

export const getResponses = (userId, offset = 0, limit = 10) => {
	const params = {
		offset,
		limit,
		orderType: 'desc'
	};
	return api.get(`/responses/user/${userId}`, { params });
};

export const deleteResponses = (userId) => api.delete(`/responses/user/${userId}`);
