import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const API_URL = import.meta.env.VITE_API_URL || '/api'

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;
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
        const isLoginRequest = error.config?.url?.endsWith('/auth/login');
        if (error.response?.status === 401 && !isLoginRequest) {
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
    login: async (email: string, password: string) => {
        await getCsrfCookie()
        return api.post('/auth/login', { email, password })
    },
    register: (data: any) =>
        api.post('/auth/register', data),
    logout: () => api.post('/auth/logout'),
    me: () => api.get('/auth/me'),
    forgotPassword: (email: string) =>
        api.post('/auth/forgot-password', { email }),
    resetPassword: (data: any) =>
        api.post('/auth/reset-password', data),
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
    all: (params?: { category?: string; is_editorial?: boolean; lang?: string }) =>
        api.get('/events', { params }),
    show: (id: number, params?: { lang?: string }) => api.get(`/events/${id}`, { params }),
    upcoming: () => api.get('/events/upcoming'),
    store: (data: FormData) => api.post('/events', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }),
    update: (id: number, data: FormData) => {
        // Laravel doesn't support multipart/form-data for PUT/PATCH directly via FormData
        // So we use POST with _method=PUT
        data.append('_method', 'PUT')
        return api.post(`/events/${id}`, data, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
    },
    delete: (id: number) => api.delete(`/events/${id}`),
}

// Chat
export const chatApi = {
    send: (message: string) =>
        api.post('/chat', { message }),
    stream: async (message: string, onChunk: (text: string) => void) => {
        const token = useAuthStore.getState().token
        const response = await fetch(`${import.meta.env.VITE_API_URL}/chat/stream`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'text/plain',
            },
            body: JSON.stringify({ message }),
        })

        if (!response.ok) throw new Error('Failed to start stream')

        const reader = response.body?.getReader()
        const decoder = new TextDecoder()

        if (reader) {
            while (true) {
                const { done, value } = await reader.read()
                if (done) break
                const chunk = decoder.decode(value, { stream: true })
                onChunk(chunk)
            }
        }
    },
    history: () => api.get('/chat/history'),
    clearHistory: () => api.delete('/chat/history'),
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
    importStudents: (file: File) => {
        const formData = new FormData()
        formData.append('file', file)
        return api.post('/admin/students/import', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
    },
    stats: () => api.get('/admin/stats'),
    getFaqs: () => api.get('/admin/faqs'),
    createFaq: (data: any) => api.post('/admin/faqs', data),
    updateFaq: (id: number, data: any) => api.put(`/admin/faqs/${id}`, data),
    deleteFaq: (id: number) => api.delete(`/admin/faqs/${id}`),
}
