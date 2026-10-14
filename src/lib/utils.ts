import { sanitizeHref, sanitizeImageSrc } from '@tinacms/astro/sanitize';

/** Parte un texto en líneas (para títulos con salto de línea). */
export const lines = (value?: string | null) => String(value ?? '').split('\n');

/** Enlace seguro con valor por defecto. */
export const href = (value?: string | null, fallback = '#') => {
  const v = String(value ?? '').trim();
  if (!v) return fallback;
  if (v.startsWith('#') || v.startsWith('/') || v.startsWith('mailto:') || v.startsWith('tel:')) return v;
  return sanitizeHref(v) || fallback;
};

export const img = (value?: string | null) => (value ? sanitizeImageSrc(value) || '' : '');

/** Lista sin nulos (Tina devuelve listas opcionales). */
export const list = <T,>(value?: (T | null | undefined)[] | null): T[] =>
  (value ?? []).filter((x): x is T => x !== null && x !== undefined);

export const has = (value?: string | null) => Boolean(String(value ?? '').trim());

export const CATEGORY_LABELS: Record<string, string> = {
  digestivo: 'Digestivo',
  peso: 'Peso',
  metabolico: 'Metabólico',
  sueno: 'Sueño',
  habitos: 'Hábitos',
};

export const isExternal = (url: string) => /^https?:\/\//.test(url);
