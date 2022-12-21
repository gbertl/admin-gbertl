import axios from './axios';
import { Work } from './typings';

const setAuthToken = (token: string) => {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const createWork = (newWork: Work, token: string) => {
  const formData = new FormData();

  formData.append('thumbnailFile', newWork.thumbnailFile);
  formData.append('title', newWork.title);
  formData.append('text', newWork.text);
  formData.append('category', newWork.category);
  formData.append('source', newWork.source);
  formData.append('liveUrl', newWork.liveUrl);

  setAuthToken(token);
  return axios.post('/works', newWork, {
    headers: {
      'content-type': 'multipart/form-data',
    },
  });
};

export const updateWork = (id: string, updatedWork: Work, token: string) => {
  const formData = new FormData();

  formData.append('thumbnailFile', updatedWork.thumbnailFile);
  formData.append('title', updatedWork.title);
  formData.append('text', updatedWork.text);
  formData.append('category', updatedWork.category);
  formData.append('source', updatedWork.source);
  formData.append('liveUrl', updatedWork.liveUrl);

  setAuthToken(token);
  return axios.put(`/works/${id}`, updatedWork, {
    headers: {
      'content-type': 'multipart/form-data',
    },
  });
};

export const deleteWork = (id: string, token: string) => {
  setAuthToken(token);
  return axios.delete(`/works/${id}`);
};
