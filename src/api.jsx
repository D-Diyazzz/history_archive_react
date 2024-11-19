import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_BACK_URL
const api = axios.create({
    withCredentials: true,
    baseURL: API_URL
})

api.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('access_token')}`;
    return config;
})

api.interceptors.response.use((config) => {
    return config;
}, async (error) => {
    if(error.response.status === 401){

        localStorage.clear()
        window.location = '/login'
    }
})

export default api;
