import axios from 'axios'
import { getToken, removeToken } from '../utils/auth'

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor – attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor – handle 401 (token expired)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only 401 (token expired/invalid) should force logout.
    // 403 = Forbidden (permissions issue) — do NOT logout on this or it
    // causes an immediate redirect loop right after login when Sidebar
    // fetches /api/expenses and the backend returns 403.
    if (error.response?.status === 401) {
      removeToken()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
