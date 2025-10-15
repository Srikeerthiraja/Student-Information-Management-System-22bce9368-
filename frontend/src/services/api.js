
import axios from 'axios';
import store from '../redux/store';
import { authLogout } from '../redux/userRelated/userSlice';

const API = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    timeout: 10000,
});

// REQUEST INTERCEPTOR - Add token to all requests
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

//  RESPONSE INTERCEPTOR - Handle 401 errors
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            store.dispatch(authLogout());
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export default API;