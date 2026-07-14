# Workshop "Buscando soluciones para el territorio" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `brainstorming-hub/index.html`, a 15-slide HTML presentation that serves as the on-screen guide for the "Workshop: Buscando soluciones para el territorio" co-design session, following the facilitation guide in `brainstorming-hub/Guia_facilitacion_como_ayudar_a_quienes_ayudan_al_ciudadano.docx`.

**Architecture:** Static HTML/CSS/JS, no build step. Single `index.html` file with 15 `<section class="slide-container">` elements inside `<main role="presentation">`, importing shared design system via `assets/css/corporate.css` and `assets/js/navigation.js`. Brand applied via `<body data-brand="ecityclic">`. Reuses existing corporate.css components (`.title-layout`, `.bullet-list`, `.tiled-content`/`.tile`, `.card--bordered`, `.two-column`, `.highlight-box`, `.section-title-layout`) — no new CSS components, only slide-specific inline `<style>` overrides if truly needed.

**Tech Stack:** Plain HTML5, CSS custom properties (corporate.css), vanilla JS (navigation.js). Font Awesome 6.5.1 (CDN), Roboto (Google Fonts).

## Global Constraints

- `data-brand="ecityclic"` on `<body>` — verde lima `#7fb927`. Never assume another brand.
- Import shared assets via `assets/css/corporate.css` and `assets/js/navigation.js` (relative path, since `brainstorming-hub/` sits next to `hub-td-ecityclic/` at repo root level) — never copy `corporate.css`/`navigation.js` into the subdirectory.
- Never redefine canonical `.phase` CSS inline — it lives in corporate.css.
- Content language: Spanish. Class names / identifiers: English.
- Each `<section class="slide-container">` is one slide, 1280×720px, with a descriptive `aria-label`.
- Deck shows only the essentials of each phase (question + brief instruction + time) — no full facilitator script ("Di:"), no rescue questions, no contingency plans (per approved spec).
- Source of truth for all session content: `docs/superpowers/specs/2026-07-14-workshop-buscando-soluciones-territorio-design.md` and `brainstorming-hub/Guia_facilitacion_como_ayudar_a_quienes_ayudan_al_ciudadano.docx`.

---

## File Structure

- Create: `brainstorming-hub/index.html` — the entire presentation (single file, all 15 slides + inline `<style>` block for slide-specific overrides).

No other files are created or modified. The `.docx` guide and any other files already in `brainstorming-hub/` are left untouched.

---

### Task 1: Scaffold document + Portada + Bienvenida (slides 1-2)

**Files:**
- Create: `brainstorming-hub/index.html`

**Interfaces:**
- Produces: base HTML document structure (`<head>`, asset imports, `<body data-brand="ecityclic">`, `<main role="presentation">`, closing `<script>` + `</body></html>`) that all later tasks insert slides into, between the Task 1 slides and the closing tags.

- [ ] **Step 1: Create the file with head, portada and bienvenida slides**

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Workshop: Buscando soluciones para el territorio — ecityclic</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="assets/css/corporate.css">
    <style>
        /* Barra de acento del título en verde de marca (override del dorado por defecto) */
        .slide-title {
            border-left-color: var(--color-primary);
        }
    </style>
</head>
<body data-brand="ecityclic">
<main role="presentation">

    <!-- 1. PORTADA -->
    <section class="slide-container" aria-label="Portada">
        <div class="title-layout">
            <h1>Workshop <span>Buscando soluciones para el territorio</span></h1>
            <p class="subtitle cover-claim">Hub de Transformación Digital · ecityclic</p>
        </div>
    </section>

    <!-- 2. BIENVENIDA Y PROPÓSITO -->
    <section class="slide-container" aria-label="Bienvenida y propósito de la sesión">
        <h2 class="slide-title">Cómo ayudar a quienes ayudan al ciudadano</h2>
        <div class="content-area">
            <div class="highlight-box phase" data-phase="1">
                <p>¿Qué necesitan los profesionales de una Administración pública para mejorar el servicio al ciudadano y qué experiencias debe ofrecer este espacio para que puedan capacitarse, experimentar con una plataforma de administración electrónica y trasladar lo aprendido a su organización?</p>
            </div>
        </div>
    </section>

</main>
<script src="assets/js/navigation.js"></script>
</body>
</html>
```

- [ ] **Step 2: Preview locally and verify**

Run: `cd /Users/ricardoespublico/Documents/proyectos-espublico/presentaciones && npx serve . -l 8080` (leave running in background)

Open `http://localhost:8080/brainstorming-hub/` in a browser. Expected:
- Cover slide shows "Workshop / Buscando soluciones para el territorio" in the ecityclic verde lima accent color.
- Second slide shows the lema as title and the working question inside a highlighted box, revealed via the phase mechanism (press → / space to advance).
- No console errors, no broken asset requests (check Network tab for 404s on `assets/...`).

- [ ] **Step 3: Commit**

```bash
cd /Users/ricardoespublico/Documents/proyectos-espublico/presentaciones
git add brainstorming-hub/index.html
git commit -m "feat(brainstorming-hub): scaffold workshop deck with cover and welcome slides"
```

---

### Task 2: Recorrido de la dinámica + Reglas del juego (slides 3-4)

**Files:**
- Modify: `brainstorming-hub/index.html` — insert two new `<section>` elements immediately after the slide-2 `</section>` from Task 1, before `</main>`.

**Interfaces:**
- Consumes: the `<main role="presentation">` opened in Task 1; inserts before its closing tag.

- [ ] **Step 1: Insert the two slides**

```html
    <!-- 3. EL RECORRIDO DE LA DINÁMICA -->
    <section class="slide-container" aria-label="El recorrido de la dinámica">
        <h2 class="slide-title">El recorrido de la dinámica</h2>
        <div class="content-area">
            <ul class="bullet-list bullet-list--lg">
                <li class="phase" data-phase="1"><i class="fa-solid fa-face-smile" aria-hidden="true"></i> <strong>Beneficio ciudadano</strong> — ¿Qué debería notar o experimentar el ciudadano?</li>
                <li class="phase" data-phase="2"><i class="fa-solid fa-building-columns" aria-hidden="true"></i> <strong>Cambio organizativo</strong> — ¿Qué tendría que cambiar en la Administración?</li>
                <li class="phase" data-phase="3"><i class="fa-solid fa-user-graduate" aria-hidden="true"></i> <strong>Capacidades profesionales</strong> — ¿Qué necesitan aprender, practicar o coordinar los distintos perfiles?</li>
                <li class="phase" data-phase="4"><i class="fa-solid fa-laptop-code" aria-hidden="true"></i> <strong>Papel conceptual del software</strong> — ¿Qué capacidad general puede habilitar una plataforma de administración electrónica?</li>
                <li class="phase" data-phase="5"><i class="fa-solid fa-people-roof" aria-hidden="true"></i> <strong>Experiencia del espacio</strong> — ¿Qué deben hacer presencialmente para capacitarse y experimentar?</li>
                <li class="phase" data-phase="6"><i class="fa-solid fa-arrow-right-to-bracket" aria-hidden="true"></i> <strong>Transferencia</strong> — ¿Qué necesitan para aplicar después lo trabajado en su Administración?</li>
            </ul>
        </div>
    </section>

    <!-- 4. REGLAS DEL JUEGO -->
    <section class="slide-container" aria-label="Reglas del juego">
        <h2 class="slide-title">Reglas del juego</h2>
        <div class="content-area">
            <ul class="bullet-list bullet-list--lg">
                <li class="phase" data-phase="1"><i class="fa-solid fa-note-sticky" aria-hidden="true"></i> Una idea por nota</li>
                <li class="phase" data-phase="2"><i class="fa-solid fa-pen" aria-hidden="true"></i> Primero escribimos, después hablamos</li>
                <li class="phase" data-phase="3"><i class="fa-solid fa-users" aria-hidden="true"></i> Todas las voces cuentan</li>
                <li class="phase" data-phase="4"><i class="fa-solid fa-gears" aria-hidden="true"></i> Hablamos de capacidades, no de funcionalidades</li>
                <li class="phase" data-phase="5"><i class="fa-solid fa-heart" aria-hidden="true"></i> El ciudadano es el propósito</li>
                <li class="phase" data-phase="6"><i class="fa-solid fa-arrows-turn-right" aria-hidden="true"></i> La transferencia forma parte de la experiencia</li>
                <li class="phase" data-phase="7"><i class="fa-solid fa-check-to-slot" aria-hidden="true"></i> Los votos orientan, no deciden</li>
            </ul>
        </div>
    </section>

</main>
```

Note: when inserting, replace the existing `</main>` closing tag (keep it after the newly added slides — it should stay in the file exactly once).

- [ ] **Step 2: Preview and verify**

Reload `http://localhost:8080/brainstorming-hub/`. Navigate to slides 3 and 4 (arrow keys or dot navigation). Expected:
- Slide 3 lists the 6 steps in order, each revealing on advance via `.phase`.
- Slide 4 lists the 7 rules, each revealing on advance.
- Slide-dot pagination now shows 4 dots, all clickable.

- [ ] **Step 3: Commit**

```bash
cd /Users/ricardoespublico/Documents/proyectos-espublico/presentaciones
git add brainstorming-hub/index.html
git commit -m "feat(brainstorming-hub): add dynamics overview and rules slides"
```

---

### Task 3: Roles de mesa + Código visual de las notas (slides 5-6)

**Files:**
- Modify: `brainstorming-hub/index.html` — insert two new `<section>` elements after slide 4, before `</main>`.

**Interfaces:**
- Consumes: `<main>` from Task 1, slides 1-4 from Tasks 1-2 (this task's slides are inserted right after slide 4).

- [ ] **Step 1: Insert the two slides**

```html
    <!-- 5. ROLES DE MESA -->
    <section class="slide-container" aria-label="Roles de mesa">
        <h2 class="slide-title">Roles de mesa</h2>
        <div class="content-area">
            <div class="tiled-content">
                <article class="tile phase" data-phase="1">
                    <div class="icon" aria-hidden="true"><i class="fa-solid fa-user-shield"></i></div>
                    <h3>Responsable de mesa</h3>
                    <p>Protege los turnos, recuerda la tarea y evita que una persona monopolice.</p>
                </article>
                <article class="tile phase" data-phase="2">
                    <div class="icon" aria-hidden="true"><i class="fa-solid fa-bullhorn"></i></div>
                    <h3>Portavoz</h3>
                    <p>Presenta el concepto en 3 minutos siguiendo el guion común.</p>
                </article>
                <article class="tile phase" data-phase="3">
                    <div class="icon" aria-hidden="true"><i class="fa-solid fa-user-check"></i></div>
                    <h3>Guardián del ciudadano</h3>
                    <p>Pregunta: «¿Qué mejora concreta experimenta el ciudadano?»</p>
                </article>
                <article class="tile phase" data-phase="4">
                    <div class="icon" aria-hidden="true"><i class="fa-solid fa-arrows-turn-right"></i></div>
                    <h3>Guardián de la transferencia</h3>
                    <p>Pregunta: «¿Qué hace falta para aplicarlo después en la Administración?»</p>
                </article>
            </div>
        </div>
    </section>

    <!-- 6. CÓDIGO VISUAL DE LAS NOTAS -->
    <section class="slide-container" aria-label="Código visual de las notas">
        <h2 class="slide-title">Código visual de las notas</h2>
        <div class="content-area">
            <ul class="bullet-list bullet-list--lg">
                <li class="phase" data-phase="1"><i class="fa-solid fa-square" style="color:#3b82f6" aria-hidden="true"></i> Azul — Beneficio para el ciudadano</li>
                <li class="phase" data-phase="2"><i class="fa-solid fa-square" style="color:#f472b6" aria-hidden="true"></i> Rosa — Cambio o barrera en la Administración</li>
                <li class="phase" data-phase="3"><i class="fa-solid fa-square" style="color:#facc15" aria-hidden="true"></i> Amarillo — Capacidad o necesidad profesional</li>
                <li class="phase" data-phase="4"><i class="fa-solid fa-square" style="color:var(--color-primary)" aria-hidden="true"></i> Verde — Papel conceptual del software</li>
                <li class="phase" data-phase="5"><i class="fa-solid fa-square" style="color:#a78bfa" aria-hidden="true"></i> Morado — Transferencia y aplicación</li>
                <li class="phase" data-phase="6"><i class="fa-regular fa-square" aria-hidden="true"></i> Blanco/naranja — Título, agrupación o nombre de concepto</li>
            </ul>
        </div>
    </section>

</main>
```

- [ ] **Step 2: Preview and verify**

Reload and navigate to slides 5-6. Expected:
- Slide 5 shows 4 tiles (2x2 or 4-across depending on `.tiled-content` layout), each with icon/title/description, revealing progressively.
- Slide 6 lists 6 color-coded items with visibly distinct colored squares matching the guide's color code, verde using the brand primary color.
- 6 dots in pagination now.

- [ ] **Step 3: Commit**

```bash
cd /Users/ricardoespublico/Documents/proyectos-espublico/presentaciones
git add brainstorming-hub/index.html
git commit -m "feat(brainstorming-hub): add table roles and note color code slides"
```

---

### Task 4: Fases 1-4 de la agenda (slides 7-10)

**Files:**
- Modify: `brainstorming-hub/index.html` — insert four new `<section>` elements after slide 6, before `</main>`.

**Interfaces:**
- Consumes: `<main>` and prior slides from Tasks 1-3.
- Produces: the visual pattern for "fase" slides (phase-title + time range + question in `highlight-box` + instruction) reused verbatim by Task 5 for the remaining phase slides — keep the same markup shape (`.slide-title` with time range in a `<span class="phase-time">`, `.highlight-box` for the question, `.bullet-list` or `<p>` for the instruction).

- [ ] **Step 1: Add a small CSS helper for the phase-time label**

Add inside the existing `<style>` block in `<head>` (from Task 1), after the `.slide-title` rule:

```css
        .phase-time {
            display: block;
            font-size: 15px;
            font-weight: 500;
            color: var(--color-text-muted, #6b7c88);
            margin-top: 4px;
        }
```

- [ ] **Step 2: Insert the four phase slides**

```html
    <!-- 7. FASE 1 — GENERACIÓN INDIVIDUAL -->
    <section class="slide-container" aria-label="Fase 1: Generación individual">
        <h2 class="slide-title">Generación individual <span class="phase-time">0:08 – 0:15</span></h2>
        <div class="content-area">
            <div class="highlight-box phase" data-phase="1">
                <p>¿Qué nota el ciudadano cuando la Administración ha mejorado de verdad?</p>
            </div>
            <ul class="bullet-list mt-lg phase" data-phase="2">
                <li><i class="fa-solid fa-note-sticky" aria-hidden="true"></i> 3 notas azules, una idea por nota. Empieza por «Puedo…», «Entiendo…», «Recibo…», «No tengo que…».</li>
            </ul>
        </div>
    </section>

    <!-- 8. FASE 2 — MURAL CIUDADANO -->
    <section class="slide-container" aria-label="Fase 2: Mural ciudadano">
        <h2 class="slide-title">Mural ciudadano <span class="phase-time">0:15 – 0:27</span></h2>
        <div class="content-area">
            <ul class="bullet-list bullet-list--lg">
                <li class="phase" data-phase="1"><i class="fa-solid fa-arrows-turn-right" aria-hidden="true"></i> Pegad vuestras notas por turnos, sin debatir.</li>
                <li class="phase" data-phase="2"><i class="fa-solid fa-layer-group" aria-hidden="true"></i> Agrupad las notas que hablen de beneficios parecidos.</li>
                <li class="phase" data-phase="3"><i class="fa-solid fa-check-to-slot" aria-hidden="true"></i> Votad en silencio la agrupación prioritaria de la mesa.</li>
            </ul>
        </div>
    </section>

    <!-- 9. FASE 3 — CADENA DE CAMBIO -->
    <section class="slide-container" aria-label="Fase 3: Cadena de cambio">
        <h2 class="slide-title">Cadena de cambio <span class="phase-time">0:27 – 0:39</span></h2>
        <div class="content-area">
            <div class="two-column">
                <div class="card card--bordered phase" data-phase="1">
                    <h3><i class="fa-solid fa-building-columns" aria-hidden="true"></i> Cambio organizativo</h3>
                    <p>¿Qué tendría que cambiar en la forma de trabajar de la Administración? Notas rosas.</p>
                </div>
                <div class="card card--bordered phase" data-phase="2">
                    <h3><i class="fa-solid fa-user-graduate" aria-hidden="true"></i> Capacidades profesionales</h3>
                    <p>¿Qué necesitan aprender, practicar o coordinar los distintos perfiles? Notas amarillas. Recorred al menos 4 perfiles.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- 10. FASE 4 — SOFTWARE Y TRANSFERENCIA -->
    <section class="slide-container" aria-label="Fase 4: Software y transferencia">
        <h2 class="slide-title">Software y transferencia <span class="phase-time">0:39 – 0:49</span></h2>
        <div class="content-area">
            <div class="two-column">
                <div class="card card--bordered phase" data-phase="1">
                    <h3><i class="fa-solid fa-laptop-code" aria-hidden="true"></i> Papel del software</h3>
                    <p>Sin mencionar funcionalidades concretas, ¿qué capacidad general puede aportar la plataforma? Notas verdes.</p>
                </div>
                <div class="card card--bordered phase" data-phase="2">
                    <h3><i class="fa-solid fa-arrow-right-to-bracket" aria-hidden="true"></i> Transferencia</h3>
                    <p>¿Qué necesitaría su Administración para convertirlo en una mejora real? Notas moradas.</p>
                </div>
            </div>
        </div>
    </section>

</main>
```

- [ ] **Step 3: Preview and verify**

Reload and navigate through slides 7-10. Expected:
- Each slide title shows the phase name with the time range in muted smaller text beneath it.
- Slide 7's question is in a highlight box, instruction follows on second phase reveal.
- Slides 9-10 show two side-by-side cards each.
- Pagination shows 10 dots.

- [ ] **Step 4: Commit**

```bash
cd /Users/ricardoespublico/Documents/proyectos-espublico/presentaciones
git add brainstorming-hub/index.html
git commit -m "feat(brainstorming-hub): add agenda phases 1-4 slides"
```

---

### Task 5: Fases 5-7 de la agenda (slides 11-13)

**Files:**
- Modify: `brainstorming-hub/index.html` — insert three new `<section>` elements after slide 10, before `</main>`.

**Interfaces:**
- Consumes: the `.phase-time` CSS helper and slide markup pattern established in Task 4.

- [ ] **Step 1: Insert the three phase slides**

```html
    <!-- 11. FASE 5 — DISEÑO DE EXPERIENCIA -->
    <section class="slide-container" aria-label="Fase 5: Diseño de experiencia">
        <h2 class="slide-title">Diseño de experiencia <span class="phase-time">0:49 – 1:07</span></h2>
        <div class="content-area">
            <div class="highlight-box phase" data-phase="1">
                <p>Diseñad una experiencia concreta que combine capacitación, experimentación y transferencia.</p>
            </div>
            <ul class="bullet-list mt-lg phase" data-phase="2">
                <li><i class="fa-solid fa-clipboard-list" aria-hidden="true"></i> Completad el lienzo: beneficio, cambio, perfiles, capacidades, papel del software, antes/durante/después, resultado tangible, transferencia y nombre del concepto.</li>
            </ul>
        </div>
    </section>

    <!-- 12. FASE 6 — PRESENTACIONES -->
    <section class="slide-container" aria-label="Fase 6: Presentaciones de las mesas">
        <h2 class="slide-title">Presentaciones <span class="phase-time">1:07 – 1:19</span></h2>
        <div class="content-area">
            <ul class="bullet-list bullet-list--lg">
                <li class="phase" data-phase="1"><i class="fa-solid fa-stopwatch" aria-hidden="true"></i> 3 minutos por mesa, sin debate.</li>
                <li class="phase" data-phase="2"><i class="fa-solid fa-list-ol" aria-hidden="true"></i> Guion del portavoz: ciudadano, cambio, personas, software, experiencia, resultado, transferencia.</li>
            </ul>
        </div>
    </section>

    <!-- 13. FASE 7 — GALERÍA Y VOTACIÓN -->
    <section class="slide-container" aria-label="Fase 7: Galería y votación">
        <h2 class="slide-title">Galería y votación <span class="phase-time">1:19 – 1:26</span></h2>
        <div class="content-area">
            <ul class="bullet-list bullet-list--lg">
                <li class="phase" data-phase="1"><i class="fa-solid fa-square" style="color:#3b82f6" aria-hidden="true"></i> Azul — Impacto ciudadano</li>
                <li class="phase" data-phase="2"><i class="fa-solid fa-square" style="color:#facc15" aria-hidden="true"></i> Amarillo — Capacidad transformadora</li>
                <li class="phase" data-phase="3"><i class="fa-solid fa-square" style="color:var(--color-primary)" aria-hidden="true"></i> Verde — Valor del espacio</li>
                <li class="phase" data-phase="4"><i class="fa-solid fa-hand" aria-hidden="true"></i> No votéis la propuesta de vuestra propia mesa.</li>
            </ul>
        </div>
    </section>

</main>
```

- [ ] **Step 2: Preview and verify**

Reload and navigate through slides 11-13. Expected:
- Slide 11's highlight box then instruction reveal in order.
- Slide 13 shows 3 color-coded voting criteria plus the "no votes on own table" rule, colors matching slide 6.
- Pagination shows 13 dots.

- [ ] **Step 3: Commit**

```bash
cd /Users/ricardoespublico/Documents/proyectos-espublico/presentaciones
git add brainstorming-hub/index.html
git commit -m "feat(brainstorming-hub): add agenda phases 5-7 slides"
```

---

### Task 6: Cierre + Cierre final (slides 14-15)

**Files:**
- Modify: `brainstorming-hub/index.html` — insert two new `<section>` elements after slide 13, before `</main>`.

**Interfaces:**
- Consumes: `<main>` and all prior slides from Tasks 1-5. This is the final task — after this insertion the file is complete (15 slides).

- [ ] **Step 1: Insert the two closing slides**

```html
    <!-- 14. CIERRE DE LA SESIÓN -->
    <section class="slide-container" aria-label="Cierre de la sesión">
        <h2 class="slide-title">Cierre <span class="phase-time">1:26 – 1:30</span></h2>
        <div class="content-area">
            <div class="highlight-box phase" data-phase="1">
                <p>No elegimos hoy un único uso definitivo. Hemos identificado beneficios ciudadanos, necesidades de los profesionales, capacidades del software y experiencias que podrían convertir este espacio en un referente de transformación.</p>
            </div>
            <ul class="bullet-list mt-lg phase" data-phase="2">
                <li><i class="fa-solid fa-scale-balanced" aria-hidden="true"></i> Compararemos estos resultados con los de la otra sesión.</li>
                <li><i class="fa-solid fa-paper-plane" aria-hidden="true"></i> Os haremos llegar las conclusiones.</li>
            </ul>
        </div>
    </section>

    <!-- 15. CIERRE FINAL -->
    <section class="slide-container" aria-label="Cierre final">
        <div class="section-title-layout section-title-layout--gray">
            <h2>¡Gracias!</h2>
            <hr aria-hidden="true">
            <p class="subtitle"><span class="text-accent">Workshop: Buscando soluciones para el territorio</span><br>Hub de Transformación Digital · ecityclic</p>
        </div>
    </section>

</main>
<script src="assets/js/navigation.js"></script>
</body>
</html>
```

Note: this replaces the previous final `</main><script src="assets/js/navigation.js"></script></body></html>` block — ensure there is exactly one copy of the closing tags after this insertion, not a duplicate.

- [ ] **Step 2: Full deck preview and verification**

Reload `http://localhost:8080/brainstorming-hub/`. Walk through all 15 slides with arrow keys and by clicking each dot. Expected:
- 15 dots in pagination, all clickable and each lands on the correct slide.
- All `.phase` reveals work in each slide that uses them (press → repeatedly within a slide before it advances to the next).
- No console errors, no 404s on assets (check Network tab).
- `data-brand="ecityclic"` verde lima color consistently applied to title accents, highlight boxes, cards, and primary-colored icons across all slides.
- Keyboard navigation (arrows), and `prefers-reduced-motion` respected (no motion-sickness-inducing transitions if OS setting is on — visually confirm phase transitions are present under normal settings).

- [ ] **Step 3: Commit**

```bash
cd /Users/ricardoespublico/Documents/proyectos-espublico/presentaciones
git add brainstorming-hub/index.html
git commit -m "feat(brainstorming-hub): add closing slides, complete 15-slide workshop deck"
```

---

## Post-implementation

- Update `log-prompts.md` per project convention with a session entry (max 4 lines) covering this deck's creation.
- The `.docx` guide stays in `brainstorming-hub/` as facilitator reference material; it is not linked from the HTML and needs no further changes.
