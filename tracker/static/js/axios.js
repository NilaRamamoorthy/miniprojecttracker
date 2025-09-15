import axios from 'https://cdn.skypack.dev/axios';

// Get CSRF token from meta tag
const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

const instance = axios.create({
//   baseURL: 'http://127.0.0.1:8000/api/',  
 baseURL: 'https://miniprojecttracker.onrender.com/api/',
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
