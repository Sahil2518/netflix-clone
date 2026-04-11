const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://netflix-clone-1fki.onrender.com';

console.log('API Base URL configured to:', API_BASE_URL);
