// import axios from 'axios';

// const api = axios.create({
//     baseURL: 'http://localhost:5000/api',
//     withCredentials: true, // Cookies automatisch senden
// });

// export default api;


import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true, // Cookies senden
});

export default instance;