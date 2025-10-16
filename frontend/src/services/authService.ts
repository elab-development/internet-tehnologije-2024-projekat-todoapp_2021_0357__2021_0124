import api from './api';

export const login = (credentials: any) => {
  return api.post('/login', credentials);
};

export const register = (userData: any) => {
  return api.post('/register', userData);
};
