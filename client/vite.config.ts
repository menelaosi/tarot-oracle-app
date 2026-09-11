import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // @menelaos/react-natal-chart declares react as a peer dependency, not a
  // direct one, so this shouldn't be needed in practice — kept as cheap
  // insurance against a duplicate React copy if that ever changes.
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
});
