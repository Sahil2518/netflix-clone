const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://netflix-clone-backend-xxxx.onrender.com'; // TODO: Replace this with actual Render URL

console.log('API Base URL configured to:', API_BASE_URL);
