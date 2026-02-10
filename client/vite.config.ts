import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import tailwindcss from '@tailwindcss/vite';
import VueDevTools from 'vite-plugin-vue-devtools';
import vue from '@vitejs/plugin-vue';
import path, { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import fs from 'node:fs';

export default defineConfig(({ mode }) => {
  // For development, try to read the API key from the Docker secret file if it exists
  const env = loadEnv(mode, process.cwd(), '');
  let mapApiKey = '';
  const secretPath = env.VITE_MAP_API_KEY_FILE;

  if (mode === 'development' && secretPath && fs.existsSync(secretPath)) {
    try {
      mapApiKey = fs.readFileSync(secretPath, 'utf8').trim();
      console.log('Map API Key successfully read from secret file.');
    } catch (error) {
      console.warn('Could not read map API Key from secret file:', error);
    }
  } else {
    if (mode === 'development')
      console.warn(
        'Running in development mode without Docker secrets. Falling back to VITE_MAP_API_KEY env variable.'
      );
    mapApiKey = env.VITE_MAP_API_KEY ?? '';
  }

  return {
    plugins: [
      VueDevTools(),
      vue(),
      tailwindcss(),
      VueI18nPlugin({
        include: resolve(
          dirname(fileURLToPath(import.meta.url)),
          './src/locales/**'
        ),
      }),
    ],
    // Inject the variable globally into the application
    define: {
      __MAP_API_KEY__: JSON.stringify(mapApiKey),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: parseInt(process.env.VITE_PORT || '5173'),
      host: true, // Needed for Docker port mapping
      proxy: {
        // Every request starting with /api is forwarded to the backend
        '/api': {
          target: process.env.VITE_SERVER_URL || 'http://localhost:3000',
          changeOrigin: true,
        },
      },
    },
  };
});
