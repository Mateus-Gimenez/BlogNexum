import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Altere para a URL da sua API
});

export default api;
