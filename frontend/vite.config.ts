/// <reference types="vitest/config" />
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig, InlineConfig, UserConfig } from 'vite';

// Extends Vite’s UserConfig type to include Vitest-specific options (`test` field).
interface VitestConfigExport extends UserConfig {
  test: InlineConfig;
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    assetsDir: '',
    emptyOutDir: true,
    outDir: '../frontend_dist',
    sourcemap: false,
  },
  server: {
    port: 3000,
  },
  test: {
    environment: 'jsdom', // Sets the test environment to `jsdom` to simulate a browser.
    globals: true, // Enables global test APIs like `describe`, `it`, etc.
    setupFiles: './setupTests.ts', // Specifies a setup file to run before tests.
  },
} as VitestConfigExport);
