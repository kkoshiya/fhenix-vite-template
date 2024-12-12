import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import wasm from 'vite-plugin-wasm';

// export default defineConfig({
//   plugins: [wasm(), react()],
// });

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), wasm()],
})
