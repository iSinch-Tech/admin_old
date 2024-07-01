import api, { buildFilter } from './apiHelper';

export const getExams = (filter, offset = 0, limit = 10) => {
	const params = {
		...buildFilter(filter),
		offset,
		limit,
		orderType: 'desc'
	};
	return api.get(`/exams`, { params });
};

export const deleteExams = (userId, type = null) => {
	const params = {
		...buildFilter({
			userId,
			type,
		}),
	}
	return api.delete(`/exams`, { params });
}
