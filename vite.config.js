import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: 'index.html',
        login: 'Login/login.html',
        register: 'Register/register.html',
        dashboard: 'dashboard.html',
        translations: 'pages/translations.html',
        qrcodes: 'pages/qr-codes.html',
        settings: 'pages/settings.html'
      }
    }
  }
});