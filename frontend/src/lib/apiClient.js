import axios from 'axios';
import { supabase } from './supabaseClient';
import toast from 'react-hot-toast';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' }
});

apiClient.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.error || error.message;

    if (status === 401) {
      window.location.href = '/login';
    } else if (status === 403) {
      toast.error('You do not have permission to perform this action.');
    } else if (status === 404) {
      toast.error('The requested resource was not found.');
    } else if (status >= 500) {
      toast.error('Server error. Please try again later.');
    } else if (!window.navigator.onLine) {
      toast.error('No internet connection. Please check your network.');
    } else {
      toast.error(message || 'Something went wrong.');
    }

    return Promise.reject(error);
  }
);

export default apiClient;
