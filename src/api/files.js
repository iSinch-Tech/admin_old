import api, { baseURL } from './apiHelper';

export const downloadLink = (id) => `${baseURL}/files/${id}/download`;

export const getFiles = (offset = 0, limit = 100) => {
    const params = {
        offset,
        limit
    };
    return api.get('/files', { params });
};

export const getFile = (id) => api.get(`/files/${id}/download`, { responseType: 'blob' });

export const postFile = (data) => api.post('/files/upload', data, { headers: { 'content-type': 'multipart/form-data' } });

export const deleteFile = (id) => api.delete(`/files/${id}`);
