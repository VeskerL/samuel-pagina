import type { Collection, TinaField } from 'tinacms';

/** Texto corto. */
export const text = (name: string, label: string, description?: string): TinaField => ({
  type: 'string',
  name,
  label,
  description,
});

/** Texto largo (área de texto). */
export const longText = (name: string, label: string, description?: string): TinaField => ({
  type: 'string',
  name,
  label,
  description,
  ui: { component: 'textarea' },
});

export const image = (name: string, label: string): TinaField => ({
  type: 'image',
  name,
  label,
});

/** Botón o enlace: texto + destino. */
export const cta = (name: string, label: string): TinaField => ({
  type: 'object',
  name,
  label,
  fields: [text('label', 'Texto del botón'), text('href', 'Enlace', 'Ej.: /servicios, /evalua-tu-caso o https://…')],
});

/** Lista de textos simples (viñetas). */
export const stringList = (name: string, label: string): TinaField => ({
  type: 'string',
  name,
  label,
  list: true,
});

/** Lista de objetos con etiqueta legible en el panel. */
export const objectList = (
  name: string,
  label: string,
  fields: TinaField[],
  labelKey = 'title',
): TinaField => ({
  type: 'object',
  name,
  label,
  list: true,
  ui: {
    itemProps: (item: Record<string, unknown>) => ({
      label: (item?.[labelKey] as string) || label,
    }),
  },
  fields,
});

/** Encabezado de sección: antetítulo + título + texto. */
export const sectionHead = (name: string, label: string, extra: TinaField[] = []): TinaField => ({
  type: 'object',
  name,
  label,
  fields: [
    text('eyebrow', 'Antetítulo'),
    longText('title', 'Título', 'Usa un salto de línea para partir el título en dos líneas.'),
    longText('subtitle', 'Texto'),
    ...extra,
  ],
});

/** Colección de un solo documento (una página). */
export const singlePage = (
  name: string,
  label: string,
  url: string,
  fields: TinaField[],
): Collection => ({
  name,
  label,
  path: `content/${name}`,
  format: 'json',
  ui: {
    allowedActions: { create: false, delete: false },
    router: () => url,
  },
  fields: [
    {
      type: 'object',
      name: 'seo',
      label: 'SEO',
      fields: [text('title', 'Título de la pestaña (Google)'), longText('description', 'Descripción para Google')],
    },
    ...fields,
  ],
});
