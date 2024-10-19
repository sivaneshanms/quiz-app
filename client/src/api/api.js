// api/api.js
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const register = async (data) => {
    return await axios.post(`${API_URL}/auth/register`, data);
};

export const login = async (data) => {
    return await axios.post(`${API_URL}/auth/login`, data);
};
