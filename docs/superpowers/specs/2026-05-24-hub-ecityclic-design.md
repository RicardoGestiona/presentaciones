# Spec — Presentación `hub-ecityclic`

**Fecha**: 2026-05-24
**Autor**: Ricardo + Claude
**Estado**: Borrador para revisión

---

## 1. Contexto

Presentación HTML corporativa para pitch ejecutivo dirigido a la **Dirección de esPublico**. Objetivos combinados:

1. **Validar la estrategia** del Hub de transformación digital "Gestiona Avanza" en Cataluña.
2. **Aprobar el proyecto y los recursos** necesarios para su puesta en marcha (incluye gap detectado en equipo Lleida).

Fuentes:

- `hub-ecityclic/Análisis reunión Lleida 22.05.2026.pdf` — contexto, SOTA, análisis de situación, posibles usos.
- `hub-ecityclic/DINAMIZACIÓN ESPACIOS ECITYCLIC.pdf` — catálogo de acciones, objetivos cuantitativos, estrategia de comunicación, fases I-II.

---

## 2. Marca y co-marketing

- **Marca primaria del deck**: `ecityclic` (verde lima `#7fb927`, Pantone 376) — refleja la identidad espacial (las oficinas).
- **Marca secundaria**: `gestiona` (azul petróleo `#006d85`) — el producto formado ("Gestiona Avanza").
- **Implementación**: `<body data-brand="ecityclic">` a nivel deck. En slides de catálogo y objetivos donde se referencia explícitamente el producto Gestiona, usar badge `.badge-gestiona` y/o `data-brand="gestiona"` a nivel `<section>` si el slide es 100 % producto. Nunca asumir Gestiona por defecto.

---

## 3. Arquitectura técnica

- Stack: HTML/CSS/JS puro. Sin build. Importa `../assets/css/corporate.css` y `../assets/js/navigation.js`.
- Slides 1280×720 px.
- Revelación progresiva (`.phase[data-phase]`) en slides con listas largas (insights Lleida, objetivos).
- Ubicación: `hub-ecityclic/index.html`.
- Tarjeta de enlace en `index.html` raíz (sección presentaciones).

---

## 4. Storyline — 11 slides

| # | Slide | Layout principal | Contenido clave |
|---|---|---|---|
| 1 | Portada | `title-layout` | "Hub de transformación digital · *Gestiona Avanza*" / "Estrategia 2026-2027 · Cataluña" |
| 2 | Contexto y SOTA | `section-title-layout` + `bullet-list` | Empresa referente AAPP · red oficinas versátiles · reto: dar contenido + transformar en espacio referencia · diversidad perfiles |
| 3 | El problema | `highlight-box` + texto centrado | "Dar sentido de país a las oficinas ecityclic" + tensión: usuarios piden capacitación real que AOC/Diputaciones no dan |
| 4 | Visión — Usuario en el centro | `tile-triple` | POR (compartir éxito/práctica) · CON (co-diseño/laboratorios) · PARA (acompañamiento/valor) |
| 5 | Insights reunión Lleida | `two-column` Q&A | Champions = Consells comarcales + certificados · Incentivo = reconocimiento profesional · Barrera "proveedor → socio institucional" (amenaza) · Hibridación por perfil |
| 6 | Catálogo de acciones | `tiled-content` 2×3 | 6 acciones: formación avanzada · novedades · lab provincial · lab autonómico · desayunos expertos · partners (Fractal, AGTIC) |
| 7 | Objetivos cuantitativos | `feature-cards` | 100 capacitados avanzado · 200 jornadas novedades · 100 labs/terceros · 1 ecosistema/comunidad |
| 8 | Estrategia de comunicación | `step-cards` numerados | Certificados como palanca · Comercial+medios · Evento inauguración · Newsletter Gestiona Avanza (vCAT) |
| 9 | Fase I — Definición e impulso (2026) | `two-column` por trimestre | 2T-3T: Consells+certificados (validar modelo) / 3T-4T: usuarios Gestiona (programas formación) |
| 10 | Fase II — Ampliación (2027) | `two-column` por trimestre | 1T-2T: provinciales + labs + desayunos / 3T-4T: instituciones e-admin + partners |
| 11 | Decisión / próximos pasos | `title-layout` + `highlight-box` | Validación estrategia · Aprobación presupuesto · Recursos equipo Lleida (gap identificado) |

---

## 5. Componentes y estilos a reutilizar

Todo del sistema corporativo (`corporate.css`). Cero CSS hardcoded de colores.

- **Layouts**: `title-layout`, `section-title-layout`, `tile-triple`, `tiled-content`, `two-column`, `feature-cards`, `step-cards`.
- **Componentes**: `bullet-list`, `highlight-box`, `icon-circle`, `card`, `badge-gestiona`, `accent-line`.
- **Iconos Font Awesome 6.5.1**: usuarios, network, lightbulb, graduation-cap, flask, handshake, chart-line, calendar, building, bullhorn.

---

## 6. Reglas y restricciones

1. Idioma: contenido visible en **español**; clases/IDs en **inglés**.
2. Accesibilidad: cada `<section>` con `aria-label`; iconos decorativos con `aria-hidden="true"`.
3. No tocar `corporate.css` ni `navigation.js`. CSS específico inline si hace falta.
4. No introducir frameworks ni librerías npm.
5. Sin `console.log` ni dependencias externas más allá de Google Fonts + Font Awesome CDN.
6. Material fuente (`.pdf`) se mueve a `_sources/hub-ecityclic/` (ya ignorado por git según `.gitignore` y AGENTS.md §5.10). No debe quedar ningún PDF dentro de `hub-ecityclic/`.

---

## 7. Definición de Hecho

- [ ] `hub-ecityclic/index.html` renderiza 11 slides navegables con teclado.
- [ ] `data-brand="ecityclic"` aplicado en `<body>`.
- [ ] Co-marketing Gestiona en slides 6, 7, 8 (badges/menciones explícitas).
- [ ] Tarjeta de enlace añadida en `index.html` raíz.
- [ ] Validado en `npx serve . -l 8080` en Chrome y Firefox.
- [ ] Entrada en `log-prompts.md`.
- [ ] Material fuente `.pdf` movido a `_sources/hub-ecityclic/`.

---

## 8. Fuera de alcance

- Versión exportable PDF/PPTX (puede hacerse posteriormente con script aparte tipo `certificacion-inap/.tools/`).
- Personalización por audiencia distinta a Dirección esPublico.
- Traducción al catalán.
- Métricas reales de baseline (los números 100/200/100 son objetivos de diseño, no proyecciones).
