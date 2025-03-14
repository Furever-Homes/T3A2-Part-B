import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: 'src/client',
  base: "/", // Ensure correct routing on Netlify
  build: {
    outDir: "../../dist", // Ensures Netlify deploys correctly
  }
});
