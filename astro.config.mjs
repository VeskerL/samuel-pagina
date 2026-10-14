// @ts-check
import { defineConfig } from 'astro/config';
import tina from '@tinacms/astro/integration';
import { tinaAdminDevRedirect } from '@tinacms/astro/vite';

/**
 * Las páginas se generan como HTML estático (rápido y bueno para SEO).
 * Solo la ruta /tina-island (la que usa el editor visual) corre en el servidor,
 * así que hace falta un adaptador. Se detecta solo según el hosting:
 * Vercel, Netlify o, en cualquier otro caso, un servidor Node.
 */
async function getAdapter() {
  const target =
    process.env.DEPLOY_ADAPTER ||
    (process.env.VERCEL ? 'vercel' : process.env.NETLIFY ? 'netlify' : 'node');
  if (target === 'vercel') return (await import('@astrojs/vercel')).default();
  if (target === 'netlify') return (await import('@astrojs/netlify')).default();
  return (await import('@astrojs/node')).default({ mode: 'standalone' });
}

function getSiteUrl() {
  if (process.env.SITE_URL) return process.env.SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.NETLIFY && process.env.URL) return process.env.URL;
  return 'http://localhost:4321';
}

export default defineConfig({
  site: getSiteUrl(),
  output: 'static',
  adapter: await getAdapter(),
  integrations: [tina()],
  build: { inlineStylesheets: 'always' },
  // La barra de Astro estorba dentro de la vista previa de Tina.
  devToolbar: { enabled: false },
  vite: {
    plugins: [tinaAdminDevRedirect()],
    ssr: { noExternal: ['@tinacms/astro', '@tinacms/bridge'] },
    build: {
      rollupOptions: {
        onwarn(warning, warn) {
          if (warning.code === 'UNUSED_EXTERNAL_IMPORT' && warning.exporter === 'tinacms/dist/client') return;
          warn(warning);
        },
      },
    },
  },
});
