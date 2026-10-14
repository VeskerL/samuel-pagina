/**
 * Regiones editables. Cuando alguien cambia un campo en el editor, Tina
 * vuelve a pedir solo la región afectada a /tina-island/<nombre> y la
 * reemplaza en la vista previa sin recargar la página.
 */
import type { IslandRegistry } from '@tinacms/astro/experimental';
import Footer from '../components/Footer.astro';
import Header from '../components/Header.astro';
import BariatricoBody from '../components/pages/BariatricoBody.astro';
import BlogIndexBody from '../components/pages/BlogIndexBody.astro';
import CuestionarioBody from '../components/pages/CuestionarioBody.astro';
import InicioBody from '../components/pages/InicioBody.astro';
import NutriumBody from '../components/pages/NutriumBody.astro';
import PostBody from '../components/pages/PostBody.astro';
import ServiciosBody from '../components/pages/ServiciosBody.astro';
import {
  getBariatrico,
  getBlogPage,
  getCuestionario,
  getGlobal,
  getInicio,
  getNutrium,
  getPost,
  getPosts,
  getServicios,
} from './data';

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
  inicio: {
    fetch: async () => ({ page: await getInicio(), posts: await getPosts() }),
    component: InicioBody,
    wrapper: MAIN,
    propsFromData: (d) => {
      const { page, posts } = d as { page: unknown; posts: unknown };
      return { data: pick(page, 'inicio'), posts };
    },
  },
  servicios: {
    fetch: () => getServicios(),
    component: ServiciosBody,
    wrapper: MAIN,
    propsFromData: (data) => ({ data: pick(data, 'servicios') }),
  },
  bariatrico: {
    fetch: () => getBariatrico(),
    component: BariatricoBody,
    wrapper: MAIN,
    propsFromData: (data) => ({ data: pick(data, 'bariatrico') }),
  },
  blog: {
    fetch: async () => ({ page: await getBlogPage(), posts: await getPosts() }),
    component: BlogIndexBody,
    wrapper: MAIN,
    propsFromData: (d) => {
      const { page, posts } = d as { page: unknown; posts: unknown };
      return { data: pick(page, 'blog'), posts };
    },
  },
  post: {
    fetch: (_req, params) => getPost(params.get('slug') ?? ''),
    component: PostBody,
    wrapper: MAIN,
    propsFromData: (data) => ({ data: pick(data, 'post') }),
  },
  nutrium: {
    fetch: () => getNutrium(),
    component: NutriumBody,
    wrapper: MAIN,
    propsFromData: (data) => ({ data: pick(data, 'nutrium') }),
  },
  cuestionario: {
    fetch: () => getCuestionario(),
    component: CuestionarioBody,
    wrapper: MAIN,
    propsFromData: (data) => ({ data: pick(data, 'cuestionario') }),
  },
};
