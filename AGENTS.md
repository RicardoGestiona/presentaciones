# AGENTS.md

Documento canónico de convenciones para asistentes de IA y miembros del equipo. Cualquier LLM con acceso al filesystem (Claude Code, Claude Desktop con MCP, Cursor, Codex…) debe leer este fichero antes de generar o modificar presentaciones.

Para asistentes sin acceso al filesystem (Claude Web, ChatGPT, Gemini), usa el bundle pegable [`LLM-CONTEXT.md`](./LLM-CONTEXT.md).

---

## 1. Qué es este repositorio

Sistema de presentaciones HTML corporativas para el portfolio completo de **esPublico** (Gestiona, esFirma, Hacienda Local, RRHH, Videoactas, Tecnología, Sistemas, Drag, ecityclic, Medidata, etc.). Cada presentación es un `index.html` autónomo que importa los assets compartidos del repo.

- HTML/CSS/JS puro. Sin build, sin frameworks, sin npm install.
- Roboto vía Google Fonts. Font Awesome 6.5.1 vía CDN.
- Manual de estilo oficial: <https://design.g3stiona.com/recursos-nuevo-espublico/>.

---

## 1bis. Selección de marca — REGLA OBLIGATORIA

> **El usuario debe especificar la marca antes de generar la presentación. Si no lo hace, PREGUNTAR antes de generar nada.**

Cada producto del portfolio tiene su Pantone propio. La paleta se aplica añadiendo el atributo `data-brand`:

- **Nivel deck** (toda la presentación) → en `<body>`:
  ```html
  <body data-brand="hacienda-local">
  ```
- **Nivel slide** (un solo slide, p.ej. para co-marketing dentro de un deck de otra marca) → en el `<section class="slide-container">`:
  ```html
  <section class="slide-container" data-brand="esfirma" aria-label="Slide esFirma dentro de un deck Gestiona">…</section>
  ```

El selector CSS es `[data-brand="X"]`, no está acoplado al `<body>`. Las variables cascadan al elemento más cercano con `data-brand`.

Si el usuario no menciona marca en su prompt, la respuesta correcta es preguntar:

> ¿Qué marca? Productos disponibles: **espublico** (matriz, naranja), **gestiona** (azul petróleo), **gestiona-avanza** (cian), **esfirma** (dorado), **hacienda-local** (verde), **rrhh** (rojo), **videoactas** (azul oscuro), **tecnologia** (azul cielo), **sistemas** (azul marino), **drag** (azul profundo), **ecityclic** (verde lima), **medidata** (verde selva). ¿Cuál usamos?

**Nunca asumir Gestiona por defecto.** Es la paleta del `:root` solo por motivos históricos del sistema; no es una decisión de diseño implícita.

### Catálogo de marcas

| `data-brand` | Producto | Pantone | HEX primario | Notas |
|---|---|---|---|---|
| `espublico` | esPublico (matriz) | 144 C | `#ff9900` | Naranja corporativo. Alias: `corporativa`, `corporativa-ae`, `contratacion` |
| `gestiona` | Gestiona | 3145 C | `#006d85` | Azul petróleo. Alias: `factory` |
| `gestiona-avanza` | Gestiona Avanza | — | `#00b4d3` | Cian. Submarca de formación, comunidad y eventos de Gestiona. Sin Pantone: muestreado del logotipo oficial (sistema `img-gestiona-avanza`) |
| `esfirma` | esFirma | 618 C | `#aa9944` | Dorado |
| `hacienda-local` | Hacienda Local (HL) | 3252 C | `#00bb88` | Verde |
| `rrhh` | Recursos Humanos | 1925 C | `#ee0055` | Rojo |
| `videoactas` | Videoactas | 4153 C | `#034797` | Azul oscuro |
| `tecnologia` | Tecnología | 801 C | `#0099dd` | Azul cielo |
| `sistemas` | Sistemas | 301 C | `#0f4c81` | Azul marino |
| `drag` | Drag esPublico | 654 C | `#10406d` | Azul profundo |
| `ecityclic` | ecityclic esPublico | 376 | `#7fb927` | Verde lima |
| `medidata` | Medidata esPublico | 340 C | `#249265` | Verde selva |

Tipografías oficiales de todo el portfolio: **Roboto**, **Roboto Slab**, **Open Sans** (todas Google Fonts, libres).

Cada bloque de marca redefine `--color-primary`, `--color-primary-light`, `--color-primary-dark`, `--color-accent` y `--color-primary-soft`. Todos los componentes que usan estos tokens se reestilan automáticamente.

`--color-gold` (esFirma) y las variantes `--gold` siguen siendo independientes para permitir co-marketing en el mismo deck (p.ej. una presentación de Gestiona con una sección destacada de esFirma usando `.tile--gold`).

---

## 2. Convenciones del proyecto

### Idioma

- UI, contenido visible y comentarios → **español**.
- Nombres de clases CSS, variables JS, identificadores → **inglés**.

### Estructura física

```
presentaciones/
├── assets/css/corporate.css   ← Sistema de diseño (única fuente)
├── assets/js/navigation.js    ← Navegación teclado + fases
├── assets/img/                ← Logos compartidos
├── templates/                 ← Plantillas reutilizables
└── <nombre>/index.html        ← Cada presentación
```

### Reglas de import

Toda presentación nueva debe importar los assets compartidos vía `../assets/`:

```html
<link rel="stylesheet" href="../assets/css/corporate.css">
<script src="../assets/js/navigation.js"></script>
```

**Nunca** copiar `corporate.css` o `navigation.js` al subdirectorio de la presentación. Si necesitas estilos específicos, añádelos en un `<style>` inline dentro del propio `index.html`.

### Slide

Cada slide es un `<section class="slide-container">` de 1280×720 px. La transición horizontal entre slides la gestiona `navigation.js` mediante `translateX` sobre `<main role="presentation">`.

`navigation.js` inyecta automáticamente una **paginación visual** (bullets) centrada abajo: un `.slide-dot` (`<button>`) por slide dentro de `.stage`, con el dot activo expandido a pastilla en el color de marca. Es clicable — cada dot llama a `goToSlide()` para saltar directamente a esa diapositiva — y no requiere markup; se desactiva sola si solo hay un slide. Estilos en `corporate.css` (`.slide-dots` / `.slide-dot`).

```html
<main role="presentation">
    <section class="slide-container" aria-label="Descripción">
        <h2 class="slide-title">Título</h2>
        <div class="content-area">...</div>
    </section>
    <!-- más slides -->
</main>
```

### Revelación progresiva (.phase)

Para revelar elementos dentro de un slide al pulsar siguiente:

```html
<li class="phase" data-phase="1">Aparece tras el primer "siguiente"</li>
<li class="phase" data-phase="2">Aparece tras el segundo "siguiente"</li>
```

El CSS de `.phase` es **canónico y vive en `corporate.css`** — no lo redefinas inline. `navigation.js` añade/quita la clase `.visible` en orden por `data-phase` (los del mismo `N` aparecen a la vez) antes de avanzar al siguiente slide. Transiciones discretas; respeta `prefers-reduced-motion`.

Variantes de entrada (combínalas con `.phase`):

| Clase | Comportamiento | Uso típico |
|-------|----------------|------------|
| `.phase` | Desliza hacia arriba (vertical) | Enumeraciones, listas |
| `.phase--slide-left` | Entra desde la izquierda | Bloques de texto, tarjetas |
| `.phase--slide-right` | Entra desde la derecha | Bloques de texto, tarjetas |
| `.phase--fade` | Solo fundido, sin desplazamiento | Cuando el movimiento estorba |

```html
<!-- Enumeración vertical -->
<li class="phase" data-phase="1">…</li>

<!-- Dos bloques que entran a la vez desde lados opuestos -->
<div class="card phase phase--slide-left"  data-phase="1">…</div>
<div class="card phase phase--slide-right" data-phase="1">…</div>
```

---

## 3. Sistema de diseño

### Tokens (CSS custom properties)

Definidos en `assets/css/corporate.css`. Úsalos siempre, no hardcodees colores.

| Variable | Valor | Uso |
|---|---|---|
| `--color-primary` | `#006d85` | Acento principal Gestiona |
| `--color-primary-light` | `#00dfb2` | Highlights / hover |
| `--color-primary-dark` | `#004d5e` | Variante oscura |
| `--color-accent` | `#5fffdf` | Decoraciones sutiles |
| `--color-gold` | `#aa9944` | Marca esFirma |
| `--color-bg-dark` | `#003040` | Fondo oscuro / separadores |
| `--color-bg-light` | `#ecf0f3` | Fondo de tarjetas |
| `--color-text-dark` | `#003040` | Títulos |
| `--color-text-body` | `#1a3a44` | Texto principal |
| `--color-text-muted` | `#3d5c66` | Texto secundario |
| `--color-text-subtle` | `#5a7a84` | Texto terciario |
| `--font-family` | `'Roboto', sans-serif` | Tipografía única |
| `--radius-sm/md/lg` | `8 / 14 / 20 px` | Bordes redondeados |
| `--slide-width / --slide-height` | `1280 / 720 px` | Dimensiones slide |

### Layouts

| Clase | Uso |
|---|---|
| `.title-layout` | Portada y cierre (centrado vertical) |
| `.section-title-layout` | Separador de sección (fondo oscuro completo) |
| `.slide-title` | Título estándar con barra lateral (`.slide-title--gold` esFirma) |
| `.two-column` | Grid de 2 columnas con gap 48 px |
| `.tiled-content` | Grid 2×2 de tarjetas (`.tile`) |
| `.tile-triple` | Variante de 3 columnas |
| `.table-layout` | Tabla con cabecera oscura |
| `.bullet-list` | Lista con iconos Font Awesome (`.bullet-list--gold`) |
| `.feature-cards` | Flex de tarjetas con icono circular centrado |
| `.step-cards` | Pasos numerados sobre fondo oscuro (`.step-card--gold`) |

### Componentes

| Clase | Uso |
|---|---|
| `.card` / `.card--bordered` / `.card--bordered-gold` | Tarjetas con sombra |
| `.card--glass` / `.card--glass-gold` | Tarjetas translúcidas para fondos oscuros |
| `.icon-circle` / `.icon-circle--lg` / `.icon-circle--gold` | Icono circular con fondo |
| `.highlight-box` / `.highlight-box--gold` | Callout con borde lateral |
| `.badge-gestiona` / `.badge-esfirma` | Etiquetas de marca |
| `.team-bar` | Barra de equipo (icono + label + nombres) |
| `.bar-chart` con `.bar--low/--mid/--high` | Gráfico de barras simple |
| `.accent-line` / `.accent-line--gold` | Línea decorativa horizontal |
| `.image-wrapper` | Contenedor de imagen con border-radius y sombra |

### Variantes esFirma (dorado)

Para presentaciones bajo marca esFirma:

- Añadir `.esfirma-theme` al `<section class="slide-container">` → decoración de fondo dorada.
- Usar las variantes `--gold`: `.slide-title--gold`, `.section-title-layout--gold`, `.tile--gold`, `.card--bordered-gold`, `.feature-card--gold`, `.step-card--gold`, `.bullet-list--gold`, `.highlight-box--gold`, `.accent-line--gold`, `.icon-circle--gold`, `.card--glass-gold`.

### Utilidades

`.text-sm`, `.text-xs`, `.text-uppercase`, `.text-tight`, `.text-center`, `.text-primary`, `.text-gold`, `.text-white`, `.text-dark`, `.text-muted`, `.text-subtle`, `.text-accent`, `.mx-auto`, `.mt-sm/md/lg`, `.mb-sm/md`, `.gap-sm/md/lg`.

---

## 4. Cómo crear una presentación

### Paso a paso

1. Crear directorio: `mkdir nombre-presentacion`.
2. Copiar plantilla: `cp templates/slide-template.html nombre-presentacion/index.html`.
3. Editar contenido. Mantener imports a `../assets/`.
4. Añadir tarjeta en el `index.html` raíz para enlazar la nueva presentación.
5. Verificar con `npx serve . -l 8080` y navegar a `/nombre-presentacion/`.

### Esqueleto mínimo

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Título — <Marca></title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="../assets/css/corporate.css">
</head>
<body data-brand="<marca>">
<main role="presentation">

    <section class="slide-container" aria-label="Portada">
        <div class="title-layout">
            <h1>Título <span>destacado</span></h1>
            <p class="subtitle">Subtítulo</p>
        </div>
    </section>

    <!-- más slides -->

</main>
<script src="../assets/js/navigation.js"></script>
</body>
</html>
```

### Plantillas disponibles

- `templates/slide-template.html` — punto de partida con 8 slides ejemplo cubriendo los layouts más usados.
- `templates/showcase.html` — demo navegable con **todos** los layouts y componentes; útil como referencia visual y para que un LLM vea el HTML real de cada pieza.
- `templates/iv-congreso.html` y `templates/ecityday.html` — plantillas de estilo de evento. Ver §4bis.

---

## 4bis. Plantillas de estilo de evento

Algunos eventos tienen una línea gráfica propia que sustituye a la del sistema. Se implementan como una **capa CSS** que va encima de `corporate.css`, con clases propias y geometría fija calcada de la plantilla PowerPoint del evento: 1 in = 96 px y 1 pt = 1,333 px sobre el lienzo de 1280 × 720.

Cada diapositiva es `<section class="slide-container <prefijo> <prefijo>-<layout>">` y sus hijos se posicionan en absoluto. **No mezclar** clases de layout de `corporate.css` (`.title-layout`, `.tiled-content`…) dentro de estas diapositivas: usa solo las de la capa.

Para crear una presentación con el estilo de un evento:

1. `mkdir <nombre> && cp templates/<plantilla>.html <nombre>/index.html`.
2. Conserva el `<head>` (fuentes y las dos hojas de estilo) y el `data-brand` del `<body>`.
3. Duplica o borra las `<section>` de ejemplo y sustituye los textos. Cada `<section>` va precedida de un comentario con su uso.
4. Actualiza los números de página (`.ivc-num` / `.ecd-num`) y los `aria-label` numerados.
5. Si el contenido no cabe, divídelo en otra diapositiva: no reduzcas los tamaños de la capa.

| Plantilla | Evento | Capa CSS · prefijo | `data-brand` | Fuentes | Idioma | Assets | Origen (repo hermano) |
|---|---|---|---|---|---|---|---|
| `templates/iv-congreso.html` | IV Congreso Gestiona Avanza · Zaragoza, 4–6 nov 2026 | `assets/css/iv-congreso.css` · `.ivc-*` | `gestiona-avanza` | Roboto + Roboto Slab 700 | Castellano | `assets/img/iv-congreso/` | `html-congreso` (`npm run build:html`) |
| `templates/ecityday.html` | #ecityDay · inauguración de las oficinas de ecityclic · Parc Agrobiotech Lleida, 10 nov 2026 | `assets/css/ecityday.css` · `.ecd-*` | `ecityclic` | Inter 400/700 | Catalán | `assets/img/ecityday/` | `ppt-ecityday` (`tools/build_template.js`) |

Los repos hermanos (`../html-congreso`, `../ppt-ecityday`) son la fuente de la plantilla PPTX/POTX y de los scripts que reestilan los PPTX de los ponentes. Si la geometría cambia allí, hay que actualizar la capa CSS correspondiente.

### IV Congreso (`.ivc-*`)

- **Layouts:** `ivc-cover`, `ivc-speaker-slide`, `ivc-section`, `ivc-content`, `ivc-two-col`, `ivc-image-text`, `ivc-image-full`, `ivc-statement` y `ivc-closing`.
- **Componentes sobre lienzo:** `ivc-index`, `ivc-blocks`, `ivc-process`, `ivc-timeline`, `ivc-stats` y gráficos (`ivc-free` + `ivc-chart-card`).
- **Listas:** `ivc-list--numbered`, `ivc-list--checks`.
- **Elementos fijos:** lockup del congreso arriba a la derecha (`ivc-lockup`), aval Gestiona·esPublico abajo (`ivc-endorse`) y número de página (`ivc-num`).
- **Ponencias:** viven en `iv-congreso/<slug>/` y se **generan** con `html-congreso` (`npm run render <slug>`); no se editan a mano.

### #ecityDay (`.ecd-*`)

Paleta del manual del evento, con tokens en `.ecd`:

| Token | Color | Uso |
|---|---|---|
| `--ecd-green` | `#81bc00` | Acentos (no `#7fb927`) |
| `--ecd-dark` | `#2f3031` | Texto y fondos oscuros |
| `--ecd-grey` | `#6a686f` | Texto secundario |
| `--ecd-offwhite` | `#f4f3f1` | Fondos claros y tarjetas |
| `--ecd-orange`, `--ecd-petrol`, `--ecd-olive` | — | Tres colores del degradado del patrón (series de gráficos) |

**Layouts:**

| Clase | Contenido |
|---|---|
| `ecd-cover` | Portada clara: logo, `#ecityDay` y patrón de líneas abajo |
| `ecd-dark` | Portada alternativa o frase destacada |
| `ecd-speaker` | Ponente: `ecd-speaker-photo`, que es un `<img>` cuadrado o un `<div>` vacío, y `ecd-speaker-info` |
| `ecd-content` | Antetítulo `ecd-kicker` + `ecd-title` + `ecd-body` |
| `ecd-two-col` | `ecd-col-heading--left/right` + `ecd-col--left/right` |
| `ecd-image-text` | Imagen a sangre a la izquierda dentro de `ecd-panel`; sin imagen se ve el patrón |
| `ecd-closing` | Cierre |

**Componentes**, sobre `ecd-board` bajo el título:

- `ecd-index`: tarjetas `ecd-card` con `ecd-card-num`.
- `ecd-lists`: tarjetas `ecd-list-card` con `ul`, `ecd-list--numbered` o `ecd-list--checks`.
- `ecd-blocks`: `ecd-icon` con un SVG Lucide de trazo blanco.
- `ecd-process`: `ecd-step`; el último paso va en verde. Para cambiar el número de pasos, `style="--ecd-steps:N"`.
- `ecd-timeline`: `ecd-milestone`, con las fechas alternadas arriba y abajo; el hito próximo lleva `ecd-milestone--pending`. Para cambiar el número de hitos, `--ecd-milestones:N`.
- `ecd-charts`: SVG estático dentro de `ecd-chart-card` (`--wide` para el de columnas), con leyenda `ecd-legend`.
- `ecd-stats`: `ecd-stat` con `ecd-stat-value` y `ecd-stat-label`.

**Pie fijo** de las diapositivas de contenido: `ecd-foot-logo`, `ecd-foot-hashtag` y `ecd-num`. Portada, fondo oscuro y cierre llevan en su lugar `ecd-logo` (`logo.svg`, o `logo-white.svg` sobre fondo oscuro) y `ecd-hashtag`.

---

## 5. Reglas para asistentes

Al modificar o crear presentaciones:

1. **Marca obligatoria** — si el usuario no la especifica, **preguntar** antes de generar. Nunca asumir Gestiona ni cualquier otra por defecto. Aplicarla con `<body data-brand="<marca>">`. Lista en §1bis.
2. **No reinventar estilos** — si existe una clase en `corporate.css`, úsala. Solo añade CSS inline para casos específicos de esa presentación.
3. **No tocar `corporate.css`** salvo cuando el cambio aplique a todo el sistema (decisión del equipo).
4. **No introducir frameworks** ni librerías npm. Stack puro intencional.
5. **No usar f-strings ni concatenación** en JS para insertar HTML; el contenido es estático en HTML.
6. **Usar variables CSS**, no colores hardcoded.
7. **Mantener idioma**: contenido visible en español, identificadores en inglés.
8. **Accesibilidad**: cada `<section class="slide-container">` debe tener `aria-label`. Iconos decorativos llevan `aria-hidden="true"`.
9. **Slides 1280×720** — no cambiar dimensiones. Si el contenido no entra, redistribuir, no escalar.
10. **Material fuente** (PDF, pptx, docx) va en `_sources/<nombre>/`, fuera del repo (gitignored).

---

## 6. Material no canónico

- `desarrollo-medios/` — proyecto histórico que sirvió de inspiración visual. **No usar como referencia activa**. Está ignorado por git (`.gitignore`).
- `.claude/` — solo trackeamos las personas (`senior.md`, `junior.md`, `security.md`). El resto (estado, `settings.local.json`) es privado y queda ignorado.
- `_sources/` — material fuente local (PDFs, pptx). Ignorado por git.
