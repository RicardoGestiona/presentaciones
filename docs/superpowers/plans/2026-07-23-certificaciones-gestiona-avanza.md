# Certificaciones Gestiona Avanza — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `certificaciones-gestiona-avanza/index.html`, a 6-slide HTML presentation summarizing esPublico's certification/knowledge-transfer strategy and the 3 Gestiona Avanza certifications, and link it from the repo's root `index.html`.

**Architecture:** Single self-contained `index.html` following this repo's no-build HTML/CSS/JS presentation system. Imports shared `../assets/css/corporate.css` and `../assets/js/navigation.js`. No new CSS classes needed — the deck uses only existing design-system layouts (`title-layout`, `tile-triple`/`feature-cards`, `two-column`, `bullet-list`).

**Tech Stack:** Plain HTML5, corporate.css design system, Font Awesome 6.5.1 (CDN), Roboto (Google Fonts). No JS beyond the shared `navigation.js`.

## Global Constraints

- `data-brand="gestiona-avanza"` on `<body>` — never default to `gestiona`. (spec §Marca)
- Import shared assets via `../assets/css/corporate.css` and `../assets/js/navigation.js`; never copy them into the presentation directory. (AGENTS.md §2)
- Content language: Spanish. Class names/identifiers: English (none custom needed here). (AGENTS.md §2)
- No operational details (convocatoria dates, entry requirements, teaching staff, pricing) — spec is strategy + certification essence only. (spec §Fuera de alcance)
- No closing/CTA slide — deck ends on slide 6 (Analiza). (spec §Fuera de alcance)
- Exactly 6 slides, in this order: portada, cómo funciona el modelo, valor para la entidad, Administración avanzada de Gestiona, Gestiona for Developers, Analiza. (spec §Estructura)

---

## Task 1: Scaffold the presentation file and portada slide

**Files:**
- Create: `certificaciones-gestiona-avanza/index.html`

**Interfaces:**
- Produces: a valid HTML5 document with `<body data-brand="gestiona-avanza">`, `<main role="presentation">` containing one `<section class="slide-container">` (portada). Later tasks append sibling `<section class="slide-container">` elements inside the same `<main>`, before the closing `</main>` tag.

- [ ] **Step 1: Create the directory and base file**

Run:
```bash
mkdir -p certificaciones-gestiona-avanza
```

- [ ] **Step 2: Write the file with head + portada slide**

Write `certificaciones-gestiona-avanza/index.html`:

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Certificaciones Gestiona Avanza</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="../assets/css/corporate.css">
</head>
<body data-brand="gestiona-avanza">
<main role="presentation">

    <!-- 1. PORTADA -->
    <section class="slide-container" aria-label="Portada">
        <div class="title-layout">
            <h1>Certificaciones <span>Gestiona Avanza</span></h1>
            <p class="subtitle">Estrategia de capacitación y transferencia de conocimiento a clientes</p>
        </div>
    </section>

</main>
<script src="../assets/js/navigation.js"></script>
</body>
</html>
```

- [ ] **Step 3: Verify it renders**

Run:
```bash
npx serve . -l 8080 &
sleep 1
curl -s http://localhost:8080/certificaciones-gestiona-avanza/ | grep -c 'slide-container'
kill %1
```
Expected: `1` (one slide-container found so far).

- [ ] **Step 4: Commit**

```bash
git add certificaciones-gestiona-avanza/index.html
git commit -m "feat(certificaciones-gestiona-avanza): scaffold deck with portada slide"
```

---

## Task 2: Slide 2 — Cómo funciona el modelo

**Files:**
- Modify: `certificaciones-gestiona-avanza/index.html` — insert new `<section>` immediately after the portada `</section>` and before `</main>`.

**Interfaces:**
- Consumes: existing `</section>\n\n</main>` closing sequence from Task 1 as the insertion anchor.
- Produces: second `<section class="slide-container">` sibling, using `.tile-triple` with 4 `.tile` articles (a 4-item grid via `.tile-triple` wraps to 2 rows of 2, consistent with the design system's `.tiled-content` 2×2 pattern — used here since `.tile-triple` is a 3-col variant and content-area handles wrapping).

- [ ] **Step 1: Insert the slide**

Edit `certificaciones-gestiona-avanza/index.html`, replacing:
```html
    </section>

</main>
```
with:
```html
    </section>

    <!-- 2. CÓMO FUNCIONA EL MODELO -->
    <section class="slide-container" aria-label="Cómo funciona el modelo de certificación">
        <h2 class="slide-title">Cómo funciona el modelo</h2>
        <div class="content-area">
            <div class="tiled-content">
                <article class="tile">
                    <div class="icon" aria-hidden="true"><i class="fa-solid fa-route"></i></div>
                    <h3>Itinerarios por perfil</h3>
                    <p>Cada certificación se dirige a un perfil distinto: administrador de la plataforma, developer o analista de datos.</p>
                </article>
                <article class="tile">
                    <div class="icon" aria-hidden="true"><i class="fa-solid fa-laptop-code"></i></div>
                    <h3>Aprendizaje aplicado</h3>
                    <p>Entorno demo de la plataforma, proyecto final y tutor personal desde el primer día.</p>
                </article>
                <article class="tile">
                    <div class="icon" aria-hidden="true"><i class="fa-solid fa-award"></i></div>
                    <h3>Acreditación oficial</h3>
                    <p>Evaluación teórico-práctica ante tribunal examinador y certificación oficial de esPublico.</p>
                </article>
                <article class="tile">
                    <div class="icon" aria-hidden="true"><i class="fa-solid fa-calendar-check"></i></div>
                    <h3>Modalidad híbrida sostenida</h3>
                    <p>Formación semipresencial (telemática + presencial) con carga lectiva estructurada por calendario.</p>
                </article>
            </div>
        </div>
    </section>

</main>
```

- [ ] **Step 2: Verify it renders**

Run:
```bash
npx serve . -l 8080 &
sleep 1
curl -s http://localhost:8080/certificaciones-gestiona-avanza/ | grep -c 'slide-container'
kill %1
```
Expected: `2`.

- [ ] **Step 3: Commit**

```bash
git add certificaciones-gestiona-avanza/index.html
git commit -m "feat(certificaciones-gestiona-avanza): add mechanism slide"
```

---

## Task 3: Slide 3 — Valor para la entidad

**Files:**
- Modify: `certificaciones-gestiona-avanza/index.html` — insert new `<section>` after slide 2's `</section>`, before `</main>`.

**Interfaces:**
- Consumes: `</section>\n\n</main>` anchor left by Task 2.
- Produces: third `<section class="slide-container">` sibling using `.two-column` with a `.bullet-list` (left) and a highlighted `.card card--bordered` (right) for the standout "comunidad" point — matches the two-column pattern already used elsewhere in this design system (`templates/slide-template.html` slide 4).

- [ ] **Step 1: Insert the slide**

Edit `certificaciones-gestiona-avanza/index.html`, replacing the (now unique) trailing:
```html
    </section>

</main>
```
with:
```html
    </section>

    <!-- 3. VALOR PARA LA ENTIDAD -->
    <section class="slide-container" aria-label="Valor para la entidad">
        <h2 class="slide-title">Valor para la entidad</h2>
        <div class="content-area">
            <div class="two-column">
                <div>
                    <ul class="bullet-list">
                        <li><i class="fa-solid fa-check" aria-hidden="true"></i> <strong>Autonomía real</strong>: la entidad configura y explota Gestiona sin depender de terceros.</li>
                        <li><i class="fa-solid fa-check" aria-hidden="true"></i> <strong>Reducción de riesgo</strong>: administración cualificada de una plataforma crítica y transversal.</li>
                        <li><i class="fa-solid fa-check" aria-hidden="true"></i> <strong>Máximo aprovechamiento de la inversión</strong>: visión 360º de las capacidades de la plataforma.</li>
                    </ul>
                </div>
                <div class="card card--bordered">
                    <h3>Comunidad de referencia entre entidades</h3>
                    <p>Al certificarse, el personal se integra en "Gestiona Avanza": acceso a novedades, proyectos piloto y red de contactos con otras administraciones certificadas.</p>
                </div>
            </div>
        </div>
    </section>

</main>
```

- [ ] **Step 2: Verify it renders**

Run:
```bash
npx serve . -l 8080 &
sleep 1
curl -s http://localhost:8080/certificaciones-gestiona-avanza/ | grep -c 'slide-container'
kill %1
```
Expected: `3`.

- [ ] **Step 3: Commit**

```bash
git add certificaciones-gestiona-avanza/index.html
git commit -m "feat(certificaciones-gestiona-avanza): add entity value slide"
```

---

## Task 4: Slide 4 — Certificación Administración avanzada de Gestiona

**Files:**
- Modify: `certificaciones-gestiona-avanza/index.html` — insert new `<section>` after slide 3's `</section>`, before `</main>`.

**Interfaces:**
- Consumes: `</section>\n\n</main>` anchor left by Task 3.
- Produces: fourth `<section class="slide-container">` sibling using `.feature-cards` (2 cards: "A quién va dirigida" / "Objetivo esencial") — same pattern reused identically in Tasks 5 and 6 for the other two certifications, only text differs.

- [ ] **Step 1: Insert the slide**

Edit `certificaciones-gestiona-avanza/index.html`, replacing the trailing:
```html
    </section>

</main>
```
with:
```html
    </section>

    <!-- 4. CERTIFICACIÓN: ADMINISTRACIÓN AVANZADA DE GESTIONA -->
    <section class="slide-container" aria-label="Certificación Administración avanzada de Gestiona">
        <h2 class="slide-title">Administración avanzada de Gestiona</h2>
        <div class="content-area" style="align-items: center;">
            <div class="feature-cards">
                <div class="feature-card">
                    <div class="icon-circle icon-circle--lg mx-auto">
                        <i class="fa-solid fa-users-gear" aria-hidden="true"></i>
                    </div>
                    <h3>A quién va dirigida</h3>
                    <p>Personal administrativo, perfiles de gestión y dirección, informáticos, técnicos de gestión documental y archivo, responsables de simplificación administrativa.</p>
                </div>
                <div class="feature-card">
                    <div class="icon-circle icon-circle--lg mx-auto">
                        <i class="fa-solid fa-compass" aria-hidden="true"></i>
                    </div>
                    <h3>Objetivo esencial</h3>
                    <p>Dominio integral (360º) de la plataforma: configuración, usuarios, gestión documental y archivo, tramitación de expedientes, gestión económica, analítica de datos y metodologías ágiles de diseño de servicios digitales.</p>
                </div>
            </div>
        </div>
    </section>

</main>
```

- [ ] **Step 2: Verify it renders**

Run:
```bash
npx serve . -l 8080 &
sleep 1
curl -s http://localhost:8080/certificaciones-gestiona-avanza/ | grep -c 'slide-container'
kill %1
```
Expected: `4`.

- [ ] **Step 3: Commit**

```bash
git add certificaciones-gestiona-avanza/index.html
git commit -m "feat(certificaciones-gestiona-avanza): add Administración avanzada slide"
```

---

## Task 5: Slide 5 — Certificación Gestiona for Developers

**Files:**
- Modify: `certificaciones-gestiona-avanza/index.html` — insert new `<section>` after slide 4's `</section>`, before `</main>`.

**Interfaces:**
- Consumes: `</section>\n\n</main>` anchor left by Task 4.
- Produces: fifth `<section class="slide-container">` sibling, same `.feature-cards` pattern as Task 4.

- [ ] **Step 1: Insert the slide**

Edit `certificaciones-gestiona-avanza/index.html`, replacing the trailing:
```html
    </section>

</main>
```
with:
```html
    </section>

    <!-- 5. CERTIFICACIÓN: GESTIONA FOR DEVELOPERS -->
    <section class="slide-container" aria-label="Certificación Gestiona for Developers">
        <h2 class="slide-title">Gestiona for Developers</h2>
        <div class="content-area" style="align-items: center;">
            <div class="feature-cards">
                <div class="feature-card">
                    <div class="icon-circle icon-circle--lg mx-auto">
                        <i class="fa-solid fa-code" aria-hidden="true"></i>
                    </div>
                    <h3>A quién va dirigida</h3>
                    <p>Perfiles técnicos, informáticos y responsables de sistemas, incluidos proveedores de desarrollo con contrato Gestiona.</p>
                </div>
                <div class="feature-card">
                    <div class="icon-circle icon-circle--lg mx-auto">
                        <i class="fa-solid fa-plug" aria-hidden="true"></i>
                    </div>
                    <h3>Objetivo esencial</h3>
                    <p>Integración de sistemas con las herramientas low-code de Gestiona: programación con Gestiona Code, API de Gestiona y automatización de procesos con n8n.</p>
                </div>
            </div>
        </div>
    </section>

</main>
```

- [ ] **Step 2: Verify it renders**

Run:
```bash
npx serve . -l 8080 &
sleep 1
curl -s http://localhost:8080/certificaciones-gestiona-avanza/ | grep -c 'slide-container'
kill %1
```
Expected: `5`.

- [ ] **Step 3: Commit**

```bash
git add certificaciones-gestiona-avanza/index.html
git commit -m "feat(certificaciones-gestiona-avanza): add Gestiona for Developers slide"
```

---

## Task 6: Slide 6 — Certificación Analiza, then full navigation/accessibility verification

**Files:**
- Modify: `certificaciones-gestiona-avanza/index.html` — insert final `<section>` after slide 5's `</section>`, before `</main>`.

**Interfaces:**
- Consumes: `</section>\n\n</main>` anchor left by Task 5.
- Produces: sixth and final `<section class="slide-container">` sibling, same `.feature-cards` pattern. This closes the `<main>` for the deck — no further sections are added by later tasks.

- [ ] **Step 1: Insert the slide**

Edit `certificaciones-gestiona-avanza/index.html`, replacing the trailing:
```html
    </section>

</main>
```
with:
```html
    </section>

    <!-- 6. CERTIFICACIÓN: ANALIZA -->
    <section class="slide-container" aria-label="Certificación Analiza">
        <h2 class="slide-title">Analiza</h2>
        <div class="content-area" style="align-items: center;">
            <div class="feature-cards">
                <div class="feature-card">
                    <div class="icon-circle icon-circle--lg mx-auto">
                        <i class="fa-solid fa-chart-pie" aria-hidden="true"></i>
                    </div>
                    <h3>A quién va dirigida</h3>
                    <p>Personal técnico y administrativo de modernización, perfiles de gestión y dirección, informáticos y especialistas en analítica de datos.</p>
                </div>
                <div class="feature-card">
                    <div class="icon-circle icon-circle--lg mx-auto">
                        <i class="fa-solid fa-magnifying-glass-chart" aria-hidden="true"></i>
                    </div>
                    <h3>Objetivo esencial</h3>
                    <p>Gobernanza del dato con el módulo Analiza: diseño y personalización de cuadros de mando complejos, y explotación avanzada de la información para decisiones basadas en evidencias.</p>
                </div>
            </div>
        </div>
    </section>

</main>
```

- [ ] **Step 2: Verify slide count and structural validity**

Run:
```bash
npx serve . -l 8080 &
sleep 1
curl -s http://localhost:8080/certificaciones-gestiona-avanza/ | grep -c 'slide-container'
curl -s http://localhost:8080/certificaciones-gestiona-avanza/ | grep -c 'data-brand="gestiona-avanza"'
kill %1
```
Expected: `6` slide-containers, `1` occurrence of `data-brand="gestiona-avanza"`.

- [ ] **Step 3: Manual browser verification**

Run:
```bash
npx serve . -l 8080 &
```
Open `http://localhost:8080/certificaciones-gestiona-avanza/` in a browser. Confirm:
- Cian (gestiona-avanza) branding is applied to titles/accents.
- Arrow keys / dot pagination navigate through all 6 slides in order.
- No layout overflow or clipped text on any slide at 1280×720.
Then stop the server (`kill %1` or Ctrl-C).

- [ ] **Step 4: Commit**

```bash
git add certificaciones-gestiona-avanza/index.html
git commit -m "feat(certificaciones-gestiona-avanza): add Analiza slide, complete 6-slide deck"
```

---

## Task 7: Link the new deck from the root index

**Files:**
- Modify: `index.html:113-119` (insert a new card before the closing `</div>` of `.grid`, using the `gestiona-avanza` card that currently exists as reference for markup shape — this is a **new, distinct card**, not a duplicate of the existing `./gestiona-avanza/` brand-launch card at line 114).

**Interfaces:**
- Consumes: existing `.grid` container structure in `index.html`.
- Produces: no new interfaces — this is a leaf link addition.

- [ ] **Step 1: Read current root index.html grid closing markup**

Run:
```bash
grep -n 'kickoff-caag' -A 8 index.html
```
Confirm output ends with:
```html
        </a>
    </div>
</body>
</html>
```

- [ ] **Step 2: Insert the new card**

Edit `index.html`, replacing:
```html
        <a class="card--glass card-link" href="./kickoff-caag/">
            <div class="card-icon"><i class="fa-solid fa-certificate"></i></div>
            <span class="card-label">Academy Gestiona · Kickoff</span>
            <h2>Certificación Administración Avanzada de Gestiona</h2>
            <p>Sesión de arranque del programa de certificación CAAG: objetivos, estructura y hoja de ruta.</p>
            <span class="card-arrow">Abrir <i class="fa-solid fa-arrow-right"></i></span>
        </a>
    </div>
```
with:
```html
        <a class="card--glass card-link" href="./kickoff-caag/">
            <div class="card-icon"><i class="fa-solid fa-certificate"></i></div>
            <span class="card-label">Academy Gestiona · Kickoff</span>
            <h2>Certificación Administración Avanzada de Gestiona</h2>
            <p>Sesión de arranque del programa de certificación CAAG: objetivos, estructura y hoja de ruta.</p>
            <span class="card-arrow">Abrir <i class="fa-solid fa-arrow-right"></i></span>
        </a>
        <a class="card--glass card-link" href="./certificaciones-gestiona-avanza/">
            <div class="card-icon"><i class="fa-solid fa-graduation-cap"></i></div>
            <span class="card-label">Academy Gestiona · Certificaciones</span>
            <h2>Certificaciones Gestiona Avanza</h2>
            <p>Estrategia de capacitación y transferencia de conocimiento a clientes, y las tres certificaciones vigentes.</p>
            <span class="card-arrow">Abrir <i class="fa-solid fa-arrow-right"></i></span>
        </a>
    </div>
```

- [ ] **Step 3: Verify the link resolves**

Run:
```bash
npx serve . -l 8080 &
sleep 1
curl -s http://localhost:8080/ | grep -c 'certificaciones-gestiona-avanza'
curl -s -o /dev/null -w '%{http_code}' http://localhost:8080/certificaciones-gestiona-avanza/
kill %1
```
Expected: first command outputs `1` (or more, just confirms presence), second outputs `200`.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat(index): link Certificaciones Gestiona Avanza deck"
```

---

## Final Verification

- [ ] **Full deck smoke test**

Run:
```bash
npx serve . -l 8080 &
sleep 1
curl -s http://localhost:8080/certificaciones-gestiona-avanza/ | grep -c 'slide-container'
curl -s http://localhost:8080/certificaciones-gestiona-avanza/ | grep -o '<h2 class="slide-title">[^<]*' 
kill %1
```
Expected: `6`, followed by the 5 non-portada slide titles in order: "Cómo funciona el modelo", "Valor para la entidad", "Administración avanzada de Gestiona", "Gestiona for Developers", "Analiza".

- [ ] **Confirm no repeated concepts between slides 2 and 3** (per explicit user feedback during brainstorming)

Run:
```bash
grep -A2 'aria-label="Cómo funciona' -A 40 certificaciones-gestiona-avanza/index.html | grep -i 'comunidad\|renovaci'
```
Expected: no output (slide 2 must not mention comunidad/renovación — that concept lives only in slide 3).
