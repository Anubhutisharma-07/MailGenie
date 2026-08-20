import axios from 'axios';
import useStore from '../store/useStore';

const apiClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const state = useStore.getState();
    config.baseURL = state.backendUrl;
    
    // Auth token integration (for Epic 2)
    const token = localStorage.getItem('mailgenie_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    useStore.getState().setBackendOnline(true);
    return response;
  },
  (error) => {
    console.error("API Client Error:", error);
    if (!error.response || error.code === 'ERR_NETWORK') {
      useStore.getState().setBackendOnline(false);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
