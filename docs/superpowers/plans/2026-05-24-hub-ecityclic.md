# Hub ecityclic — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Crear `hub-ecityclic/index.html` — pitch ejecutivo de 11 slides para Dirección esPublico sobre la creación del Hub de transformación digital "Gestiona Avanza" en Cataluña, ubicado en oficinas ecityclic.

**Architecture:** HTML/CSS/JS puro, sin build. Reutiliza el sistema de diseño en `assets/css/corporate.css` y la navegación en `assets/js/navigation.js`. Marca primaria deck: `ecityclic` (verde lima). Co-marketing con marca `gestiona` mediante badges/menciones en slides de producto.

**Tech Stack:** HTML5 · CSS variables sistema corporativo · Font Awesome 6.5.1 (CDN) · Google Fonts Roboto · `navigation.js` (teclado + revelación progresiva).

**Spec:** `docs/superpowers/specs/2026-05-24-hub-ecityclic-design.md`

**Nota commits:** El usuario tiene regla global "NEVER commit changes unless explicitly asked". Los pasos de commit son opcionales — pedir confirmación a Ricardo antes de cada commit, o agruparlos al final.

---

## File Structure

**Crear:**
- `hub-ecityclic/index.html` — presentación 11 slides
- `_sources/hub-ecityclic/` — directorio para PDFs fuente

**Modificar:**
- `index.html` (raíz) — añadir tarjeta de enlace
- `log-prompts.md` — entrada ISO-8601 de sesión

**Mover:**
- `hub-ecityclic/Análisis reunión Lleida 22.05.2026.pdf` → `_sources/hub-ecityclic/`
- `hub-ecityclic/DINAMIZACIÓN ESPACIOS ECITYCLIC.pdf` → `_sources/hub-ecityclic/`

**No tocar:**
- `assets/css/corporate.css`
- `assets/js/navigation.js`
- `templates/*`

---

## Verificación: cómo validar cada slide

No hay tests automatizados. Cada slide se valida visualmente:

```bash
# Levantar servidor (una sola vez al inicio, dejar en background)
npx serve . -l 8080
# Abrir http://localhost:8080/hub-ecityclic/
# Navegar con flechas o Page Down / Page Up
# Verificar layout, contenido y aria-label
```

---

### Task 1: Setup — mover PDFs y crear archivo desde template

**Files:**
- Create: `_sources/hub-ecityclic/` (dir)
- Move: `hub-ecityclic/*.pdf` → `_sources/hub-ecityclic/`
- Create: `hub-ecityclic/index.html` (vacío de slides, solo esqueleto)

- [ ] **Step 1.1: Crear directorio destino para fuentes**

```bash
mkdir -p _sources/hub-ecityclic
```

- [ ] **Step 1.2: Mover PDFs a `_sources/`**

```bash
mv "hub-ecityclic/Análisis reunión Lleida 22.05.2026.pdf" _sources/hub-ecityclic/
mv "hub-ecityclic/DINAMIZACIÓN ESPACIOS ECITYCLIC.pdf" _sources/hub-ecityclic/
```

- [ ] **Step 1.3: Crear esqueleto `hub-ecityclic/index.html` desde template**

```bash
cp templates/slide-template.html hub-ecityclic/index.html
```

- [ ] **Step 1.4: Reemplazar `<title>` y `data-brand` y vaciar `<main>`**

En `hub-ecityclic/index.html`:

- Cambiar `<title>Título — <Marca></title>` por `<title>Hub de transformación digital — ecityclic · Gestiona Avanza</title>`
- Cambiar `<body data-brand="gestiona">` por `<body data-brand="ecityclic">`
- Borrar todo el contenido entre `<main role="presentation">` y `</main>` (mantener `<main>` vacío, los slides se añadirán uno a uno)

Resultado esperado de `<body>` y `<main>`:

```html
<body data-brand="ecityclic">
<main role="presentation">

    <!-- Slides añadidos en tasks posteriores -->

</main>
<script src="../assets/js/navigation.js"></script>
</body>
```

- [ ] **Step 1.5: Verificar levantando servidor**

```bash
npx serve . -l 8080
```

Abrir `http://localhost:8080/hub-ecityclic/`. Debe cargar sin errores en consola (página en blanco con `main` vacío es OK).

- [ ] **Step 1.6: Commit (pedir confirmación a Ricardo antes)**

```bash
git add hub-ecityclic/index.html _sources/hub-ecityclic/
git commit -m "feat(hub-ecityclic): setup inicial — esqueleto deck + mover fuentes"
```

---

### Task 2: Slide 1 — Portada

**Files:**
- Modify: `hub-ecityclic/index.html` (añadir slide dentro de `<main>`)

- [ ] **Step 2.1: Insertar slide portada**

Insertar dentro de `<main role="presentation">`:

```html
    <!-- 1. PORTADA -->
    <section class="slide-container" aria-label="Portada">
        <div class="title-layout">
            <p class="text-uppercase text-primary text-sm" style="letter-spacing: 3px; font-weight: 600; margin-bottom: 12px;">ecityclic · esPublico</p>
            <h1>Hub de transformación digital <span>Gestiona Avanza</span></h1>
            <p class="subtitle">Estrategia 2026 – 2027 · Cataluña</p>
        </div>
    </section>
```

- [ ] **Step 2.2: Verificar en navegador**

Recargar `http://localhost:8080/hub-ecityclic/`. Verificar: título grande con "Gestiona Avanza" en verde lima (acento ecityclic), subtítulo gris.

- [ ] **Step 2.3: Commit**

```bash
git add hub-ecityclic/index.html
git commit -m "feat(hub-ecityclic): slide 1 portada"
```

---

### Task 3: Slide 2 — Contexto y SOTA

**Files:**
- Modify: `hub-ecityclic/index.html`

- [ ] **Step 3.1: Insertar slide contexto**

Añadir tras el slide portada:

```html
    <!-- 2. CONTEXTO Y SOTA -->
    <section class="slide-container" aria-label="Contexto y estado del arte">
        <h2 class="slide-title">Contexto · de dónde partimos</h2>
        <div class="content-area">
            <ul class="bullet-list">
                <li><i class="fa-solid fa-building-columns" aria-hidden="true"></i> Empresa <strong>referente en software de gestión</strong> para la Administración Pública.</li>
                <li><i class="fa-solid fa-network-wired" aria-hidden="true"></i> Red de <strong>oficinas replicadas en el territorio</strong>, con espacios muy versátiles.</li>
                <li><i class="fa-solid fa-bullseye" aria-hidden="true"></i> El reto: <strong>dar contenido</strong> a esas instalaciones y transformarlas en un espacio de referencia.</li>
                <li><i class="fa-solid fa-layer-group" aria-hidden="true"></i> Muchos usuarios, <strong>distintos estadios de madurez digital</strong>.</li>
                <li><i class="fa-solid fa-people-group" aria-hidden="true"></i> Perfiles organizativos heterogéneos por territorio.</li>
            </ul>
        </div>
    </section>
```

- [ ] **Step 3.2: Verificar en navegador**

Avanzar al slide 2. Verificar: título "Contexto · de dónde partimos", 5 bullets con iconos en verde lima.

- [ ] **Step 3.3: Commit**

```bash
git add hub-ecityclic/index.html
git commit -m "feat(hub-ecityclic): slide 2 contexto y SOTA"
```

---

### Task 4: Slide 3 — El problema

**Files:**
- Modify: `hub-ecityclic/index.html`

- [ ] **Step 4.1: Insertar slide problema**

```html
    <!-- 3. EL PROBLEMA -->
    <section class="slide-container" aria-label="El problema">
        <h2 class="slide-title">El problema · qué queremos resolver</h2>
        <div class="content-area">
            <div class="highlight-box">
                <h3>Dar sentido de país a las oficinas ecityclic</h3>
                <p>Convertirlas en el referente de transformación digital de las administraciones catalanas.</p>
            </div>
            <div class="two-column mt-lg">
                <div class="card card--bordered">
                    <h3><i class="fa-solid fa-comments" aria-hidden="true"></i> Lo que piden los usuarios</h3>
                    <p>Capacitación <strong>real</strong> para resolver problemas reales — no para engordar resultados ni estrategias políticas.</p>
                </div>
                <div class="card card--bordered">
                    <h3><i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i> Lo que hoy no reciben</h3>
                    <p>Ni el Consorci AOC ni las Diputaciones cubren esa necesidad. Hay un <strong>hueco</strong> que podemos ocupar.</p>
                </div>
            </div>
        </div>
    </section>
```

- [ ] **Step 4.2: Verificar en navegador**

Verificar: highlight-box destacado arriba + dos cards bordered abajo.

- [ ] **Step 4.3: Commit**

```bash
git add hub-ecityclic/index.html
git commit -m "feat(hub-ecityclic): slide 3 problema"
```

---

### Task 5: Slide 4 — Visión: Usuario en el centro

**Files:**
- Modify: `hub-ecityclic/index.html`

- [ ] **Step 5.1: Insertar slide visión POR/CON/PARA**

```html
    <!-- 4. VISIÓN — USUARIO EN EL CENTRO -->
    <section class="slide-container" aria-label="Visión estratégica: usuario en el centro">
        <h2 class="slide-title">Visión · el usuario en el centro</h2>
        <div class="content-area">
            <div class="tiled-content tile-triple">
                <article class="tile">
                    <div class="icon" aria-hidden="true"><i class="fa-solid fa-share-nodes"></i></div>
                    <h3>Espacios <em>POR</em> el usuario</h3>
                    <p>Compartir el éxito y la práctica. Los propios usuarios cuentan cómo lo hacen.</p>
                </article>
                <article class="tile">
                    <div class="icon" aria-hidden="true"><i class="fa-solid fa-flask"></i></div>
                    <h3>Espacios <em>CON</em> el usuario</h3>
                    <p>Co-diseño y laboratorios. Construimos soluciones junto a quien las usará.</p>
                </article>
                <article class="tile">
                    <div class="icon" aria-hidden="true"><i class="fa-solid fa-hands-holding-circle"></i></div>
                    <h3>Espacios <em>PARA</em> el usuario</h3>
                    <p>Acompañamiento, valor y referencia digital permanente.</p>
                </article>
            </div>
        </div>
    </section>
```

- [ ] **Step 5.2: Verificar en navegador**

Verificar: 3 tiles en una sola fila, borde superior verde lima.

- [ ] **Step 5.3: Commit**

```bash
git add hub-ecityclic/index.html
git commit -m "feat(hub-ecityclic): slide 4 visión POR/CON/PARA"
```

---

### Task 6: Slide 5 — Insights reunión Lleida

**Files:**
- Modify: `hub-ecityclic/index.html`

- [ ] **Step 6.1: Insertar slide insights Q&A**

```html
    <!-- 5. INSIGHTS REUNIÓN LLEIDA -->
    <section class="slide-container" aria-label="Insights clave reunión Lleida 22.05.2026">
        <h2 class="slide-title">Insights · reunión Lleida (22.05.2026)</h2>
        <div class="content-area">
            <div class="two-column">
                <div class="card card--bordered">
                    <h3><i class="fa-solid fa-trophy" aria-hidden="true"></i> Champions del territorio</h3>
                    <p><strong>Consells comarcals</strong> (técnicos) y <strong>usuarios certificados</strong>. Son la palanca dinamizadora.</p>
                </div>
                <div class="card card--bordered">
                    <h3><i class="fa-solid fa-medal" aria-hidden="true"></i> Incentivo del funcionario</h3>
                    <p><strong>Reconocimiento profesional</strong>. Dar visibilidad a su trabajo y que participe en la creación.</p>
                </div>
                <div class="card card--bordered">
                    <h3><i class="fa-solid fa-handshake" aria-hidden="true"></i> Proveedor → socio institucional</h3>
                    <p>Imposible mientras nos vean como <strong>amenaza</strong>. La capacitación es el camino para cambiar la percepción.</p>
                </div>
                <div class="card card--bordered">
                    <h3><i class="fa-solid fa-people-arrows" aria-hidden="true"></i> Hibridación por perfil</h3>
                    <p>Acciones diferenciadas según convocatoria: <strong>usuario · consells · secretarios · CIOs</strong>.</p>
                </div>
            </div>
        </div>
    </section>
```

- [ ] **Step 6.2: Verificar en navegador**

Verificar: 4 cards en grid 2×2 con title-icon, contenido legible.

- [ ] **Step 6.3: Commit**

```bash
git add hub-ecityclic/index.html
git commit -m "feat(hub-ecityclic): slide 5 insights Lleida"
```

---

### Task 7: Slide 6 — Catálogo de acciones

**Files:**
- Modify: `hub-ecityclic/index.html`

- [ ] **Step 7.1: Insertar slide catálogo (6 tiles)**

```html
    <!-- 6. CATÁLOGO DE ACCIONES -->
    <section class="slide-container" aria-label="Catálogo de acciones del Hub">
        <h2 class="slide-title">Catálogo de acciones <span class="badge-gestiona">Gestiona Avanza</span></h2>
        <div class="content-area">
            <div class="tiled-content tile-triple">
                <article class="tile">
                    <div class="icon" aria-hidden="true"><i class="fa-solid fa-cogs"></i></div>
                    <h3>Formación avanzada</h3>
                    <p>Programa de configuración avanzada de procedimientos.</p>
                </article>
                <article class="tile">
                    <div class="icon" aria-hidden="true"><i class="fa-solid fa-rocket"></i></div>
                    <h3>Novedades y módulos</h3>
                    <p>Formación asociada a nuevas versiones y módulos de Gestiona.</p>
                </article>
                <article class="tile">
                    <div class="icon" aria-hidden="true"><i class="fa-solid fa-vial"></i></div>
                    <h3>Lab provincial</h3>
                    <p>Metodología y diseño de configuración de procedimientos de ámbito provincial.</p>
                </article>
                <article class="tile">
                    <div class="icon" aria-hidden="true"><i class="fa-solid fa-flask-vial"></i></div>
                    <h3>Lab autonómico</h3>
                    <p>Metodología y diseño de configuración de ámbito autonómico.</p>
                </article>
                <article class="tile">
                    <div class="icon" aria-hidden="true"><i class="fa-solid fa-mug-hot"></i></div>
                    <h3>Desayunos de expertos</h3>
                    <p>Encuentros con expertos del grupo esPublico.</p>
                </article>
                <article class="tile">
                    <div class="icon" aria-hidden="true"><i class="fa-solid fa-handshake-angle"></i></div>
                    <h3>Partners</h3>
                    <p>Formaciones a cargo de empresas colaboradoras (Fractal, AGTIC, …).</p>
                </article>
            </div>
        </div>
    </section>
```

- [ ] **Step 7.2: Verificar en navegador**

Verificar: 6 tiles en grid 3×2, badge "Gestiona Avanza" en el título.

- [ ] **Step 7.3: Commit**

```bash
git add hub-ecityclic/index.html
git commit -m "feat(hub-ecityclic): slide 6 catálogo de acciones"
```

---

### Task 8: Slide 7 — Objetivos cuantitativos

**Files:**
- Modify: `hub-ecityclic/index.html`

- [ ] **Step 8.1: Insertar slide objetivos (feature-cards con números grandes)**

```html
    <!-- 7. OBJETIVOS CUANTITATIVOS -->
    <section class="slide-container" aria-label="Objetivos cuantitativos">
        <h2 class="slide-title">Objetivos · qué queremos lograr</h2>
        <div class="content-area" style="align-items: center;">
            <div class="feature-cards" style="flex-wrap: wrap;">
                <div class="feature-card">
                    <div class="icon-circle icon-circle--lg mx-auto" aria-hidden="true"><i class="fa-solid fa-graduation-cap"></i></div>
                    <h3 style="font-size: 40px; color: var(--color-primary); margin: 8px 0;">100</h3>
                    <p>Usuarios capacitados en programas <strong>avanzados</strong> de Gestiona.</p>
                </div>
                <div class="feature-card">
                    <div class="icon-circle icon-circle--lg mx-auto" aria-hidden="true"><i class="fa-solid fa-chalkboard-user"></i></div>
                    <h3 style="font-size: 40px; color: var(--color-primary); margin: 8px 0;">200</h3>
                    <p>Asistentes a jornadas de <strong>novedades</strong> de Gestiona.</p>
                </div>
                <div class="feature-card">
                    <div class="icon-circle icon-circle--lg mx-auto" aria-hidden="true"><i class="fa-solid fa-people-line"></i></div>
                    <h3 style="font-size: 40px; color: var(--color-primary); margin: 8px 0;">100</h3>
                    <p>Asistentes a <strong>laboratorios</strong> y formaciones de terceros.</p>
                </div>
                <div class="feature-card">
                    <div class="icon-circle icon-circle--lg mx-auto" aria-hidden="true"><i class="fa-solid fa-network-wired"></i></div>
                    <h3 style="font-size: 40px; color: var(--color-primary); margin: 8px 0;">1</h3>
                    <p>Ecosistema · <strong>comunidad</strong> del Hub de transformación digital.</p>
                </div>
            </div>
        </div>
    </section>
```

- [ ] **Step 8.2: Verificar en navegador**

Verificar: 4 feature-cards con números grandes (100/200/100/1) en verde lima.

- [ ] **Step 8.3: Commit**

```bash
git add hub-ecityclic/index.html
git commit -m "feat(hub-ecityclic): slide 7 objetivos cuantitativos"
```

---

### Task 9: Slide 8 — Estrategia de comunicación

**Files:**
- Modify: `hub-ecityclic/index.html`

- [ ] **Step 9.1: Insertar slide estrategia con step-cards**

```html
    <!-- 8. ESTRATEGIA DE COMUNICACIÓN -->
    <section class="slide-container" aria-label="Estrategia de comunicación y puesta en marcha">
        <div class="section-title-layout">
            <h2>Estrategia de comunicación y puesta en marcha</h2>
            <hr aria-hidden="true">
            <div class="step-cards mt-lg">
                <div class="step-card">
                    <span class="step-number">1</span>
                    <p><strong>Certificados como palanca</strong> · Usar a los usuarios certificados para atraer a otros usuarios de Gestiona a las instalaciones.</p>
                </div>
                <div class="step-card">
                    <span class="step-number">2</span>
                    <p><strong>Comercial + medios</strong> · Convocar y atraer perfiles clave a través del equipo comercial y los medios propios.</p>
                </div>
                <div class="step-card">
                    <span class="step-number">3</span>
                    <p><strong>Evento de inauguración</strong> · Explicar en qué consiste el Hub de transformación digital de ecityclic.</p>
                </div>
                <div class="step-card">
                    <span class="step-number">4</span>
                    <p><strong>Newsletter Gestiona Avanza (vCAT)</strong> · A la lista de distribución alrededor de los participantes del Hub.</p>
                </div>
            </div>
        </div>
    </section>
```

- [ ] **Step 9.2: Verificar en navegador**

Verificar: fondo oscuro, 4 step-cards numeradas.

- [ ] **Step 9.3: Commit**

```bash
git add hub-ecityclic/index.html
git commit -m "feat(hub-ecityclic): slide 8 estrategia comunicación"
```

---

### Task 10: Slide 9 — Fase I: Definición e impulso (2026)

**Files:**
- Modify: `hub-ecityclic/index.html`

- [ ] **Step 10.1: Insertar slide Fase I**

```html
    <!-- 9. FASE I — DEFINICIÓN E IMPULSO (2026) -->
    <section class="slide-container" aria-label="Fase I: definición e impulso 2026">
        <h2 class="slide-title">Fase I · Definición e impulso <span>(2026)</span></h2>
        <div class="content-area">
            <div class="two-column">
                <div class="card card--bordered">
                    <h3><i class="fa-solid fa-calendar-day" aria-hidden="true"></i> 2T – 3T 2026</h3>
                    <p><strong>Stakeholders:</strong> consells comarcals y usuarios certificados de Cataluña.</p>
                    <p><strong>Acciones:</strong> reuniones en las instalaciones para definir el modelo y validar las propuestas de uso de los espacios.</p>
                </div>
                <div class="card card--bordered">
                    <h3><i class="fa-solid fa-calendar-week" aria-hidden="true"></i> 3T – 4T 2026</h3>
                    <p><strong>Stakeholders:</strong> usuarios de Gestiona en Cataluña.</p>
                    <p><strong>Acciones:</strong> programa de formación en configuración avanzada y programa de novedades, módulos y versiones.</p>
                </div>
            </div>
        </div>
    </section>
```

- [ ] **Step 10.2: Verificar en navegador**

Verificar: 2 cards (2T-3T y 3T-4T).

- [ ] **Step 10.3: Commit**

```bash
git add hub-ecityclic/index.html
git commit -m "feat(hub-ecityclic): slide 9 fase I 2026"
```

---

### Task 11: Slide 10 — Fase II: Ampliación (2027)

**Files:**
- Modify: `hub-ecityclic/index.html`

- [ ] **Step 11.1: Insertar slide Fase II**

```html
    <!-- 10. FASE II — AMPLIACIÓN (2027) -->
    <section class="slide-container" aria-label="Fase II: ampliación 2027">
        <h2 class="slide-title">Fase II · Ampliación del alcance <span>(2027)</span></h2>
        <div class="content-area">
            <div class="two-column">
                <div class="card card--bordered">
                    <h3><i class="fa-solid fa-calendar-day" aria-hidden="true"></i> 1T – 2T 2027</h3>
                    <p><strong>Stakeholders:</strong> usuarios de Gestiona en Cataluña y responsables de proyectos provinciales.</p>
                    <p><strong>Acciones:</strong> laboratorios de diseño provincial y autonómico, y desayunos de expertos del grupo esPublico.</p>
                </div>
                <div class="card card--bordered">
                    <h3><i class="fa-solid fa-calendar-week" aria-hidden="true"></i> 3T – 4T 2027</h3>
                    <p><strong>Stakeholders:</strong> usuarios, responsables provinciales e <strong>instituciones de e-admin en Cataluña</strong>.</p>
                    <p><strong>Acciones:</strong> formaciones a cargo de empresas colaboradoras (Fractal, AGTIC, …).</p>
                </div>
            </div>
        </div>
    </section>
```

- [ ] **Step 11.2: Verificar en navegador**

Verificar: 2 cards Fase II.

- [ ] **Step 11.3: Commit**

```bash
git add hub-ecityclic/index.html
git commit -m "feat(hub-ecityclic): slide 10 fase II 2027"
```

---

### Task 12: Slide 11 — Decisión / próximos pasos

**Files:**
- Modify: `hub-ecityclic/index.html`

- [ ] **Step 12.1: Insertar slide cierre con tres pilares de decisión**

```html
    <!-- 11. DECISIÓN / PRÓXIMOS PASOS -->
    <section class="slide-container" aria-label="Decisión y próximos pasos">
        <div class="section-title-layout">
            <h2>Qué pedimos a la Dirección</h2>
            <hr aria-hidden="true">
            <div class="mt-lg" style="display: flex; gap: 32px;">
                <div class="card--glass">
                    <h3><i class="fa-solid fa-circle-check" aria-hidden="true" style="margin-right: 8px;"></i>Validación estratégica</h3>
                    <p>Confirmar el modelo POR / CON / PARA el usuario y el papel de ecityclic como Hub.</p>
                </div>
                <div class="card--glass">
                    <h3><i class="fa-solid fa-coins" aria-hidden="true" style="margin-right: 8px;"></i>Aprobación de presupuesto</h3>
                    <p>Recursos para programas de formación, laboratorios, eventos y newsletter en 2026 – 2027.</p>
                </div>
                <div class="card--glass">
                    <h3><i class="fa-solid fa-users-gear" aria-hidden="true" style="margin-right: 8px;"></i>Refuerzo equipo Lleida</h3>
                    <p>Plan de capacitación del equipo local — gap identificado en la reunión.</p>
                </div>
            </div>
        </div>
    </section>
```

- [ ] **Step 12.2: Verificar en navegador**

Verificar: fondo oscuro, 3 glass cards (validación, presupuesto, equipo).

- [ ] **Step 12.3: Commit**

```bash
git add hub-ecityclic/index.html
git commit -m "feat(hub-ecityclic): slide 11 decisión y próximos pasos"
```

---

### Task 13: Añadir tarjeta de enlace en `index.html` raíz

**Files:**
- Modify: `index.html:114-120` (insertar nueva tarjeta tras la de `gestiona-avanza`)

- [ ] **Step 13.1: Insertar tarjeta justo tras el bloque de `gestiona-avanza`**

Tras la línea 120 (`</a>` de la tarjeta `gestiona-avanza`) y antes de `</div>` (línea 121), insertar:

```html
        <a class="card--glass card-link" href="./hub-ecityclic/">
            <div class="card-icon"><i class="fa-solid fa-network-wired"></i></div>
            <span class="card-label">Estrategia 2026 – 2027 · ecityclic</span>
            <h2>Hub de transformación digital</h2>
            <p>Pitch ejecutivo para la Dirección: creación del Hub Gestiona Avanza en las oficinas de Cataluña.</p>
            <span class="card-arrow">Abrir <i class="fa-solid fa-arrow-right"></i></span>
        </a>
```

- [ ] **Step 13.2: Verificar en navegador**

Abrir `http://localhost:8080/`. Verificar: aparece la nueva tarjeta con icono `network-wired`. Clic → debe abrir el deck.

- [ ] **Step 13.3: Commit**

```bash
git add index.html
git commit -m "feat(index): añadir tarjeta hub-ecityclic"
```

---

### Task 14: Verificación final + entrada `log-prompts.md`

**Files:**
- Modify: `log-prompts.md` (añadir entrada al final)

- [ ] **Step 14.1: Recorrer las 11 slides en el navegador**

```bash
# Abrir http://localhost:8080/hub-ecityclic/
# Pulsar → (flecha derecha) 11 veces — debe pasar por las 11 slides
# Pulsar ← para retroceder — debe volver
# Verificar que ningún slide tiene contenido que desborda 1280×720
```

- [ ] **Step 14.2: Verificar accesibilidad básica**

Inspeccionar el HTML (DevTools). Cada `<section class="slide-container">` debe tener `aria-label`. Iconos decorativos deben tener `aria-hidden="true"`. No debe haber errores en consola.

- [ ] **Step 14.3: Añadir entrada en `log-prompts.md`**

Si el fichero no existe, crearlo. Añadir al final:

```markdown
### [2026-05-24 HH:mm] | PROMPT: crear presentación hub-ecityclic (pitch dirección, estrategia Hub Gestiona Avanza Cataluña) | RESULT: hub-ecityclic/index.html (11 slides, marca ecityclic + badge Gestiona), index.html (tarjeta), _sources/hub-ecityclic/ (PDFs movidos), docs/superpowers/{specs,plans}/2026-05-24-hub-ecityclic-*.md
```

(Reemplazar `HH:mm` por la hora real al ejecutar.)

- [ ] **Step 14.4: Commit final agrupado (opcional, pedir confirmación a Ricardo)**

```bash
git add log-prompts.md docs/superpowers/
git commit -m "docs(hub-ecityclic): spec, plan y entrada de log"
```

---

## Definition of Done — checklist global

- [ ] `hub-ecityclic/index.html` con 11 slides navegables con teclado.
- [ ] `<body data-brand="ecityclic">` aplicado.
- [ ] Co-marketing Gestiona presente (badge en slide 6 + menciones en slides 7, 8).
- [ ] Tarjeta de enlace en `index.html` raíz funciona.
- [ ] PDFs movidos a `_sources/hub-ecityclic/`.
- [ ] Verificado en navegador (Chrome o Firefox) en `http://localhost:8080/hub-ecityclic/`.
- [ ] Entrada en `log-prompts.md`.
- [ ] Sin errores en consola del navegador.
- [ ] Sin nuevas dependencias npm. Sin frameworks.
