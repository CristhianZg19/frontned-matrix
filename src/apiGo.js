// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://go-api-pt.onrender.com',
});



export default api;
