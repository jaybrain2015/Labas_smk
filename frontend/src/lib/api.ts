import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const API_URL = import.meta.env.VITE_API_URL || '/api'

axios.defaults.withCredentials = true;
axios.defaults.xsrfCookieName = 'XSRF-TOKEN';
axios.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
})

// Helper to get CSRF cookie
export const getCsrfCookie = () => {
    const baseURL = API_URL.replace(/\/api$/, '')
    return axios.get(`${baseURL}/sanctum/csrf-cookie`)
}

// Request interceptor — attach token
api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Response interceptor — handle 401
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            useAuthStore.getState().logout()
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export default api

// ── API Functions ──────────────────────────────────────────────

// Auth
export const authApi = {
    login: (email: string, password: string) =>
        api.post('/auth/login', { email, password }),
    register: (data: any) =>
        api.post('/auth/register', data),
    logout: () => api.post('/auth/logout'),
    me: () => api.get('/auth/me'),
}

// Schedule
export const scheduleApi = {
    my: () => api.get('/schedule/my'),
    week: (params?: { start_date?: string; end_date?: string }) =>
        api.get('/schedule/week', { params }),
}

// Rooms
export const roomsApi = {
    availability: () => api.get('/rooms/availability'),
    show: (id: number) => api.get(`/rooms/${id}`),
}

// Events
export const eventsApi = {
    all: (params?: { category?: string }) =>
        api.get('/events', { params }),
    upcoming: () => api.get('/events/upcoming'),
}

// Chat
export const chatApi = {
    send: (message: string) =>
        api.post('/chat', { message }),
    history: () => api.get('/chat/history'),
}

// Course Chat
export const courseChatApi = {
    getMessages: (subject: string, groupName: string) =>
        api.get('/course-chat', { params: { subject, group_name: groupName } }),
    sendMessage: (subject: string, groupName: string, message: string) =>
        api.post('/course-chat', { subject, group_name: groupName, message }),
}

// Admin
export const adminApi = {
    importSchedule: (file: File) => {
        const formData = new FormData()
        formData.append('file', file)
        return api.post('/admin/schedule/import', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
    },
    stats: () => api.get('/admin/stats'),
}
