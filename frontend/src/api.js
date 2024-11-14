import axios from 'axios';

// Basis-URL für dein Backend
axios.defaults.baseURL = 'http://localhost:5000';

// Interceptor für Token
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken'); // Token aus localStorage abrufen
    if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Token im Header setzen
    }
    return config; // Konfiguration zurückgeben
});

export default axios;
