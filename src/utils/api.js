import axios from "axios";

const API_BASE_URL = "https://appreward.pythonanywhere.com/api";

export const registerUser = async (userData) => {
    return axios.post(`${API_BASE_URL}/register/`, userData);
};

export const loginUser = async (credentials) => {
    return axios.post(`${API_BASE_URL}/login/`, credentials);
};

export const getUserData = async (token) => {
    return axios.get(`${API_BASE_URL}/profile/`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
    });
};

export const refreshToken = async (refresh) => {
    return await axios.post(`${API_BASE_URL}/token/refresh/`, { refresh });
};

export const fetchAllApps = async () => {
    const token = localStorage.getItem("access_token");
    return axios.get(`${API_BASE_URL}/admin/apps/`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
    });
};

export const fetchAllTasks = async (token, user) => {
    return axios.get(`${API_BASE_URL}/tasks/${user.username}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
    });
};

export const fetchUndoneTasks = async (token, user) => {
    return axios.get(`${API_BASE_URL}/tasks/undone/${user.username}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
    });
};

export const getCSRFToken = async () => {
    const response = await axios.get(`${API_BASE_URL}/csrf/`, { withCredentials: true });
    return response.data.csrfToken;
};

export const uploadTask = async (token, app_id, formData) => {
    const csrfToken = await getCSRFToken();
    return axios.post(`${API_BASE_URL}/tasks/upload/${app_id}/`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
            'X-CSRFToken': csrfToken
        },
        withCredentials: true
    });
};

export const createApp = async (token, formData) => {
    const csrfToken = await getCSRFToken();
    return axios.post(`${API_BASE_URL}/admin/apps/create/`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
            'X-CSRFToken': csrfToken
        },
        withCredentials: true
    });
};