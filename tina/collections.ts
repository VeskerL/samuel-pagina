import type { Collection } from 'tinacms';
import { cta, image, longText, objectList, sectionHead, singlePage, stringList, text } from './fields';

/* ───────────── Ajustes generales: menú, pie y datos de contacto ───────────── */
export const Global: Collection = {
  name: 'global',
  label: 'Ajustes generales',
  path: 'content/global',
  format: 'json',
  ui: { global: true, allowedActions: { create: false, delete: false } },
  fields: [
    {
      type: 'object',
      name: 'brand',
      label: 'Marca',
      fields: [image('logo', 'Logo (símbolo)'), text('name', 'Nombre'), text('tagline', 'Profesión bajo el nombre')],
    },
    {
      type: 'object',
      name: 'header',
      label: 'Menú',
      fields: [
        objectList('nav', 'Enlaces del menú', [text('label', 'Texto'), text('href', 'Enlace')], 'label'),
        cta('cta', 'Botón del menú'),
      ],
    },
    {
      type: 'object',
      name: 'contact',
      label: 'Contacto y enlaces clave',
      fields: [
        text('whatsappLabel', 'WhatsApp (texto visible)'),
        text('whatsappUrl', 'Enlace de WhatsApp', 'Ej.: https://wa.me/57300…'),
        text('email', 'Correo'),
        text('nutriumBookingUrl', 'Enlace de agenda en Nutrium'),
        longText('address', 'Dirección del consultorio'),
        text('modality', 'Modalidad'),
        objectList('social', 'Redes sociales', [text('label', 'Red'), text('url', 'Enlace')], 'label'),
      ],
    },
    {
      type: 'object',
      name: 'footer',
      label: 'Pie de página',
      fields: [
        longText('statement', 'Frase de marca'),
        objectList('links', 'Enlaces "Explora"', [text('label', 'Texto'), text('href', 'Enlace')], 'label'),
        objectList('legal', 'Enlaces legales', [text('label', 'Texto'), text('href', 'Enlace')], 'label'),
        text('copyright', 'Texto de derechos'),
      ],
    },
  ],
};

/* ───────────────────────────────── Inicio ───────────────────────────────── */
export const Inicio = singlePage('inicio', 'Inicio', '/', [
  {
    type: 'object',
    name: 'hero',
    label: 'Portada',
    fields: [
      text('eyebrow', 'Antetítulo'),
      longText('title', 'Título'),
      longText('subtitle', 'Texto'),
      cta('primary', 'Botón principal'),
      cta('secondary', 'Enlace secundario'),
      image('image', 'Foto del doctor (PNG sin fondo)'),
      text('imageAlt', 'Descripción de la foto'),
      stringList('chipsLeft', 'Etiquetas abajo a la izquierda'),
      stringList('chipsRight', 'Etiquetas arriba a la derecha'),
    ],
  },
  sectionHead('areasHead', 'Áreas · encabezado'),
  objectList(
    'areas',
    'Áreas de consulta (pestañas)',
    [
      text('label', 'Texto de la pestaña'),
      text('kicker', 'Antetítulo'),
      text('title', 'Título'),
      longText('body', 'Texto'),
      stringList('points', 'Puntos clave'),
      cta('cta', 'Botón'),
    ],
    'label',
  ),
  sectionHead('stepsHead', 'Primera consulta · encabezado'),
  objectList('steps', 'Primera consulta · pasos', [text('title', 'Título'), longText('body', 'Texto')]),
  {
    type: 'object',
    name: 'quote',
    label: 'Frase del doctor',
    fields: [
      text('eyebrow', 'Antetítulo'),
      longText('text', 'Frase'),
      text('author', 'Firma'),
      image('image', 'Foto'),
      text('imageAlt', 'Descripción de la foto'),
    ],
  },
  sectionHead('nutrium', 'Bloque Nutrium', [cta('primary', 'Botón principal'), cta('secondary', 'Enlace secundario')]),
  sectionHead('blog', 'Bloque del blog', [text('linkLabel', 'Texto del enlace "ver todo"')]),
  sectionHead('ctaBand', 'Franja final (llamado al test)', [cta('button', 'Botón')]),
]);

/* ──────────────────────────────── Servicios ─────────────────────────────── */
export const Servicios = singlePage('servicios', 'Servicios y planes', '/servicios', [
  sectionHead('hero', 'Portada'),
  objectList(
    'consultas',
    'Consultas',
    [
      text('kicker', 'Antetítulo (nombre y duración)'),
      text('price', 'Precio'),
      longText('body', 'Qué incluye'),
      cta('cta', 'Botón'),
      { type: 'boolean', name: 'featured', label: 'Destacada (fondo azul)' },
    ],
    'kicker',
  ),
  sectionHead('plansHead', 'Planes · encabezado'),
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
      text('chooser', 'Texto del selector "¿Cuál es para mí?"', 'Ej.: Empiezo desde cero'),
      cta('cta', 'Botón'),
    ],
    'name',
  ),
  longText('plansLegal', 'Condiciones de los planes'),
  sectionHead('extrasHead', 'Otros servicios · encabezado'),
  objectList(
    'extras',
    'Otros servicios',
    [
      text('kicker', 'Antetítulo'),
      text('title', 'Título'),
      longText('body', 'Texto'),
      cta('cta', 'Enlace (opcional)'),
      {
        type: 'string',
        name: 'tone',
        label: 'Color de la tarjeta',
        options: [
          { value: 'navy', label: 'Azul marino' },
          { value: 'gray', label: 'Gris claro' },
          { value: 'cream', label: 'Crema' },
        ],
      },
    ],
  ),
  sectionHead('business', 'Empresas e instituciones', [
    cta('cta', 'Botón'),
    objectList('items', 'Servicios para empresas', [text('title', 'Título'), longText('body', 'Texto')]),
  ]),
]);

/* ─────────────────────────── Programa bariátrico ────────────────────────── */
export const Bariatrico = singlePage('bariatrico', 'Programa bariátrico', '/programa-bariatrico', [
  {
    type: 'object',
    name: 'hero',
    label: 'Portada',
    fields: [
      text('eyebrow', 'Antetítulo'),
      text('title', 'Título (línea blanca)'),
      text('highlight', 'Título (línea amarilla)'),
      longText('subtitle', 'Texto'),
      cta('primary', 'Botón principal'),
      cta('secondary', 'Botón secundario'),
      objectList('stats', 'Cifras', [text('value', 'Cifra'), text('label', 'Descripción')], 'value'),
    ],
  },
  sectionHead('routesHead', 'Rutas · encabezado'),
  objectList(
    'routes',
    'Rutas (pestañas)',
    [
      text('tab', 'Texto de la pestaña'),
      text('kicker', 'Antetítulo'),
      text('title', 'Título'),
      longText('body', 'Texto'),
      text('ally', 'Aliado (nombre y especialidad)'),
      objectList('facts', 'Datos', [text('label', 'Dato'), text('value', 'Valor')], 'label'),
      cta('cta', 'Botón'),
    ],
    'tab',
  ),
  sectionHead('phasesHead', 'Fases · encabezado'),
  objectList('phases', 'Fases', [text('tag', 'Etiqueta'), text('title', 'Título'), longText('body', 'Texto')]),
  sectionHead('faqHead', 'Preguntas frecuentes · encabezado', [cta('cta', 'Botón')]),
  objectList('faqs', 'Preguntas frecuentes', [text('question', 'Pregunta'), longText('answer', 'Respuesta')], 'question'),
  sectionHead('ctaBand', 'Franja final', [cta('button', 'Botón')]),
]);

/* ─────────────────────────────── Blog (página) ──────────────────────────── */
export const BlogPage = singlePage('blog', 'Blog · página principal', '/blog', [
  sectionHead('hero', 'Portada'),
  text('featuredLabel', 'Texto sobre la entrada destacada'),
  text('readMoreLabel', 'Texto "leer artículo"'),
  sectionHead('ask', 'Pregúntale al doctor', [
    text('fieldLabel', 'Etiqueta del campo'),
    text('placeholder', 'Ejemplo dentro del campo'),
    text('button', 'Texto del botón'),
    text('thanks', 'Mensaje al enviar'),
    text('webhookUrl', 'URL que recibe las preguntas (opcional)', 'Formspree, Make, Zapier… Si se deja vacío, solo se muestra el mensaje.'),
  ]),
]);

export const CATEGORIES = [
  { value: 'digestivo', label: 'Digestivo' },
  { value: 'peso', label: 'Peso' },
  { value: 'metabolico', label: 'Metabólico' },
  { value: 'sueno', label: 'Sueño' },
  { value: 'habitos', label: 'Hábitos' },
];

/* ───────────────────────────── Blog (entradas) ──────────────────────────── */
export const Post: Collection = {
  name: 'post',
  label: 'Blog · entradas',
  path: 'content/posts',
  format: 'md',
  ui: {
    router: ({ document }) => `/blog/${document._sys.filename}`,
    filename: {
      slugify: (values: Record<string, unknown>) =>
        String(values?.title || '')
          .toLowerCase()
          .normalize('NFD')
          .replace(/[̀-ͯ]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, ''),
    },
  },
  fields: [
    { type: 'string', name: 'title', label: 'Título corto (va en la portada de la tarjeta)', isTitle: true, required: true },
    text('hook', 'Gancho (título largo)'),
    longText('excerpt', 'Resumen'),
    { type: 'string', name: 'category', label: 'Categoría', options: CATEGORIES },
    { type: 'datetime', name: 'date', label: 'Fecha de publicación' },
    { type: 'image', name: 'audio', label: 'Audio del episodio (MP3)', description: 'Sube el MP3 a la biblioteca de medios.' },
    text('duration', 'Duración del audio', 'Ej.: 12:40'),
    {
      type: 'string',
      name: 'tone',
      label: 'Color de la tarjeta',
      options: [
        { value: 'navy', label: 'Azul marino' },
        { value: 'yellow', label: 'Amarillo' },
        { value: 'cream', label: 'Crema' },
        { value: 'gray', label: 'Gris claro' },
      ],
    },
    image('image', 'Imagen (opcional, reemplaza el color)'),
    { type: 'boolean', name: 'featured', label: 'Destacar en el blog' },
    { type: 'rich-text', name: 'body', label: 'Artículo', isBody: true },
  ],
};

/* ──────────────────────────────── Nutrium ───────────────────────────────── */
export const Nutrium = singlePage('nutrium', 'Guía de Nutrium', '/guia-nutrium', [
  sectionHead('hero', 'Portada', [text('appStoreUrl', 'Enlace App Store'), text('googlePlayUrl', 'Enlace Google Play')]),
  objectList('steps', 'Pasos', [
    text('title', 'Título del paso'),
    longText('text', 'Explicación'),
    text('screen', 'Título en la pantalla del teléfono'),
    stringList('rows', 'Filas en la pantalla'),
    text('action', 'Botón en la pantalla'),
  ]),
  objectList('faqs', 'Preguntas frecuentes', [text('question', 'Pregunta'), longText('answer', 'Respuesta')], 'question'),
  sectionHead('ctaBand', 'Franja final', [cta('primary', 'Botón principal'), cta('secondary', 'Botón secundario')]),
]);

/* ────────────────────────────── Cuestionario ────────────────────────────── */
export const Cuestionario = singlePage('cuestionario', 'Cuestionario "Evalúa tu caso"', '/evalua-tu-caso', [
  {
    type: 'object',
    name: 'intro',
    label: 'Tarjeta de inicio',
    fields: [
      text('eyebrow', 'Antetítulo'),
      longText('title', 'Título'),
      longText('body', 'Texto'),
      stringList('bullets', 'Avisos'),
      text('startLabel', 'Botón para empezar'),
    ],
  },
  objectList(
    'questions',
    'Preguntas (una por tarjeta)',
    [
      text('key', 'Código interno', 'Sin espacios. La primera pregunta debe ser "motivo"; también se usan "tiempo", "sintomas" e "intentos".'),
      text('title', 'Pregunta'),
      text('hint', 'Ayuda bajo la pregunta'),
      { type: 'boolean', name: 'multiple', label: 'Permite varias respuestas' },
      objectList(
        'options',
        'Opciones',
        [
          text('value', 'Código interno', 'Sin espacios. Debe coincidir con los resultados y mensajes.'),
          text('label', 'Texto'),
          text('sub', 'Detalle (opcional)'),
          { type: 'boolean', name: 'exclusive', label: 'Excluyente ("Ninguno", "Nada")' },
          { type: 'boolean', name: 'alarm', label: 'Señal de alarma (muestra aviso de urgencias)' },
        ],
        'label',
      ),
    ],
  ),
  {
    type: 'object',
    name: 'contact',
    label: 'Tarjeta de datos de contacto',
    fields: [
      text('eyebrow', 'Antetítulo'),
      text('title', 'Título'),
      longText('body', 'Texto'),
      longText('consent', 'Texto de autorización de datos'),
      text('submitLabel', 'Botón'),
      text('helper', 'Nota bajo el botón'),
      text('webhookUrl', 'URL que recibe las respuestas', 'Make, Zapier, Formspree o el CRM. Recibe nombre, contacto, respuestas y resultado.'),
    ],
  },
  objectList(
    'results',
    'Resultados (uno por motivo de consulta)',
    [
      text('motivo', 'Código del motivo', 'Debe coincidir con el código de una opción de la pregunta "motivo".'),
      text('title', 'Título (va después del nombre)'),
      longText('body', 'Texto'),
      text('guideName', 'Nombre de la guía PDF'),
      { type: 'image', name: 'guideFile', label: 'Archivo PDF de la guía' },
      text('planName', 'Plan sugerido'),
      text('planWhy', 'Por qué ese plan'),
      text('planHref', 'Enlace "ver detalles"'),
    ],
    'motivo',
  ),
  {
    type: 'object',
    name: 'longCase',
    label: 'Ajuste para casos de más de un año',
    description: 'Si la respuesta a "tiempo" es t3 o t4, se sugiere este plan (excepto bariátrico).',
    fields: [text('planName', 'Plan sugerido'), text('planWhy', 'Por qué ese plan')],
  },
  objectList(
    'insights',
    'Mensajes según respuestas',
    [
      text('question', 'Código de la pregunta'),
      text('value', 'Código de la opción'),
      longText('text', 'Mensaje'),
    ],
    'text',
  ),
  longText('fallbackInsight', 'Mensaje cuando no aplica ninguno'),
  {
    type: 'object',
    name: 'resultUi',
    label: 'Textos de la tarjeta de resultado',
    fields: [
      text('eyebrow', 'Antetítulo'),
      longText('alarm', 'Aviso de urgencias'),
      text('guideLabel', 'Etiqueta de la guía'),
      text('planLabel', 'Etiqueta del plan'),
      cta('primary', 'Botón principal'),
      text('detailsLabel', 'Texto del botón "ver detalles"'),
      text('restartLabel', 'Volver a empezar'),
      longText('disclaimer', 'Aviso legal'),
    ],
  },
]);

export const collections = [Global, Inicio, Servicios, Bariatrico, BlogPage, Post, Nutrium, Cuestionario];
