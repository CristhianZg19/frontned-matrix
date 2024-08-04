// src/apiNode.js
import axios from 'axios';

const apiNode = axios.create({
  baseURL: 'https://node-api-pt.onrender.com',
});



export default apiNode;
