import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Standalone Vite configuration for Google AI Studio UI previews
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
});
