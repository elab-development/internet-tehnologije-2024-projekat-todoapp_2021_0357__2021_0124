import axios from 'axios';

// izbacila ovde withCredentials jer ne radi kako treba
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export default api;
