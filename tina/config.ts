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
  // El Client ID es público (va en el navegador); el token sí es secreto y solo va en el hosting.
  clientId: process.env.PUBLIC_TINA_CLIENT_ID || '26aad0ef-efb1-4a01-83f9-7d11a43149bb',
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
