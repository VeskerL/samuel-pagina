import { defineConfig } from 'tinacms';
import { collections } from './collections';

// Rama de Git donde Tina guarda los cambios. Los proveedores de hosting la exponen solos.
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  'main';

export default defineConfig({
  branch,
  // Se obtienen en app.tina.io al conectar el repositorio (ver README).
  clientId: process.env.PUBLIC_TINA_CLIENT_ID || null,
  token: process.env.TINA_TOKEN || null,

  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },
  media: {
    tina: {
      mediaRoot: 'uploads',
      publicFolder: 'public',
    },
  },
  schema: { collections },
});
