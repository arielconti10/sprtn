import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://hapi.spartan.ftd.com.br/api/'
});

const token = sessionStorage.getItem('access_token');

instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

export default instance;