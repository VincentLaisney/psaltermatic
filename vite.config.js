import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import os from 'os'

function getLocalExternalIp() {
  const nets = os.networkInterfaces()
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) return net.address
    }
  }
  return 'localhost'
}

const devHost = process.env.DEV_HOST || getLocalExternalIp()
const hmrPort = process.env.VITE_PORT ? parseInt(process.env.VITE_PORT) : 5173

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    // ensure server port matches HMR port
    port: hmrPort,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      }
    },
    // allow access from LAN (other machines)
    allowedHosts: 'all',
    hmr: {
      // explicitly expose the HMR websocket host so clients can connect
      host: devHost,
      protocol: 'ws',
      port: hmrPort,
    }
  }
})
