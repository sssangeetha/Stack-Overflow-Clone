import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Question API
export const questionApi = {
  getAll: async () => {
    const response = await api.get('/questions');
    return response.data;
  },
  
  create: async (data: { title: string; body: string; tags: string[] }) => {
    const response = await api.post('/questions', data);
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/questions/${id}`);
    return response.data;
  }
};

// Auth API
export const authApi = {
  register: async (data: { username: string; email: string; password: string }) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
  
  login: async (data: { email: string; password: string }) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  }
};