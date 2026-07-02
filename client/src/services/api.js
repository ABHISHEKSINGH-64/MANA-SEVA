import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mana_seva_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const apiMessage = (error) => {
  if (!error?.response) {
    return 'API server is not reachable. Start the backend with npm run dev:server or run npm run dev from the project root.';
  }
  return error.response.data?.message || error.message || 'Unable to complete request';
};
