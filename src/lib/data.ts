/**
 * Cargadores de contenido. Cada uno pide el documento a Tina y lo pasa por
 * requestWithMetadata(): así el editor visual sabe qué campo es cada texto
 * y muestra los cambios sin guardar mientras se edita.
 */
import { requestWithMetadata } from '@tinacms/astro';
import client from '../../tina/__generated__/client';

const FILE = { relativePath: 'index.json' };
const primary = { priority: 'primary' as const };

export const getGlobal = () => requestWithMetadata(client.queries.global(FILE));
export const getInicio = () => requestWithMetadata(client.queries.inicio(FILE), primary);
export const getServicios = () => requestWithMetadata(client.queries.servicios(FILE), primary);
export const getBariatrico = () => requestWithMetadata(client.queries.bariatrico(FILE), primary);
export const getBlogPage = () => requestWithMetadata(client.queries.blog(FILE), primary);
export const getNutrium = () => requestWithMetadata(client.queries.nutrium(FILE), primary);
export const getCuestionario = () => requestWithMetadata(client.queries.cuestionario(FILE), primary);
export const getPost = (slug: string) =>
  requestWithMetadata(client.queries.post({ relativePath: `${slug}.md` }), primary);

/** Lista de entradas (solo lectura, la más reciente primero). */
export async function getPosts() {
  const res = await client.queries.postConnection({ sort: 'date', last: 100 });
  const posts = (res.data.postConnection.edges ?? [])
    .map((e) => e?.node)
    .filter((n): n is NonNullable<typeof n> => Boolean(n));
  return posts.sort((a, b) => String(b.date ?? '').localeCompare(String(a.date ?? '')));
}

export type PostSummary = Awaited<ReturnType<typeof getPosts>>[number];
