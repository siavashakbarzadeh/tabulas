import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "react-native": "react-native-web" } },
  build: {
    rollupOptions: {
      external: [
        "expo", "expo-auth-session", "expo-file-system",
        "expo-constants", "expo-crypto", "@expo/vector-icons"
      ],
    },
  },
  server: {
    port: 5201
  },
  build: {
    target: 'esnext'
  }
})
