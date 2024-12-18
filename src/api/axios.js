import axios from 'axios';
import { APP_API_URL } from './config';

export const axiosInstance = axios.create({
    baseURL: APP_API_URL,
    Headers: {
        'Content-Type': 'application/json',
    },
});

export const axiosPrivate = axios.create({
    baseURL: APP_API_URL,
    withCredentials: true,
    Headers: {
        'Content-Type': 'application/json',
    },
});
