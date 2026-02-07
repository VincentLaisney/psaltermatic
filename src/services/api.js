import axios from 'axios'

// Use a fixed, build-time API key. Set VITE_API_KEY in your environment when running Vite.
// WARNING: embedding a secret in frontend code is not secure — it will be visible to anyone
// who can access the app. Prefer server-side protections when possible.
const apiKey = typeof import.meta !== 'undefined' ? import.meta.env.VITE_API_KEY : undefined

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    ...(apiKey ? { 'X-PSALT-KEY': apiKey } : {})
  }
})

export default api