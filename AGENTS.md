# AGENTS.md

Documento canónico de convenciones para asistentes de IA y miembros del equipo. Cualquier LLM con acceso al filesystem (Claude Code, Claude Desktop con MCP, Cursor, Codex…) debe leer este fichero antes de generar o modificar presentaciones.

Para asistentes sin acceso al filesystem (Claude Web, ChatGPT, Gemini), usa el bundle pegable [`LLM-CONTEXT.md`](./LLM-CONTEXT.md).

---

## 1. Qué es este repositorio

Sistema de presentaciones HTML corporativas para **esPublico Gestiona** y **esFirma**. Cada presentación es un `index.html` autónomo que importa los assets compartidos del repo.

- HTML/CSS/JS puro. Sin build, sin frameworks, sin npm install.
- Roboto vía Google Fonts. Font Awesome 6.5.1 vía CDN.
- Webs comerciales: `espublicogestiona.com`, `esfirma.com`.

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

CSS base requerido (en el `<style>` inline del slide o en el template):

```css
.phase { opacity: 0; visibility: hidden; transition: opacity .4s ease, visibility 0s linear .4s; }
.phase.visible { opacity: 1; visibility: visible; transition: opacity .4s ease, visibility 0s linear 0s; }
```

`navigation.js` añade/quita la clase `.visible` en orden por `data-phase` antes de avanzar al siguiente slide.

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
    <title>Título — Gestiona</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="../assets/css/corporate.css">
</head>
<body>
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

---

## 5. Reglas para asistentes

Al modificar o crear presentaciones:

1. **No reinventar estilos** — si existe una clase en `corporate.css`, úsala. Solo añade CSS inline para casos específicos de esa presentación.
2. **No tocar `corporate.css`** salvo cuando el cambio aplique a todo el sistema (decisión del equipo).
3. **No introducir frameworks** ni librerías npm. Stack puro intencional.
4. **No usar f-strings ni concatenación** en JS para insertar HTML; el contenido es estático en HTML.
5. **Usar variables CSS**, no colores hardcoded.
6. **Mantener idioma**: contenido visible en español, identificadores en inglés.
7. **Accesibilidad**: cada `<section class="slide-container">` debe tener `aria-label`. Iconos decorativos llevan `aria-hidden="true"`.
8. **Slides 1280×720** — no cambiar dimensiones. Si el contenido no entra, redistribuir, no escalar.
9. **Material fuente** (PDF, pptx, docx) va en `_sources/<nombre>/`, fuera del repo (gitignored).

---

## 6. Material no canónico

- `desarrollo-medios/` — proyecto histórico que sirvió de inspiración visual. **No usar como referencia activa**. Está ignorado por git (`.gitignore`).
- `.claude/` — configuración local de Claude Code (personas senior/junior/security). Privada, ignorada por git.
- `_sources/` — material fuente local (PDFs, pptx). Ignorado por git.
