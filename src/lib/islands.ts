/**
 * Regiones editables. Cuando alguien cambia un campo en el editor, Tina
 * vuelve a pedir solo la región afectada a /tina-island/<nombre> y la
 * reemplaza en la vista previa sin recargar la página.
 */
import type { IslandRegistry } from '@tinacms/astro/experimental';
import Footer from '../components/Footer.astro';
import Header from '../components/Header.astro';
import Blocks from '../components/blocks/Blocks.astro';
import CuestionarioBody from '../components/pages/CuestionarioBody.astro';
import PostBody from '../components/pages/PostBody.astro';
import { getCuestionario, getGlobal, getPagina, getPost, getPosts } from './data';

const MAIN = { tag: 'main', className: 'main' };
const DIV = { tag: 'div' };

/** Saca el documento `key` de un resultado de Tina. */
const pick = (data: unknown, key: string) =>
  (data as { data?: Record<string, unknown> })?.data?.[key];

export const islands: IslandRegistry = {
  header: {
    fetch: () => getGlobal(),
    component: Header,
    wrapper: DIV,
    propsFromData: (data, params) => ({
      data: pick(data, 'global'),
      pathname: params.get('path') ?? '/',
      theme: params.get('theme') ?? 'light',
    }),
  },
  footer: {
    fetch: () => getGlobal(),
    component: Footer,
    wrapper: DIV,
    propsFromData: (data) => ({ data: pick(data, 'global') }),
  },
  pagina: {
    fetch: async (_req, params) => ({ page: await getPagina(params.get('file') ?? 'inicio'), posts: await getPosts() }),
    component: Blocks,
    wrapper: MAIN,
    propsFromData: (d) => {
      const { page, posts } = d as { page: unknown; posts: unknown };
      return { page: pick(page, 'pagina'), posts };
    },
  },
  post: {
    fetch: (_req, params) => getPost(params.get('slug') ?? ''),
    component: PostBody,
    wrapper: MAIN,
    propsFromData: (data) => ({ data: pick(data, 'post') }),
  },
  cuestionario: {
    fetch: () => getCuestionario(),
    component: CuestionarioBody,
    wrapper: MAIN,
    propsFromData: (data) => ({ data: pick(data, 'cuestionario') }),
  },
};
