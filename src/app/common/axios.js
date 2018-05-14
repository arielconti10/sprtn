import axios from 'axios';

const instance = axios.create({
    baseURL: process.env.API_URL
});

instance.interceptors.request.use(request => {
    const token = sessionStorage.getItem('access_token');
    request.headers.common.Authorization = `Bearer ${token}`;

    // Edit request config
    return request;
}, error => {
    console.log(error);
    return Promise.reject(error);
});


export default instance;