import axios from 'https://cdn.skypack.dev/axios';

const getCookie = (name) => {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
};

const instance = axios.create({
  baseURL: '/api/', // relative URL if served by Django itself
  headers: {
    'Content-Type': 'application/json',
    'X-CSRFToken': getCookie('csrftoken'),  // Important for POST/PUT/DELETE
  },
  withCredentials: true  // Required for session cookies to be sent
});

// Optional: Show loading indicator
instance.interceptors.request.use(config => {
  const loader = document.querySelector('#loading');
  if (loader) loader.style.display = 'block';
  return config;
}, error => Promise.reject(error));

instance.interceptors.response.use(response => {
  const loader = document.querySelector('#loading');
  if (loader) loader.style.display = 'none';
  return response;
}, error => {
  const loader = document.querySelector('#loading');
  if (loader) loader.style.display = 'none';
  alert("Error: " + (error.response?.data?.message || error.message));
  return Promise.reject(error);
});

export default instance;
