import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Auto-detect the correct base path on GitHub Actions so assets resolve on Pages
// Locally (no CI), base will be '/'
const isCI = process.env.CI === 'true';
const repo = process.env.GITHUB_REPOSITORY ? process.env.GITHUB_REPOSITORY.split('/')[1] : '';
const isUserSite = repo.endsWith('.github.io');
const base = isCI && repo ? (isUserSite ? '/' : `/${repo}/`) : '/';

export default defineConfig({
  base,
  plugins: [react()],
});


