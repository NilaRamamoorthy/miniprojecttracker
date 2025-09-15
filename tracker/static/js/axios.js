import axios from 'https://cdn.skypack.dev/axios';

// Get CSRF token from meta tag
const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

const instance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',  // Full backend URL here
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});


// Interceptors
instance.interceptors.request.use(config => {
  document.querySelector('#loading').style.display = 'block';
  return config;
}, error => {
  return Promise.reject(error);
});

instance.interceptors.response.use(response => {
  document.querySelector('#loading').style.display = 'none';
  return response;
}, error => {
  alert("Error: " + (error.response?.data?.message || error.message));
  document.querySelector('#loading').style.display = 'none';
  return Promise.reject(error);
});

export default instance;
