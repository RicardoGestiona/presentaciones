# Presentació APDCAT Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir `apdcat/index.html`, un deck HTML de 16 slides bajo marca ecityclic y en catalán, que combina credenciales corporativas, filosofía de evolución de producto y arquitectura de interoperabilidad para la Autoritat Catalana de Protecció de Dades.

**Architecture:** Un único fichero HTML estático de 16 `<section class="slide-container">` que importa el sistema de diseño compartido vía `../assets/`. Sin build, sin npm, sin frameworks. Los estilos específicos del deck viven en un único `<style>` inline en el `<head>`; el sistema compartido no se toca. La navegación y la paginación las inyecta `navigation.js` automáticamente.

**Tech Stack:** HTML5, CSS3 (custom properties de `corporate.css`), Font Awesome 6.5.1 (CDN), Roboto (Google Fonts). Verificación con `npx serve` y un script de comprobación estructural en Python 3 (stdlib).

## Global Constraints

Estas reglas aplican a **todas** las tareas. Vienen de `AGENTS.md` §5 y del spec.

- Marca: `<body data-brand="ecityclic">`. Ningún slide sobrescribe `data-brand`.
- Idioma: `<html lang="ca">`. Todo el contenido visible en **catalán**. Clases CSS, identificadores y comentarios en **inglés**.
- Nunca copiar ni modificar `assets/css/corporate.css` ni `assets/js/navigation.js`.
- Nunca hardcodear colores. Usar siempre las custom properties (`var(--color-primary)`, `var(--color-text-muted)`, etc.).
- Reutilizar clases existentes de `corporate.css`. Solo añadir CSS inline cuando ninguna clase existente sirva.
- Cada `<section class="slide-container">` lleva `aria-label` descriptivo.
- Todo icono decorativo lleva `aria-hidden="true"`.
- Slides de 1280×720 px. Si el contenido desborda, redistribuir — **nunca** escalar ni cambiar dimensiones.
- Cifras corporativas: vigentes según confirmación del usuario de 2026-07-28. No inventar cifras nuevas.
- Prohibido inventar hitos de roadmap con fecha o compromisos de versión.
- Commits en inglés, siguiendo el patrón `feat(apdcat): …` del repositorio.

---

## Estructura de ficheros

| Fichero | Responsabilidad | Acción |
|---|---|---|
| `apdcat/index.html` | El deck completo, 16 slides | Crear |
| `index.html` (raíz) | Índice de presentaciones del repo | Modificar: añadir tarjeta |
| `_sources/apdcat/` | Material fuente original (gitignored) | Crear y poblar |
| `APDCAT/` | Ubicación provisional del material | Eliminar tras el movimiento |

Un solo fichero de deck es lo correcto aquí: es el patrón establecido en todo el
repositorio (`certificaciones-gestiona-avanza/index.html`, `kickoff-caag/index.html`…),
y partirlo rompería la navegación, que asume todos los slides en un mismo `<main>`.

---

## Nota sobre el enfoque de verificación

Este repositorio no tiene framework de tests ni suite automatizada — es HTML estático.
El ciclo test-first se sustituye por un **script de comprobación estructural** que se
escribe en la Tarea 1 y se ejecuta al final de cada tarea posterior. El script es una
herramienta de desarrollo temporal: vive en el directorio de scratch, **no se commitea**.

La verificación visual (que nada desborde 720 px de alto) es manual en navegador y está
recogida en la Tarea 7.

Ruta del script en todas las tareas: `/tmp/apdcat-check.py`

---

### Task 1: Scaffolding, material fuente y script de verificación

Deja el deck creado con la portada funcionando y el arnés de verificación en marcha.
Se agrupa todo porque ninguna de las tres piezas es revisable por separado: el script
no tiene qué comprobar sin el HTML, y el HTML no se puede validar sin el script.

**Files:**
- Create: `apdcat/index.html`
- Create: `_sources/apdcat/` (mover 4 ficheros desde `APDCAT/`)
- Create: `/tmp/apdcat-check.py` (no se commitea)

**Interfaces:**
- Consumes: nada.
- Produces: el fichero `apdcat/index.html` con `<main role="presentation">` conteniendo el slide 1. Las tareas 2-6 añaden secciones **antes** del cierre `</main>`, en orden. El script `/tmp/apdcat-check.py` acepta un argumento entero: el número de slides esperado.

- [ ] **Step 1: Mover el material fuente fuera del árbol versionado**

`AGENTS.md` regla 10 exige que el material fuente viva en `_sources/`, que está en
`.gitignore`. Así los `.pptx` de 7 MB y 5 MB no entran nunca al repositorio.

```bash
cd /Users/ricardoespublico/Documents/proyectos-espublico/presentaciones
mkdir -p _sources/apdcat
mv APDCAT/*.pptx APDCAT/*.docx APDCAT/*.html _sources/apdcat/
rmdir APDCAT
ls _sources/apdcat/
```

Esperado: los 4 ficheros listados, y `APDCAT/` ya no existe.

- [ ] **Step 2: Escribir el script de verificación estructural**

Crear `/tmp/apdcat-check.py`:

```python
#!/usr/bin/env python3
"""Structural checks for the APDCAT deck. Usage: apdcat-check.py <expected_slide_count>"""
import re
import sys

PATH = "apdcat/index.html"
expected = int(sys.argv[1])
html = open(PATH, encoding="utf-8").read()
failures = []

sections = re.findall(r'<section class="slide-container"[^>]*>', html)
if len(sections) != expected:
    failures.append(f"slide count: expected {expected}, found {len(sections)}")

without_label = [s for s in sections if "aria-label=" not in s]
if without_label:
    failures.append(f"{len(without_label)} slide(s) missing aria-label: {without_label}")

if 'data-brand="ecityclic"' not in html:
    failures.append('missing data-brand="ecityclic" on <body>')

if '<html lang="ca">' not in html:
    failures.append('missing <html lang="ca">')

if "../assets/css/corporate.css" not in html:
    failures.append("missing corporate.css import")

if "../assets/js/navigation.js" not in html:
    failures.append("missing navigation.js import")

# Hardcoded colours: hex literals and rgb() outside of rgba() alpha overlays,
# which corporate.css itself uses for glass surfaces.
body = html.split("</head>", 1)[1] if "</head>" in html else html
for hexcolor in re.findall(r"#[0-9a-fA-F]{3,8}\b", body):
    failures.append(f"hardcoded colour in body: {hexcolor}")

# Font Awesome icons must be aria-hidden.
for icon in re.findall(r"<i class=\"fa-[^\"]*\"[^>]*>", html):
    if 'aria-hidden="true"' not in icon:
        failures.append(f"icon missing aria-hidden: {icon}")

if failures:
    print(f"FAIL ({len(failures)} issue(s)):")
    for f in failures:
        print(f"  - {f}")
    sys.exit(1)

print(f"PASS: {len(sections)} slides, all structural checks green")
```

- [ ] **Step 3: Ejecutar el script para verificar que falla**

```bash
python3 /tmp/apdcat-check.py 1
```

Esperado: FAIL con `FileNotFoundError` — `apdcat/index.html` todavía no existe.

- [ ] **Step 4: Crear el deck con la portada**

Crear `apdcat/index.html`. El bloque `<style>` contiene los tres ajustes que las
clases existentes no cubren, y solo esos:

```html
<!DOCTYPE html>
<html lang="ca">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>APDCAT — ecityclic esPublico</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="../assets/css/corporate.css">
    <style>
        /* Deck-specific adjustments. Everything else comes from corporate.css. */

        /* Six figures in a 3x2 grid: .tiled-content is 2x2 by default. */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
            width: 100%;
        }
        .stat-tile {
            background: var(--color-bg-light);
            border-radius: var(--radius-md);
            border-top: 4px solid var(--color-primary);
            padding: 22px 24px;
            text-align: center;
        }
        .stat-tile .stat-figure {
            font-size: 2.4rem;
            font-weight: 700;
            color: var(--color-primary);
            line-height: 1.1;
        }
        .stat-tile .stat-label {
            font-size: 0.95rem;
            color: var(--color-text-muted);
            margin-top: 6px;
        }

        /* Compact chips for dense enumerations (modules, common services). */
        .chip-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 14px 18px;
            width: 100%;
        }
        .chip-grid--wide {
            grid-template-columns: repeat(4, 1fr);
        }
        .chip {
            display: flex;
            align-items: center;
            gap: 10px;
            background: var(--color-bg-light);
            border-left: 3px solid var(--color-primary);
            border-radius: var(--radius-sm);
            padding: 12px 14px;
            font-size: 0.92rem;
            color: var(--color-text-body);
        }
        .chip i {
            color: var(--color-primary);
            font-size: 1rem;
            flex-shrink: 0;
        }

        /* .step-cards is a nowrap flex; eight steps need two rows. */
        .step-cards--wrap {
            flex-wrap: wrap;
        }
        .step-cards--wrap .step-card {
            flex: 0 0 calc(25% - 21px);
        }

        /* Four feature cards need tighter padding than the default three. */
        .feature-cards--quad .feature-card {
            padding: 24px 20px;
        }
        .feature-cards--quad .feature-card h3 {
            font-size: 1.05rem;
        }
        .feature-cards--quad .feature-card p {
            font-size: 0.88rem;
        }
    </style>
</head>
<body data-brand="ecityclic">
<main role="presentation">

    <!-- 1. PORTADA -->
    <section class="slide-container" aria-label="Portada">
        <div class="title-layout">
            <h1>Impulsem la <span>transformació digital</span></h1>
            <p class="subtitle">Solucions digitals innovadores per a entitats transformadores</p>
            <hr class="accent-line mt-md mb-sm" aria-hidden="true">
            <p class="text-sm text-muted">Autoritat Catalana de Protecció de Dades · Juliol 2026</p>
        </div>
    </section>

</main>
<script src="../assets/js/navigation.js"></script>
</body>
</html>
```

- [ ] **Step 5: Ejecutar el script para verificar que pasa**

```bash
python3 /tmp/apdcat-check.py 1
```

Esperado: `PASS: 1 slides, all structural checks green`

- [ ] **Step 6: Commit**

```bash
git add apdcat/index.html
git commit -m "feat(apdcat): scaffold deck with ecityclic branding and cover slide

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 2: Bloc 1 — Qui som (slides 2-3)

**Files:**
- Modify: `apdcat/index.html` (insertar antes de `</main>`)

**Interfaces:**
- Consumes: las clases `.stats-grid`, `.stat-tile`, `.chip-grid` definidas en el `<style>` de la Tarea 1.
- Produces: slides 2 y 3. La tarea 3 inserta a continuación.

- [ ] **Step 1: Verificar el estado de partida**

```bash
python3 /tmp/apdcat-check.py 1
```

Esperado: PASS con 1 slide. Si falla, la Tarea 1 no está completa.

- [ ] **Step 2: Añadir los slides 2 y 3**

Insertar justo antes de `</main>`:

```html
    <!-- 2. EL GRUP EN XIFRES -->
    <section class="slide-container" aria-label="El grup en xifres">
        <h2 class="slide-title">El grup en xifres</h2>
        <div class="content-area">
            <div class="stats-grid">
                <div class="stat-tile">
                    <div class="stat-figure">7.300</div>
                    <div class="stat-label">Administracions clients</div>
                </div>
                <div class="stat-tile">
                    <div class="stat-figure">510</div>
                    <div class="stat-label">Persones a l'equip</div>
                </div>
                <div class="stat-tile">
                    <div class="stat-figure">&gt;190K</div>
                    <div class="stat-label">Usuaris de Gestiona</div>
                </div>
                <div class="stat-tile">
                    <div class="stat-figure">&gt;79M</div>
                    <div class="stat-label">Signatures electròniques a l'any</div>
                </div>
                <div class="stat-tile">
                    <div class="stat-figure">6 PB</div>
                    <div class="stat-label">Allotjament i custòdia</div>
                </div>
                <div class="stat-tile">
                    <div class="stat-figure">&gt;65M€</div>
                    <div class="stat-label">Facturació recurrent</div>
                </div>
            </div>
            <div class="highlight-box mt-md">
                <p><strong>Primer operador tecnològic del sector públic:</strong> punt de presència (PdP) de la Xarxa SARA i més de 900 integracions desplegades en client.</p>
            </div>
        </div>
    </section>

    <!-- 3. MAPA DE SOLUCIONS -->
    <section class="slide-container" aria-label="Mapa de solucions">
        <h2 class="slide-title">Un portfolio complet</h2>
        <div class="content-area">
            <div class="chip-grid chip-grid--wide">
                <div class="chip"><i class="fa-solid fa-folder-open" aria-hidden="true"></i> Gestió d'Expedients</div>
                <div class="chip"><i class="fa-solid fa-inbox" aria-hidden="true"></i> Registre General</div>
                <div class="chip"><i class="fa-solid fa-signature" aria-hidden="true"></i> Signatura Electrònica</div>
                <div class="chip"><i class="fa-solid fa-globe" aria-hidden="true"></i> Seu Electrònica</div>
                <div class="chip"><i class="fa-solid fa-box-archive" aria-hidden="true"></i> Arxiu Electrònic</div>
                <div class="chip"><i class="fa-solid fa-shield-halved" aria-hidden="true"></i> Control Intern</div>
                <div class="chip"><i class="fa-solid fa-users-rectangle" aria-hidden="true"></i> Gestió d'Òrgans</div>
                <div class="chip"><i class="fa-solid fa-book" aria-hidden="true"></i> Llibres Oficials</div>
                <div class="chip"><i class="fa-solid fa-address-book" aria-hidden="true"></i> Padró d'Habitants</div>
                <div class="chip"><i class="fa-solid fa-calculator" aria-hidden="true"></i> Sistema Comptable</div>
                <div class="chip"><i class="fa-solid fa-coins" aria-hidden="true"></i> Oficina Virtual Tributària</div>
                <div class="chip"><i class="fa-solid fa-map-location-dot" aria-hidden="true"></i> Territori</div>
                <div class="chip"><i class="fa-solid fa-user-tie" aria-hidden="true"></i> Nòmina i RRHH</div>
                <div class="chip"><i class="fa-solid fa-file-contract" aria-hidden="true"></i> Contractació</div>
                <div class="chip"><i class="fa-solid fa-chart-line" aria-hidden="true"></i> Analítica</div>
                <div class="chip"><i class="fa-solid fa-comments" aria-hidden="true"></i> Eines de Comunicació</div>
                <div class="chip"><i class="fa-solid fa-headset" aria-hidden="true"></i> Oficina d'Assistència</div>
                <div class="chip"><i class="fa-solid fa-cubes" aria-hidden="true"></i> Eines d'Integració</div>
            </div>
        </div>
    </section>
```

- [ ] **Step 3: Verificar**

```bash
python3 /tmp/apdcat-check.py 3
```

Esperado: `PASS: 3 slides, all structural checks green`

- [ ] **Step 4: Commit**

```bash
git add apdcat/index.html
git commit -m "feat(apdcat): add corporate figures and portfolio map slides

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 3: Bloc 2 — Com evoluciona el producte (slides 4-6)

Este es el bloque solicitado expresamente por el usuario. **Sin hitos con fecha ni
compromisos de versión futuros:** el eje temporal del slide 6 es exclusivamente
histórico (hechos ya ocurridos), y el cierre proyecta dirección sin comprometer plazos.

**Files:**
- Modify: `apdcat/index.html` (insertar antes de `</main>`)

**Interfaces:**
- Consumes: `.feature-cards--quad` del `<style>` de la Tarea 1.
- Produces: slides 4, 5 y 6.

- [ ] **Step 1: Verificar el estado de partida**

```bash
python3 /tmp/apdcat-check.py 3
```

Esperado: PASS con 3 slides.

- [ ] **Step 2: Añadir los slides 4, 5 y 6**

Insertar justo antes de `</main>`:

```html
    <!-- 4. SEPARADOR: COM EVOLUCIONA EL PRODUCTE -->
    <section class="slide-container" aria-label="Separador: com evoluciona el producte">
        <div class="section-title-layout">
            <h2>Com evoluciona el producte</h2>
            <hr aria-hidden="true">
            <p class="subtitle">La nostra filosofia d'evolució: un sol producte, sempre en moviment</p>
        </div>
    </section>

    <!-- 5. FILOSOFIA DE PRODUCTE -->
    <section class="slide-container" aria-label="Filosofia de producte">
        <h2 class="slide-title">Filosofia de producte</h2>
        <div class="content-area" style="align-items: center;">
            <div class="feature-cards feature-cards--quad">
                <div class="feature-card">
                    <div class="icon-circle icon-circle--lg mx-auto">
                        <i class="fa-solid fa-layer-group" aria-hidden="true"></i>
                    </div>
                    <h3>Un sol producte</h3>
                    <p>Totes les entitats treballen sobre la mateixa versió en SaaS. Cap desenvolupament a mida que faci divergir el producte.</p>
                </div>
                <div class="feature-card">
                    <div class="icon-circle icon-circle--lg mx-auto">
                        <i class="fa-solid fa-plug-circle-check" aria-hidden="true"></i>
                    </div>
                    <h3>Compatibilitat garantida</h3>
                    <p>L'API evoluciona amb control de compatibilitat i gestió de canvis comunicada a totes les parts interessades. Les integracions no es trenquen.</p>
                </div>
                <div class="feature-card">
                    <div class="icon-circle icon-circle--lg mx-auto">
                        <i class="fa-solid fa-compass" aria-hidden="true"></i>
                    </div>
                    <h3>Evolució guiada</h3>
                    <p>Prioritzem segons la normativa vigent i les necessitats reals d'una comunitat de 7.300 administracions.</p>
                </div>
                <div class="feature-card">
                    <div class="icon-circle icon-circle--lg mx-auto">
                        <i class="fa-solid fa-key" aria-hidden="true"></i>
                    </div>
                    <h3>Autonomia de l'entitat</h3>
                    <p>No deixem implantada cap funcionalitat que l'entitat no pugui mantenir de manera autònoma, sense dependre de nosaltres.</p>
                </div>
            </div>
            <div class="highlight-box mt-md">
                <p><strong>Marc normatiu que guia l'evolució:</strong> Lleis 39/2015 i 40/2015, Reial Decret 203/2021, Esquema Nacional de Seguretat i Esquema Nacional d'Interoperabilitat.</p>
            </div>
        </div>
    </section>

    <!-- 6. EVOLUCIÓ SOSTINGUDA -->
    <section class="slide-container" aria-label="Evolució sostinguda">
        <div class="section-title-layout">
            <h2>Evolució sostinguda</h2>
            <hr aria-hidden="true">
            <p class="subtitle">Una dècada ampliant la capacitat d'integració</p>
            <div class="step-cards mt-lg">
                <div class="step-card">
                    <div class="step-number">2014</div>
                    <p>Consultoria funcional</p>
                </div>
                <div class="step-card">
                    <div class="step-number">2016</div>
                    <p>OTP Gestiona</p>
                </div>
                <div class="step-card">
                    <div class="step-number">2020</div>
                    <p>Factory Gestiona</p>
                </div>
                <div class="step-card">
                    <div class="step-number">2025</div>
                    <p>Gestiona for developers</p>
                </div>
            </div>
            <p class="text-sm text-white mt-md text-center">L'API creix de manera contínua amb nous serveis: població, territori, comptabilitat, tributària i nòmina.</p>
        </div>
    </section>
```

- [ ] **Step 3: Verificar**

```bash
python3 /tmp/apdcat-check.py 6
```

Esperado: `PASS: 6 slides, all structural checks green`

- [ ] **Step 4: Commit**

```bash
git add apdcat/index.html
git commit -m "feat(apdcat): add product evolution philosophy block

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 4: Bloc 3 — Interoperabilitat i compliment (slides 7-9)

El slide 9 es el que dirige el deck a APDCAT específicamente. Precisión terminológica
obligatoria: el reglamento eIDAS es el **UE 910/2014** (el deck fuente de AMB contiene
una errata, «914/2014»; no reproducirla).

**Files:**
- Modify: `apdcat/index.html` (insertar antes de `</main>`)

**Interfaces:**
- Consumes: `.chip-grid` y `.feature-cards--quad` del `<style>` de la Tarea 1.
- Produces: slides 7, 8 y 9.

- [ ] **Step 1: Verificar el estado de partida**

```bash
python3 /tmp/apdcat-check.py 6
```

Esperado: PASS con 6 slides.

- [ ] **Step 2: Añadir los slides 7, 8 y 9**

Insertar justo antes de `</main>`:

```html
    <!-- 7. SEPARADOR: INTEROPERABILITAT I COMPLIMENT -->
    <section class="slide-container" aria-label="Separador: interoperabilitat i compliment">
        <div class="section-title-layout">
            <h2>Interoperabilitat i compliment</h2>
            <hr aria-hidden="true">
            <p class="subtitle">Connectats de manera nativa amb els serveis comuns de l'Administració</p>
        </div>
    </section>

    <!-- 8. INTEROPERABILITAT NATIVA -->
    <section class="slide-container" aria-label="Interoperabilitat nativa amb els serveis comuns">
        <h2 class="slide-title">Interoperabilitat nativa</h2>
        <div class="content-area">
            <div class="chip-grid">
                <div class="chip"><i class="fa-solid fa-list-check" aria-hidden="true"></i> Catàleg de procediments</div>
                <div class="chip"><i class="fa-solid fa-id-card" aria-hidden="true"></i> Identificació de l'interessat</div>
                <div class="chip"><i class="fa-solid fa-user-shield" aria-hidden="true"></i> Gestió de la representació</div>
                <div class="chip"><i class="fa-solid fa-magnifying-glass-chart" aria-hidden="true"></i> Verificació de dades</div>
                <div class="chip"><i class="fa-solid fa-bullhorn" aria-hidden="true"></i> Publicació</div>
                <div class="chip"><i class="fa-solid fa-envelope-open-text" aria-hidden="true"></i> Notificacions i comunicacions</div>
                <div class="chip"><i class="fa-solid fa-right-left" aria-hidden="true"></i> Sistema d'intercanvis de registres</div>
                <div class="chip"><i class="fa-solid fa-folder-tree" aria-hidden="true"></i> Consulta i tramesa d'expedients</div>
                <div class="chip"><i class="fa-solid fa-handshake" aria-hidden="true"></i> Relació amb els proveïdors</div>
            </div>
            <div class="highlight-box mt-md">
                <p><strong>Punt de Presència (PdP) de la Xarxa SARA:</strong> més de 7.000 administracions públiques integrades amb els serveis de l'Administració General de l'Estat.</p>
            </div>
        </div>
    </section>

    <!-- 9. SEGURETAT I PROTECCIÓ DE DADES -->
    <section class="slide-container" aria-label="Seguretat i protecció de dades">
        <h2 class="slide-title">Seguretat i protecció de dades</h2>
        <div class="content-area" style="align-items: center;">
            <div class="feature-cards feature-cards--quad">
                <div class="feature-card">
                    <div class="icon-circle icon-circle--lg mx-auto">
                        <i class="fa-solid fa-user-lock" aria-hidden="true"></i>
                    </div>
                    <h3>RGPD</h3>
                    <p>Actuem com a encarregat del tractament, amb les garanties i els compromisos contractuals que això comporta.</p>
                </div>
                <div class="feature-card">
                    <div class="icon-circle icon-circle--lg mx-auto">
                        <i class="fa-solid fa-certificate" aria-hidden="true"></i>
                    </div>
                    <h3>Certificacions</h3>
                    <p>ENS categoria Alta, Esquema Nacional d'Interoperabilitat i ITIL. Més enllà del compliment estricte, defineixen els nostres protocols.</p>
                </div>
                <div class="feature-card">
                    <div class="icon-circle icon-circle--lg mx-auto">
                        <i class="fa-solid fa-stamp" aria-hidden="true"></i>
                    </div>
                    <h3>Serveis de confiança</h3>
                    <p>Prestador de Serveis de Confiança Qualificats segons el Reglament UE 910/2014 (eIDAS) i la llei de signatura electrònica.</p>
                </div>
                <div class="feature-card">
                    <div class="icon-circle icon-circle--lg mx-auto">
                        <i class="fa-solid fa-clipboard-list" aria-hidden="true"></i>
                    </div>
                    <h3>Traçabilitat</h3>
                    <p>Tota acció feta a través de l'API queda registrada i certificada, amb les mateixes garanties que les fetes per un usuari.</p>
                </div>
            </div>
        </div>
    </section>
```

- [ ] **Step 3: Verificar**

```bash
python3 /tmp/apdcat-check.py 9
```

Esperado: `PASS: 9 slides, all structural checks green`

- [ ] **Step 4: Verificar que no se ha colado la errata del deck fuente**

```bash
grep -c "914/2014" apdcat/index.html || echo "OK: no typo present"
```

Esperado: `OK: no typo present`

- [ ] **Step 5: Commit**

```bash
git add apdcat/index.html
git commit -m "feat(apdcat): add interoperability and data protection block

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 5: Bloc 4 — Arquitectura d'integració (slides 10-14)

Es el bloque más denso. El slide 12 y el 14 usan revelación progresiva `.phase` para
marcar el ritmo del discurso; el resto aparece completo.

**Files:**
- Modify: `apdcat/index.html` (insertar antes de `</main>`)

**Interfaces:**
- Consumes: `.feature-cards--quad` del `<style>` de la Tarea 1; las clases canónicas `.phase`, `.phase--slide-left`, `.phase--slide-right` de `corporate.css`.
- Produces: slides 10 a 14.

- [ ] **Step 1: Verificar el estado de partida**

```bash
python3 /tmp/apdcat-check.py 9
```

Esperado: PASS con 9 slides.

- [ ] **Step 2: Añadir los slides 10, 11 y 12**

Insertar justo antes de `</main>`:

```html
    <!-- 10. SEPARADOR: ARQUITECTURA D'INTEGRACIÓ -->
    <section class="slide-container" aria-label="Separador: arquitectura d'integració">
        <div class="section-title-layout">
            <h2>Arquitectura d'integració</h2>
            <hr aria-hidden="true">
            <p class="subtitle">Una arquitectura oberta i dissenyada per connectar-se a tot</p>
        </div>
    </section>

    <!-- 11. LA NOSTRA API REST -->
    <section class="slide-container" aria-label="La nostra API REST">
        <h2 class="slide-title">La nostra API REST</h2>
        <div class="content-area" style="align-items: center;">
            <div class="feature-cards feature-cards--quad">
                <div class="feature-card">
                    <div class="icon-circle icon-circle--lg mx-auto">
                        <i class="fa-solid fa-bolt" aria-hidden="true"></i>
                    </div>
                    <h3>Potent</h3>
                    <p>219 recursos agrupats en 46 espais, amb creixement continu de nous serveis.</p>
                </div>
                <div class="feature-card">
                    <div class="icon-circle icon-circle--lg mx-auto">
                        <i class="fa-solid fa-book-open" aria-hidden="true"></i>
                    </div>
                    <h3>Documentada</h3>
                    <p>Interfície publicada amb exemples de cada cas d'ús i codi d'exemple a GitHub.</p>
                </div>
                <div class="feature-card">
                    <div class="icon-circle icon-circle--lg mx-auto">
                        <i class="fa-solid fa-gift" aria-hidden="true"></i>
                    </div>
                    <h3>Gratuïta</h3>
                    <p>Sense cost addicional per l'ús de l'API ni per les integracions que hi desenvolupeu.</p>
                </div>
                <div class="feature-card">
                    <div class="icon-circle icon-circle--lg mx-auto">
                        <i class="fa-solid fa-headset" aria-hidden="true"></i>
                    </div>
                    <h3>Amb suport</h3>
                    <p>Servei de suport a desenvolupadors per acompanyar cada integració.</p>
                </div>
            </div>
            <div class="highlight-box mt-md">
                <p><strong>Desacoblada de l'aplicació web:</strong> en cas d'atac o col·lapse de l'API, els usuaris finals de Gestiona no en resulten afectats.</p>
            </div>
        </div>
    </section>

    <!-- 12. LES SET CARACTERÍSTIQUES DE L'API -->
    <section class="slide-container" aria-label="Les set característiques de l'API">
        <h2 class="slide-title">Set característiques que la defineixen</h2>
        <div class="content-area">
            <div class="two-column">
                <ul class="bullet-list">
                    <li class="phase" data-phase="1"><i class="fa-solid fa-circle-check" aria-hidden="true"></i> <strong>Completa.</strong> Permet executar qualsevol operació que es pot fer des de la web.</li>
                    <li class="phase" data-phase="2"><i class="fa-solid fa-circle-check" aria-hidden="true"></i> <strong>Adaptable.</strong> Operacions síncrones, asíncrones o processos batch, segons el problema.</li>
                    <li class="phase" data-phase="3"><i class="fa-solid fa-circle-check" aria-hidden="true"></i> <strong>Documentada.</strong> Serveis REST publicats amb exemples per cas d'ús.</li>
                    <li class="phase" data-phase="4"><i class="fa-solid fa-circle-check" aria-hidden="true"></i> <strong>Oberta.</strong> Comunica Gestiona amb totes les aplicacions de l'organització.</li>
                </ul>
                <ul class="bullet-list">
                    <li class="phase" data-phase="5"><i class="fa-solid fa-circle-check" aria-hidden="true"></i> <strong>Estable.</strong> Control de compatibilitat i gestió de canvis comunicada.</li>
                    <li class="phase" data-phase="6"><i class="fa-solid fa-circle-check" aria-hidden="true"></i> <strong>Segura.</strong> Securitzada amb token d'accés; cada client queda identificat.</li>
                    <li class="phase" data-phase="7"><i class="fa-solid fa-circle-check" aria-hidden="true"></i> <strong>Traçable.</strong> Totes les accions queden recollides i certificades.</li>
                </ul>
            </div>
        </div>
    </section>
```

- [ ] **Step 3: Añadir los slides 13 y 14**

Insertar justo antes de `</main>`:

```html
    <!-- 13. MODEL LOW CODE DE CONNECTORS -->
    <section class="slide-container" aria-label="Model Low Code de connectors">
        <h2 class="slide-title">Desenvolupament àgil de connectors</h2>
        <div class="content-area">
            <div class="two-column">
                <div>
                    <ul class="bullet-list">
                        <li><i class="fa-solid fa-wand-magic-sparkles" aria-hidden="true"></i> <strong>Model Low Code</strong> de desenvolupament de connectors.</li>
                        <li><i class="fa-solid fa-cube" aria-hidden="true"></i> <strong>Abstracció de casos d'ús</strong> mitjançant microserveis al BUS d'interoperabilitat, cadascun amb una funcionalitat completa de negoci.</li>
                        <li><i class="fa-solid fa-gauge-high" aria-hidden="true"></i> <strong>Baix manteniment:</strong> el connector no conté lògica de negoci.</li>
                    </ul>
                </div>
                <div class="card card--bordered">
                    <h3><i class="fa-solid fa-code" aria-hidden="true" style="margin-right: 8px;"></i>Gestiona &lt;CODE&gt;</h3>
                    <p>Executa el teu codi dins de Gestiona de manera segura: programació de formularis amb condicions, variables temporals i càlculs amb la funció LET per emmagatzemar i reutilitzar el resultat.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- 14. FLUXOS DOCUMENTALS I PROCESSOS REGLATS -->
    <section class="slide-container" aria-label="Fluxos documentals i processos reglats">
        <h2 class="slide-title">Dues vies d'integració</h2>
        <div class="content-area">
            <div class="two-column">
                <div class="card card--bordered phase phase--slide-left" data-phase="1">
                    <h3><i class="fa-solid fa-file-signature" aria-hidden="true" style="margin-right: 8px;"></i>Fluxos documentals</h3>
                    <p class="text-sm">La lògica es parametritza en la configuració del circuit, sense programar res: ordre de signatures, càrrecs, rols, signatures de tercers i accions posteriors (llibre oficial, registre de sortida, publicitat).</p>
                    <p class="text-sm mt-sm">El connector només envia el document a través de l'API i invoca el flux.</p>
                </div>
                <div class="card card--bordered phase phase--slide-right" data-phase="1">
                    <h3><i class="fa-solid fa-diagram-project" aria-hidden="true" style="margin-right: 8px;"></i>Processos reglats</h3>
                    <p class="text-sm">Mapeig dels camps que s'envien i es reben del connector amb les dades de l'expedient, amb possibilitat de condicionar el flux del procediment segons els valors rebuts.</p>
                    <p class="text-sm mt-sm">Les tasques es poden configurar perquè s'executin sense intervenció humana.</p>
                </div>
            </div>
            <div class="highlight-box mt-md phase" data-phase="2">
                <p><strong>El principi comú:</strong> permet canviar la lògica de negoci sense canviar la integració. El mateix connector serveix per a qualsevol procediment.</p>
            </div>
        </div>
    </section>
```

- [ ] **Step 4: Verificar**

```bash
python3 /tmp/apdcat-check.py 14
```

Esperado: `PASS: 14 slides, all structural checks green`

- [ ] **Step 5: Commit**

```bash
git add apdcat/index.html
git commit -m "feat(apdcat): add integration architecture block

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 6: Bloc 5 — Com treballem (slides 15-16)

**Files:**
- Modify: `apdcat/index.html` (insertar antes de `</main>`)

**Interfaces:**
- Consumes: `.step-cards--wrap` del `<style>` de la Tarea 1.
- Produces: slides 15 y 16. Cierra el `<main>`; ninguna tarea añade slides después.

- [ ] **Step 1: Verificar el estado de partida**

```bash
python3 /tmp/apdcat-check.py 14
```

Esperado: PASS con 14 slides.

- [ ] **Step 2: Añadir los slides 15 y 16**

Insertar justo antes de `</main>`. Los 8 pasos usan `.step-cards--wrap` para repartirse
en dos filas de 4; `.step-cards` sin la variante es un flex sin wrap y los aplastaría.

```html
    <!-- 15. METODOLOGIA D'INTEGRACIONS -->
    <section class="slide-container" aria-label="Metodologia d'integracions">
        <div class="section-title-layout">
            <h2>Metodologia d'integracions</h2>
            <hr aria-hidden="true">
            <div class="step-cards step-cards--wrap mt-lg">
                <div class="step-card">
                    <div class="step-number">1</div>
                    <p class="phase" data-phase="1">Presentació de la situació inicial</p>
                </div>
                <div class="step-card">
                    <div class="step-number">2</div>
                    <p class="phase" data-phase="1">Estudi de la capa d'integracions i RPA</p>
                </div>
                <div class="step-card">
                    <div class="step-number">3</div>
                    <p class="phase" data-phase="1">Divisió per mòduls i fases</p>
                </div>
                <div class="step-card">
                    <div class="step-number">4</div>
                    <p class="phase" data-phase="1">Abast final definitiu</p>
                </div>
                <div class="step-card">
                    <div class="step-number">5</div>
                    <p class="phase" data-phase="2">Desenvolupament de la integració</p>
                </div>
                <div class="step-card">
                    <div class="step-number">6</div>
                    <p class="phase" data-phase="2">Test tècnic</p>
                </div>
                <div class="step-card">
                    <div class="step-number">7</div>
                    <p class="phase" data-phase="2">Validació funcional a PRE</p>
                </div>
                <div class="step-card">
                    <div class="step-number">8</div>
                    <p class="phase" data-phase="2">Posada en producció</p>
                </div>
            </div>
        </div>
    </section>

    <!-- 16. TANCAMENT -->
    <section class="slide-container" aria-label="Tancament">
        <div class="section-title-layout">
            <h2>T'acompanyem fins on vulguis arribar</h2>
            <hr aria-hidden="true">
            <p class="subtitle">Més de 900 integracions en client ens avalen</p>
            <div class="mt-lg" style="display: flex; gap: 32px;">
                <div class="card--glass">
                    <h3><i class="fa-solid fa-calendar-check" aria-hidden="true" style="margin-right: 8px;"></i>El següent pas</h3>
                    <p>Una reunió tècnica de detall per analitzar els punts d'integració concrets de l'APDCAT.</p>
                </div>
            </div>
        </div>
    </section>
```

- [ ] **Step 3: Verificar**

```bash
python3 /tmp/apdcat-check.py 16
```

Esperado: `PASS: 16 slides, all structural checks green`

- [ ] **Step 4: Commit**

```bash
git add apdcat/index.html
git commit -m "feat(apdcat): add methodology and closing slides

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 7: Registro en el índice y verificación visual final

**Files:**
- Modify: `index.html` (raíz)
- Verify: `apdcat/index.html`

**Interfaces:**
- Consumes: `apdcat/index.html` completo con 16 slides.
- Produces: entregable final.

- [ ] **Step 1: Añadir la tarjeta de la nueva presentación al índice raíz**

En `index.html`, insertar este bloque justo después de la tarjeta de
`certificaciones-gestiona-avanza` (que termina en la línea 141) y antes del `</div>`
de cierre. El markup replica exactamente el patrón de las tarjetas existentes:

```html
        <a class="card--glass card-link" href="./apdcat/">
            <div class="card-icon"><i class="fa-solid fa-shield-halved"></i></div>
            <span class="card-label">ecityclic · Institucional</span>
            <h2>APDCAT</h2>
            <p>Presentación corporativa y arquitectura de interoperabilidad para la Autoritat Catalana de Protecció de Dades.</p>
            <span class="card-arrow">Abrir <i class="fa-solid fa-arrow-right"></i></span>
        </a>
```

Nota: el índice raíz está en castellano; la tarjeta mantiene ese idioma aunque el deck
que enlaza esté en catalán.

- [ ] **Step 2: Comprobar que el índice sigue bien formado**

```bash
grep -c "card-link" index.html
```

Esperado: el recuento previo más uno.

- [ ] **Step 3: Levantar el servidor local**

```bash
npx serve . -l 8080
```

Abrir `http://localhost:8080/apdcat/`.

Nota: el proxy corporativo interfiere con `curl` a localhost. Si se comprueba desde
CLI, usar `curl --noproxy '*' http://localhost:8080/apdcat/`.

- [ ] **Step 4: Recorrer los 16 slides y verificar el desbordamiento**

Con las flechas del teclado, pasar por los 16 slides comprobando en cada uno:

1. Ningún contenido se sale del marco de 1280×720 px ni aparece scroll vertical.
2. El acento visual es verde lima (`#7fb927`, marca ecityclic) y no azul petróleo. Si es azul, `data-brand` no está aplicando.
3. Los bullets de paginación aparecen abajo y son 16.

Prestar atención especial a estos cuatro, que son los de mayor riesgo de desbordar:

- **Slide 3** (18 chips en grid de 4 columnas)
- **Slide 5** y **slide 9** (4 feature cards + highlight box)
- **Slide 15** (8 step cards en dos filas)

Si alguno desborda, **redistribuir el contenido** — reducir texto, pasar a 5 columnas
de chips, acortar descripciones. Nunca escalar ni tocar las dimensiones del slide.

- [ ] **Step 5: Verificar la revelación progresiva**

En los slides 12, 14 y 15, pulsar la flecha derecha repetidamente y confirmar que los
elementos aparecen por fases antes de avanzar al siguiente slide.

- [ ] **Step 6: Ejecutar la comprobación estructural completa**

```bash
python3 /tmp/apdcat-check.py 16
```

Esperado: `PASS: 16 slides, all structural checks green`

- [ ] **Step 7: Confirmar que ningún binario ha entrado al repositorio**

```bash
git status --porcelain
git ls-files | grep -iE "\.(pptx|docx)$" || echo "OK: no binaries tracked"
```

Esperado: `OK: no binaries tracked`, y `git status` sin rastro de `APDCAT/`.

- [ ] **Step 8: Commit final**

```bash
git add index.html apdcat/index.html
git commit -m "feat(apdcat): register presentation in root index

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

- [ ] **Step 9: Limpiar el script temporal**

```bash
rm /tmp/apdcat-check.py
```

---

## Cobertura del spec

| Requisito del spec | Tarea |
|---|---|
| §3 fichero `apdcat/index.html`, imports, marca, lang | 1 |
| §3 registro en índice raíz | 7 |
| §2 material fuente a `_sources/apdcat/` | 1 |
| §4 bloc 1, slides 1-3 | 1, 2 |
| §4 bloc 2, slides 4-6 (filosofía de producto) | 3 |
| §4 bloc 3, slides 7-9 (seguridad y RGPD) | 4 |
| §4 bloc 4, slides 10-14 (arquitectura) | 5 |
| §4 bloc 5, slides 15-16 (metodología y CTA) | 6 |
| §6 criterios de aceptación 1-6, 9-11 | script de verificación + tarea 7 |
| §6 criterios 7-8 (desbordamiento, navegación) | 7, pasos 4-5 |
| §7 verificación en navegador | 7 |
