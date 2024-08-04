// src/apiNode.js
import axios from 'axios';

const apiNode = axios.create({
  baseURL: 'http://localhost:3001',
});



export default apiNode;
