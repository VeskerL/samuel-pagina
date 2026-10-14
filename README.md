# Sitio web · Dr. Samuel Herrera

Sitio en **Astro 7** con **TinaCMS 3**. Cada página se puede editar sin tocar código, haciendo clic sobre el texto en la vista previa.

## Páginas

| Ruta | Contenido editable en Tina |
|---|---|
| `/` | Inicio |
| `/servicios` | Servicios y planes |
| `/programa-bariatrico` | Programa bariátrico |
| `/blog` y `/blog/<entrada>` | Blog · página principal y Blog · entradas |
| `/guia-nutrium` | Guía de Nutrium |
| `/evalua-tu-caso` | Cuestionario "Evalúa tu caso" |
| Menú y pie de todas las páginas | Ajustes generales |

El contenido vive en `content/` (JSON y Markdown). Las imágenes, los PDF y los audios van en `public/uploads/`, que es la biblioteca de medios de Tina.

## Trabajar en local

Requiere Node 22 o superior.

```bash
npm install
npm run dev
```

- Sitio: http://localhost:4321
- Editor: http://localhost:4321/admin

En local, Tina guarda los cambios directamente en los archivos de `content/`.

## Publicar con edición en línea (Tina Cloud)

Para que el doctor o el equipo editen el sitio ya publicado:

1. Sube este proyecto a un repositorio de GitHub.
2. En **app.tina.io**, crea un proyecto y conecta ese repositorio. Copia el **Client ID** y crea un **token** de solo lectura.
3. En el hosting (Vercel o Netlify), importa el repositorio y añade estas variables de entorno:
   - `PUBLIC_TINA_CLIENT_ID` = el Client ID
   - `TINA_TOKEN` = el token
   - `SITE_URL` = el dominio final, por ejemplo `https://samuelherreranutriologo.com`
4. Usa el comando de build `npm run build` y la carpeta de salida que el hosting detecte.
5. En Tina Cloud, invita como editores a las personas que van a cambiar contenido.

Cada vez que alguien guarda en `/admin`, Tina hace un commit en GitHub y el hosting vuelve a publicar el sitio.

El adaptador del servidor se elige solo: Vercel, Netlify o, si no hay ninguno, un servidor Node. Lo necesita una sola ruta, `/tina-island`, que usa el editor visual. Todas las demás páginas son HTML estático.

## Cuestionario y formularios

- Las preguntas, opciones, resultados, mensajes y guías PDF se editan en **Cuestionario "Evalúa tu caso"**.
- Cada opción tiene un **código interno**. La primera pregunta tiene que tener el código `motivo`. Cada resultado se asocia con el código de uno de los motivos.
- Si una opción tiene marcada la casilla **Señal de alarma**, el resultado muestra el aviso de urgencias.
- En el campo **URL que recibe las respuestas** puedes pegar un webhook de Make, Zapier, Formspree o el CRM. Ese webhook recibe en JSON:
  - nombre
  - WhatsApp
  - correo
  - respuestas
  - motivo
  - plan sugerido
  - señales de alarma
- El buzón **Pregúntale al doctor** del blog funciona igual, con su propio campo de URL.

## Pendientes de contenido

Los textos entre corchetes son datos que faltan:

- `[NÚMERO]` de WhatsApp
- `[HORARIO DE CHAT]`
- `[Duración]` de cada audio
- Número de controles de la ruta quirúrgica
- Texto de cada artículo del blog

También hay que reemplazar por los enlaces reales los `#` de agenda en Nutrium, App Store, Google Play y redes sociales.

## Posicionamiento (SEO)

Cada página tiene su propio título y descripción en el grupo **SEO**. Antes de cambiar el dominio, conviene configurar en el hosting redirecciones 301 desde las URL del WordPress actual hacia las nuevas, para no perder posicionamiento.
