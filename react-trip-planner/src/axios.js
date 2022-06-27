import axios from 'axios';

const baseURL = 'http://127.0.0.1:8000/api/';

const axiosInstance = axios.create({
    baseURL: baseURL,
    timeout: 5000,
    headers: {
        Authorization: localStorage.getItem('access')
            ? 'JWT ' + localStorage.getItem('access')
            : null,
        'Content-Type': 'application/json',
        accept: 'application/json'
    },
});

export default axiosInstance