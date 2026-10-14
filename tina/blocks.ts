/**
 * Bloques (secciones) con los que se arma cualquier página.
 * En Tina se agregan con el botón "+", se arrastran para reordenar,
 * se duplican o se eliminan.
 */
import type { Template, TinaField } from 'tinacms';
import { cta, image, longText, objectList, stringList, text } from './fields';

const TONES = [
  { value: 'white', label: 'Blanco' },
  { value: 'gray', label: 'Gris claro' },
  { value: 'cream', label: 'Crema' },
  { value: 'navy', label: 'Azul marino' },
];

const tone = (label = 'Color de fondo'): TinaField => ({ type: 'string', name: 'tone', label, options: TONES });

const align: TinaField = {
  type: 'string',
  name: 'align',
  label: 'Alineación del título',
  options: [
    { value: 'left', label: 'Izquierda' },
    { value: 'center', label: 'Centrado' },
  ],
};

/** Antetítulo + título + texto, al inicio de casi todos los bloques. */
const head: TinaField[] = [
  text('eyebrow', 'Antetítulo'),
  longText('title', 'Título', 'Un salto de línea parte el título en dos líneas.'),
  longText('subtitle', 'Texto'),
];

const buttons: TinaField = objectList(
  'buttons',
  'Botones',
  [
    text('label', 'Texto'),
    text('href', 'Enlace', 'Ej.: /servicios, /evalua-tu-caso, #rutas o https://…'),
    {
      type: 'string',
      name: 'style',
      label: 'Estilo',
      options: [
        { value: 'dark', label: 'Azul (principal)' },
        { value: 'yellow', label: 'Amarillo' },
        { value: 'ghost', label: 'Contorno' },
        { value: 'line', label: 'Contorno blanco (sobre azul)' },
        { value: 'link', label: 'Enlace de texto' },
        { value: 'store', label: 'Tienda de apps (negro con ícono)' },
      ],
    },
  ],
  'label',
);

const ui = (label: string, defaultItem: Record<string, unknown>) => ({
  defaultItem,
  itemProps: (item: Record<string, unknown>) => ({
    label: `${label}${item?.title || item?.eyebrow ? ' · ' + String(item?.title || item?.eyebrow).split('\n')[0] : ''}`,
  }),
});

export const PortadaFoto: Template = {
  name: 'portadaFoto',
  label: 'Portada con foto del doctor',
  ui: ui('Portada con foto', {
    eyebrow: 'Nutriólogo clínico',
    title: 'Título principal',
    image: '/uploads/doctor-recorte.png',
  }),
  fields: [
    ...head,
    buttons,
    image('image', 'Foto del doctor (PNG sin fondo)'),
    text('imageAlt', 'Descripción de la foto'),
    stringList('chipsLeft', 'Etiquetas abajo a la izquierda'),
    stringList('chipsRight', 'Etiquetas arriba a la derecha'),
  ],
};

export const Encabezado: Template = {
  name: 'encabezado',
  label: 'Encabezado de página',
  ui: ui('Encabezado', { eyebrow: 'Antetítulo', title: 'Título de la página', align: 'center', tone: 'white' }),
  fields: [
    ...head,
    text('highlight', 'Segunda línea en amarillo (opcional)'),
    align,
    tone(),
    buttons,
    objectList('stats', 'Cifras (opcional)', [text('value', 'Cifra'), text('label', 'Descripción')], 'value'),
  ],
};

export const Pestanas: Template = {
  name: 'pestanas',
  label: 'Pestañas (áreas, rutas…)',
  ui: ui('Pestañas', { title: 'Título', tone: 'white', variant: 'pills', align: 'left' }),
  fields: [
    ...head,
    text('anchor', 'Ancla para enlazar (opcional)', 'Ej.: rutas → se enlaza con #rutas'),
    align,
    tone(),
    {
      type: 'string',
      name: 'variant',
      label: 'Estilo de las pestañas',
      options: [
        { value: 'pills', label: 'Botones separados' },
        { value: 'segmented', label: 'Selector unido' },
      ],
    },
    objectList(
      'items',
      'Pestañas',
      [
        text('label', 'Texto de la pestaña'),
        text('kicker', 'Antetítulo'),
        text('title', 'Título'),
        longText('body', 'Texto'),
        stringList('points', 'Puntos clave (con chulo)'),
        text('ally', 'En alianza con (opcional)'),
        objectList('facts', 'Datos en tabla (opcional)', [text('label', 'Dato'), text('value', 'Valor')], 'label'),
        cta('cta', 'Botón'),
        cta('link', 'Enlace secundario (opcional)'),
      ],
      'label',
    ),
  ],
};

export const Pasos: Template = {
  name: 'pasos',
  label: 'Tarjetas numeradas',
  ui: ui('Tarjetas numeradas', { title: 'Título', tone: 'gray', align: 'center' }),
  fields: [...head, align, tone(), objectList('items', 'Tarjetas', [text('title', 'Título'), longText('body', 'Texto')])],
};

export const Tarjetas: Template = {
  name: 'tarjetas',
  label: 'Tarjetas',
  ui: ui('Tarjetas', { title: 'Título', tone: 'white', align: 'left' }),
  fields: [
    ...head,
    align,
    tone(),
    objectList('items', 'Tarjetas', [
      text('tag', 'Etiqueta (opcional)'),
      text('kicker', 'Antetítulo (opcional)'),
      text('title', 'Título'),
      longText('body', 'Texto'),
      cta('cta', 'Enlace (opcional)'),
      tone('Color de la tarjeta'),
    ]),
  ],
};

export const Precios: Template = {
  name: 'precios',
  label: 'Precios de consulta',
  ui: ui('Precios', {}),
  fields: [
    ...head,
    objectList(
      'items',
      'Consultas',
      [
        text('kicker', 'Nombre y duración'),
        text('price', 'Precio'),
        longText('body', 'Qué incluye'),
        cta('cta', 'Botón'),
        { type: 'boolean', name: 'featured', label: 'Destacada (fondo azul)' },
      ],
      'kicker',
    ),
  ],
};

export const Planes: Template = {
  name: 'planes',
  label: 'Planes',
  ui: ui('Planes', { title: 'Planes', tone: 'gray' }),
  fields: [
    ...head,
    tone(),
    objectList(
      'plans',
      'Planes',
      [
        text('name', 'Nombre'),
        text('discount', 'Descuento (etiqueta)'),
        longText('description', 'Descripción'),
        text('price', 'Precio'),
        text('savings', 'Ahorro'),
        stringList('items', 'Incluye'),
        text('chooser', 'Texto del selector "¿Cuál es para mí?"'),
        cta('cta', 'Botón'),
      ],
      'name',
    ),
    longText('legal', 'Condiciones'),
  ],
};

export const Frase: Template = {
  name: 'frase',
  label: 'Frase con foto',
  ui: ui('Frase', {}),
  fields: [text('eyebrow', 'Antetítulo'), longText('text', 'Frase'), text('author', 'Firma'), image('image', 'Foto'), text('imageAlt', 'Descripción de la foto')],
};

export const PromoApp: Template = {
  name: 'promoApp',
  label: 'App Nutrium (con teléfono)',
  ui: ui('App Nutrium', { tone: 'cream' }),
  fields: [
    ...head,
    tone(),
    buttons,
    text('phoneTitle', 'Título en la pantalla'),
    objectList(
      'phoneRows',
      'Filas en la pantalla',
      [text('tag', 'Etiqueta'), text('text', 'Texto'), { type: 'boolean', name: 'dark', label: 'Fila azul' }],
      'tag',
    ),
    text('phoneButton', 'Botón en la pantalla'),
  ],
};

export const GuiaPasos: Template = {
  name: 'guiaPasos',
  label: 'Guía paso a paso (con teléfono)',
  ui: ui('Guía paso a paso', { tone: 'gray' }),
  fields: [
    ...head,
    tone(),
    objectList('steps', 'Pasos', [
      text('title', 'Título del paso'),
      longText('text', 'Explicación'),
      text('screen', 'Título en la pantalla'),
      stringList('rows', 'Filas en la pantalla'),
      text('action', 'Botón en la pantalla'),
    ]),
  ],
};

export const Preguntas: Template = {
  name: 'preguntas',
  label: 'Preguntas frecuentes',
  ui: ui('Preguntas frecuentes', { title: 'Preguntas frecuentes' }),
  fields: [
    ...head,
    cta('cta', 'Botón (opcional)'),
    objectList('items', 'Preguntas', [text('question', 'Pregunta'), longText('answer', 'Respuesta')], 'question'),
  ],
};

export const CajaTarjetas: Template = {
  name: 'cajaTarjetas',
  label: 'Caja con título y mini tarjetas',
  ui: ui('Caja con mini tarjetas', { tone: 'gray' }),
  fields: [...head, tone('Color de la caja'), cta('cta', 'Botón'), objectList('items', 'Mini tarjetas', [text('title', 'Título'), longText('body', 'Texto')])],
};

export const UltimasEntradas: Template = {
  name: 'ultimasEntradas',
  label: 'Últimas entradas del blog',
  ui: ui('Últimas entradas', { title: 'Del blog', count: 3 }),
  fields: [...head, text('linkLabel', 'Texto del enlace "ver todo"'), { type: 'number', name: 'count', label: 'Cuántas mostrar' }],
};

export const ListadoBlog: Template = {
  name: 'listadoBlog',
  label: 'Blog: destacado + todas las entradas',
  ui: ui('Listado del blog', {}),
  fields: [text('featuredLabel', 'Texto sobre la entrada destacada'), text('readMoreLabel', 'Texto "leer artículo"'), image('featuredImage', 'Foto del bloque destacado')],
};

export const Formulario: Template = {
  name: 'formulario',
  label: 'Formulario de pregunta',
  ui: ui('Formulario', { tone: 'cream' }),
  fields: [
    ...head,
    tone('Color de la caja'),
    text('fieldLabel', 'Etiqueta del campo'),
    text('placeholder', 'Ejemplo dentro del campo'),
    text('button', 'Texto del botón'),
    text('thanks', 'Mensaje al enviar'),
    text('webhookUrl', 'URL que recibe los mensajes (opcional)', 'Formspree, Make, Zapier…'),
  ],
};

export const Franja: Template = {
  name: 'franja',
  label: 'Franja de llamado a la acción',
  ui: ui('Franja', { title: '¿Listo para empezar?', tone: 'yellow' }),
  fields: [
    longText('title', 'Título'),
    longText('subtitle', 'Texto'),
    {
      type: 'string',
      name: 'tone',
      label: 'Color',
      options: [
        { value: 'yellow', label: 'Amarillo' },
        { value: 'navy', label: 'Azul marino' },
      ],
    },
    buttons,
  ],
};

export const Texto: Template = {
  name: 'texto',
  label: 'Texto libre',
  ui: ui('Texto libre', {}),
  fields: [...head, { type: 'rich-text', name: 'body', label: 'Contenido' }],
};

export const BLOCKS: Template[] = [
  PortadaFoto,
  Encabezado,
  Pestanas,
  Pasos,
  Tarjetas,
  Precios,
  Planes,
  Frase,
  PromoApp,
  GuiaPasos,
  Preguntas,
  CajaTarjetas,
  UltimasEntradas,
  ListadoBlog,
  Formulario,
  Franja,
  Texto,
];
