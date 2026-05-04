# LLM-CONTEXT — Bundle pegable

Este fichero contiene **todo el contexto necesario** para que un LLM sin acceso al filesystem (Claude Web, ChatGPT, Gemini, Copilot Chat) genere presentaciones HTML que cumplan el sistema de diseño de **esPublico Gestiona / esFirma**.

**Cómo usarlo:** copia este fichero entero. Pégalo como primer mensaje en una conversación con el LLM. Después pide la presentación que quieras. El asistente debe devolver un `index.html` completo y listo para guardar como `<nombre>/index.html` dentro del repo `presentaciones/`.

---

## 0. REGLA DE MARCA — ANTES DE GENERAR

> Si el usuario **no especifica marca** en su petición, **PREGUNTAR ANTES DE GENERAR**. No asumir nunca una marca por defecto. La marca define la paleta corporativa de toda la presentación.

Pregunta sugerida cuando falte la marca:

> ¿Qué marca? Productos disponibles: **espublico** (matriz, naranja), **gestiona** (azul petróleo), **esfirma** (dorado), **hacienda-local** (verde), **rrhh** (rojo), **videoactas** (azul oscuro), **tecnologia** (azul cielo), **sistemas** (azul marino), **drag** (azul profundo), **ecityclic** (verde lima), **medidata** (verde selva). ¿Cuál usamos?

La marca se aplica con un atributo `data-brand` en `<body>` (todo el deck) o en un `<section class="slide-container">` (solo ese slide, útil para co-marketing):

```html
<body data-brand="hacienda-local">
<!-- ... -->
<section class="slide-container" data-brand="esfirma" aria-label="Slide esFirma">…</section>
```

### Catálogo de marcas (Pantone oficial — <https://design.g3stiona.com/recursos-nuevo-espublico/>)

| `data-brand` | Producto | Pantone | HEX |
|---|---|---|---|
| `espublico` | esPublico (matriz). Alias: `corporativa`, `corporativa-ae`, `contratacion` | 144 C | `#ff9900` |
| `gestiona` | Gestiona. Alias: `factory` | 3145 C | `#006d85` |
| `esfirma` | esFirma | 618 C | `#aa9944` |
| `hacienda-local` | Hacienda Local | 3252 C | `#00bb88` |
| `rrhh` | Recursos Humanos | 1925 C | `#ee0055` |
| `videoactas` | Videoactas | 4153 C | `#034797` |
| `tecnologia` | Tecnología | 801 C | `#0099dd` |
| `sistemas` | Sistemas | 301 C | `#0f4c81` |
| `drag` | Drag esPublico | 654 C | `#10406d` |
| `ecityclic` | ecityclic | 376 | `#7fb927` |
| `medidata` | Medidata | 340 C | `#249265` |

`corporate.css` redefine los tokens (`--color-primary`, `--color-primary-light`, `--color-primary-dark`, `--color-accent`, `--color-primary-soft`) según el `data-brand`. Todos los componentes se reestilan automáticamente.

`--color-gold` (esFirma) sigue independiente: las variantes `--gold` (`.tile--gold`, `.card--bordered-gold`, etc.) permiten co-marketing dentro de un deck de cualquier otra marca.

---

## 1. Reglas de oro

1. **Marca obligatoria** — preguntar si el usuario no la especifica (ver §0). Aplicarla con `<body data-brand="<marca>">`.
2. Salida = un único `index.html` autónomo. Nada de build, npm, frameworks.
3. Importar siempre estos assets compartidos (rutas relativas a `../assets/`):
   ```html
   <link rel="stylesheet" href="../assets/css/corporate.css">
   <script src="../assets/js/navigation.js"></script>
   ```
4. Nunca redefinir clases que ya existen en `corporate.css`. Reutilizar.
5. Estilos específicos de la presentación → `<style>` inline en el propio `index.html`.
6. UI y comentarios en **español**. Identificadores en inglés.
7. Cada slide = `<section class="slide-container" aria-label="…">` (1280×720 px). Iconos decorativos con `aria-hidden="true"`.
8. Variantes `--gold` (esFirma) son cross-brand: cualquier deck puede usar `.tile--gold`, `.card--bordered-gold`, `.highlight-box--gold`, etc. para destacar contenido de esFirma.

---

## 2. Tokens (CSS variables ya disponibles vía corporate.css)

Úsalos siempre, no hardcodees colores:

```
--color-primary       #006d85   (acento Gestiona)
--color-primary-light #00dfb2   (highlights)
--color-primary-dark  #004d5e
--color-accent        #5fffdf
--color-gold          #aa9944   (esFirma)
--color-bg-dark       #003040   (fondos oscuros / separadores)
--color-bg-light      #ecf0f3   (fondos de tarjetas)
--color-text-dark     #003040
--color-text-body     #1a3a44
--color-text-muted    #3d5c66
--color-text-subtle   #5a7a84
--font-family         'Roboto', sans-serif
--radius-sm/md/lg     8 / 14 / 20 px
--slide-width         1280px
--slide-height        720px
```

---

## 3. Esqueleto base de una presentación

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
    <style>
        /* Estilos específicos de ESTA presentación, si hace falta */
        .phase { opacity: 0; visibility: hidden; transition: opacity .4s ease, visibility 0s linear .4s; }
        .phase.visible { opacity: 1; visibility: visible; transition: opacity .4s ease, visibility 0s linear 0s; }
    </style>
</head>
<body data-brand="<marca>">
<main role="presentation">

    <!-- slides aquí -->

</main>
<script src="../assets/js/navigation.js"></script>
</body>
</html>
```

`navigation.js` gestiona: flechas/Espacio/PageDown = siguiente, ←/↑/PageUp = anterior, Home/End = primer/último, revelación de elementos `.phase[data-phase="N"]` antes de avanzar.

---

## 4. Layouts — HTML mínimo de cada uno

### 4.1 Portada / cierre

```html
<section class="slide-container" aria-label="Portada">
    <div class="title-layout">
        <h1>Título <span>destacado</span></h1>
        <p class="subtitle">Subtítulo descriptivo</p>
    </div>
</section>
```

`<span>` dentro de `<h1>` se pinta en `--color-primary`. Con `.text-gold` se pinta dorado.

### 4.2 Separador de sección (fondo oscuro)

```html
<section class="slide-container" aria-label="Sección X">
    <div class="section-title-layout">
        <h2>Nombre de la sección</h2>
        <hr aria-hidden="true">
        <p class="subtitle">Breve descripción de qué aborda</p>
    </div>
</section>
```

Variante esFirma: `<div class="section-title-layout section-title-layout--gold">`.

### 4.3 Slide con título + contenido

```html
<section class="slide-container" aria-label="Contenido genérico">
    <h2 class="slide-title">Título del slide</h2>
    <div class="content-area">
        <!-- cualquier layout interno -->
    </div>
</section>
```

`.slide-title--gold` para variante esFirma.

### 4.4 Tiles (grid 2×2 o 3 columnas)

```html
<div class="tiled-content">
    <article class="tile">
        <div class="icon" aria-hidden="true"><i class="fa-solid fa-lightbulb"></i></div>
        <h3>Punto uno</h3>
        <p>Descripción concisa.</p>
    </article>
    <article class="tile">…</article>
    <article class="tile">…</article>
    <article class="tile">…</article>
</div>
```

Para 3 columnas: `<div class="tiled-content tile-triple">`. Variante esFirma: `<article class="tile tile--gold">`.

### 4.5 Dos columnas

```html
<div class="two-column">
    <div>
        <ul class="bullet-list">
            <li><i class="fa-solid fa-check" aria-hidden="true"></i> Punto uno</li>
            <li><i class="fa-solid fa-check" aria-hidden="true"></i> Punto dos</li>
        </ul>
    </div>
    <div class="card card--bordered">
        <h3>Dato destacado</h3>
        <p>Información complementaria.</p>
    </div>
</div>
```

### 4.6 Feature cards (icono circular centrado)

```html
<div class="feature-cards">
    <div class="feature-card">
        <div class="icon-circle icon-circle--lg mx-auto">
            <i class="fa-solid fa-rocket" aria-hidden="true"></i>
        </div>
        <h3>Innovación</h3>
        <p>Descripción del primer objetivo.</p>
    </div>
    <div class="feature-card">…</div>
</div>
```

Variante esFirma: `<div class="feature-card feature-card--gold">` y `<div class="icon-circle icon-circle--lg icon-circle--gold mx-auto">`.

### 4.7 Step cards (pasos numerados, fondo oscuro)

Suele ir dentro de `.section-title-layout`:

```html
<section class="slide-container" aria-label="Pasos">
    <div class="section-title-layout">
        <h2>Cómo funciona</h2>
        <hr aria-hidden="true">
        <div class="step-cards mt-lg">
            <div class="step-card">
                <div class="step-number">1</div>
                <p>Recogida de datos</p>
            </div>
            <div class="step-card">
                <div class="step-number">2</div>
                <p>Procesado y validación</p>
            </div>
            <div class="step-card">
                <div class="step-number">3</div>
                <p>Notificación al ciudadano</p>
            </div>
        </div>
    </div>
</section>
```

### 4.8 Glass cards (sobre fondo oscuro)

```html
<div class="mt-lg" style="display: flex; gap: 32px;">
    <div class="card--glass">
        <h3><i class="fa-solid fa-server" aria-hidden="true" style="margin-right: 8px;"></i>Infraestructura</h3>
        <p>Plataforma robusta y escalable.</p>
    </div>
    <div class="card--glass">…</div>
</div>
```

### 4.9 Tabla

```html
<div class="table-layout">
    <table>
        <thead>
            <tr><th>Concepto</th><th>2024</th><th>2025</th></tr>
        </thead>
        <tbody>
            <tr><td>Expedientes</td><td>120 000</td><td>148 000</td></tr>
            <tr><td>Usuarios activos</td><td>3 200</td><td>4 100</td></tr>
        </tbody>
    </table>
</div>
```

### 4.10 Highlight box (callout)

```html
<div class="highlight-box">
    <p><strong>Dato clave:</strong> el sistema procesa más de 1M de registros al año.</p>
</div>
```

Variante esFirma: `.highlight-box--gold`.

### 4.11 Bar chart (gráfico simple)

```html
<div class="bar-chart">
    <div class="bar bar--low">2023</div>
    <div class="bar bar--mid">2024</div>
    <div class="bar bar--high">2025</div>
</div>
<p class="bar-caption">Evolución anual de expedientes tramitados</p>
```

### 4.12 Team bar (firma de equipo)

```html
<div class="team-bar">
    <i class="fa-solid fa-people-group team-icon" aria-hidden="true"></i>
    <p class="team-label">Equipo</p>
    <p class="team-names">Ricardo Peñalver · María López · Juan García</p>
</div>
```

### 4.13 Imagen

```html
<div class="image-wrapper">
    <img src="./mi-imagen.jpg" alt="Descripción accesible">
</div>
```

### 4.14 Badges

```html
<span class="badge badge-gestiona">Gestiona</span>
<span class="badge badge-esfirma">esFirma</span>
```

### 4.15 Revelación progresiva (fases)

Marcar elementos con `class="phase" data-phase="N"`. `navigation.js` los muestra uno a uno antes de avanzar al siguiente slide.

```html
<ul class="bullet-list">
    <li class="phase" data-phase="1"><i class="fa-solid fa-check"></i> Aparece tras el primer "siguiente"</li>
    <li class="phase" data-phase="2"><i class="fa-solid fa-check"></i> Aparece tras el segundo "siguiente"</li>
    <li class="phase" data-phase="3"><i class="fa-solid fa-check"></i> Aparece tras el tercer "siguiente"</li>
</ul>
```

CSS base obligatorio (incluido ya en el esqueleto base, sección 3).

---

## 5. Variantes esFirma (dorado)

Para una presentación bajo marca **esFirma**:

1. Añadir `.esfirma-theme` al `<section class="slide-container">` cuando quieras decoración de fondo dorada.
2. Usar las variantes `--gold` correspondientes: `.slide-title--gold`, `.section-title-layout--gold`, `.tile--gold`, `.card--bordered-gold`, `.card--glass-gold`, `.feature-card--gold`, `.step-card--gold`, `.bullet-list--gold`, `.highlight-box--gold`, `.accent-line--gold`, `.icon-circle--gold`.

---

## 6. Utilidades disponibles

Espaciado: `.mt-sm/md/lg` (16/28/44 px arriba), `.mb-sm/md`, `.gap-sm/md/lg`, `.mx-auto`.
Texto: `.text-sm/xs`, `.text-uppercase`, `.text-tight`, `.text-center`, `.text-primary/gold/white/dark/muted/subtle/accent`.

---

## 7. Iconos

Font Awesome 6.5.1 — usa `<i class="fa-solid fa-NOMBRE" aria-hidden="true"></i>`. Iconos decorativos siempre con `aria-hidden="true"`. Nombres comunes: `fa-rocket`, `fa-shield-halved`, `fa-users`, `fa-chart-line`, `fa-lightbulb`, `fa-globe`, `fa-server`, `fa-lock`, `fa-puzzle-piece`, `fa-check`, `fa-graduation-cap`, `fa-landmark`, `fa-code-branch`, `fa-people-group`.

---

## 8. Plantilla solicitud típica

Cuando el usuario pida una presentación, devuelve un único bloque de código `html` con el `index.html` completo. Estructura recomendada de slides:

1. Portada (`title-layout`)
2. Separador o slide de objetivos (`section-title-layout` o `feature-cards`)
3. 3-6 slides de contenido (`slide-title` + layout interno)
4. Slide de cierre (`title-layout` con "Gracias" o CTA)

No añadas explicaciones fuera del bloque de código a menos que se pidan. El usuario guardará el HTML como `<nombre>/index.html` y lo abrirá con `npx serve .`.

---

## 9. Qué NO hacer

- No crear tu propio CSS desde cero. Reusar `corporate.css`.
- No usar `<div>` genéricos cuando hay una clase semántica (`.tile`, `.card`, `.feature-card`).
- No insertar imágenes externas con URL. Si el usuario no aporta imagen, deja un placeholder o describe el espacio reservado.
- No cambiar la dimensión 1280×720.
- No introducir Tailwind, Bootstrap u otros frameworks.
- No añadir `console.log` ni código JS más allá de lo necesario para fases (que ya hace `navigation.js`).
- No traducir contenido a inglés.
