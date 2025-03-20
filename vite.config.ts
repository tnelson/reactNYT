// This configuration file gives Vite info on running this React app.
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import {version} from "./package.json"

export default defineConfig(() => {
  return {
    base: '/reactNYT/', // NOT IN THE LIVECODE REPO EXAMPLE
    build: {
      outDir: 'build',
    },
    define: {
      "__APP_VERSION": JSON.stringify(version)
    },
    plugins: [react()],
    // Development server port (same as gearup)
    server: {
      port: 8000,
    }
  };
});