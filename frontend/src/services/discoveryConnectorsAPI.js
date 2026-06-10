import axios from 'axios';
import sourcesWatchlistsAPI from './sourcesWatchlistsAPI';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5025/api';

const api = axios.create({
  baseURL: `${API_BASE_URL}/discovery-connectors`,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const discoveryConnectorsAPI = {
  getCatalog: async () => {
    const response = await api.get('/catalog');
    return response.data;
  },

  testConnection: async (payload) => {
    const response = await api.post('/test', payload);
    return response.data;
  },

  runNow: async (sourceId) => {
    const response = await api.post(`/sources/${sourceId}/run`);
    return response.data;
  },

  seedDemoPlatform: async () => {
    const response = await api.post('/seed-demo');
    return response.data;
  },

  getSources: (params) => sourcesWatchlistsAPI.getTenderSources(params),
  getSource: (id) => sourcesWatchlistsAPI.getTenderSourceById(id),
  createSource: (data) => sourcesWatchlistsAPI.createTenderSource(data),
  updateSource: (id, data) => sourcesWatchlistsAPI.updateTenderSource(id, data),
  deleteSource: (id) => sourcesWatchlistsAPI.deleteTenderSource(id),
  syncSource: (id) => sourcesWatchlistsAPI.syncTenderSource(id)
};

export default discoveryConnectorsAPI;
