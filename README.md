# Presentaciones HTML — esPublico Gestiona / esFirma

Plantilla y sistema de presentaciones HTML corporativas. Pensada para uso compartido por un equipo y para colaboración con asistentes (Claude Code, Claude Desktop, Claude Web, ChatGPT u otros LLMs).

**Stack:** HTML/CSS/JS puro · Roboto (Google Fonts) · Font Awesome 6.5.1 (CDN) · sin build, sin dependencias.

**Marcas soportadas:** todo el portfolio esPublico — Gestiona, esFirma, esPublico (matriz), Hacienda Local, RRHH, Videoactas, Tecnología, Sistemas, Drag, ecityclic, Medidata. Cada una con su Pantone oficial ([manual de estilo](https://design.g3stiona.com/recursos-nuevo-espublico/)). Selección con `<body data-brand="<marca>">`. Si la marca no está clara, **el asistente debe preguntar antes de generar**.

---

## Quick start

```bash
# Preview local
npx serve . -l 8080
# Abrir http://localhost:8080/<nombre>/
```

Navegación en presentación:

| Tecla | Acción |
|---|---|
| → ↓ Espacio PageDown | Siguiente |
| ← ↑ PageUp | Anterior |
| Home / End | Primer / último slide |

---

## Estructura

```
presentaciones/
├── README.md                 ← Esta página
├── AGENTS.md                 ← Convenciones canónicas (multi-LLM)
├── LLM-CONTEXT.md            ← Bundle pegable para Claude Web / ChatGPT
├── CLAUDE.md                 ← Notas específicas para Claude Code
├── manual.md                 ← Manual operativo del equipo
├── assets/
│   ├── css/corporate.css     ← Sistema de diseño (paleta + componentes)
│   ├── js/navigation.js      ← Navegación teclado + revelación por fases
│   └── img/                  ← Logos compartidos
├── templates/
│   ├── slide-template.html   ← Plantilla base (8 slides ejemplo)
│   └── showcase.html         ← Demo navegable con todos los layouts
└── <nombre>/index.html       ← Cada presentación
```

Presentaciones actuales: `hackathon/`, `mesa-redonda/`, `formacion/`. La página `index.html` raíz es la landing pública con tarjetas a cada presentación.

---

## Crear nueva presentación

```bash
mkdir mi-presentacion
cp templates/slide-template.html mi-presentacion/index.html
# Editar contenido de slides
# Añadir tarjeta en index.html raíz
```

Reglas:

- Importar siempre `../assets/css/corporate.css` y `../assets/js/navigation.js`.
- Estilos específicos de la presentación → `<style>` inline en su `index.html`.
- UI y comentarios en **español**; clases CSS y variables JS en **inglés**.
- Nada de build system, frameworks ni dependencias npm.

---

## Trabajar con LLMs

Tres formas de uso, tres entradas distintas:

| Herramienta | Lee | Entrada principal |
|---|---|---|
| Claude Code (CLI) | Filesystem completo | `CLAUDE.md` + `AGENTS.md` |
| Claude Desktop / Codex / Cursor (MCP filesystem) | Filesystem completo | `AGENTS.md` |
| Claude Web / ChatGPT / Gemini (paste-only) | Lo que pegues | `LLM-CONTEXT.md` (un solo fichero pegable) |

Para pegar contexto rápido en una conversación web:

1. Abrir [`LLM-CONTEXT.md`](./LLM-CONTEXT.md).
2. Copiar todo. Pegarlo como primer mensaje del chat.
3. Pedir la presentación. El asistente devuelve un `index.html` listo para guardar en un subdirectorio.

---

## Documentación

- [`AGENTS.md`](./AGENTS.md) — convenciones, sistema de diseño, layouts y componentes (canónico).
- [`LLM-CONTEXT.md`](./LLM-CONTEXT.md) — bundle pegable autocontenido.
- [`manual.md`](./manual.md) — manual operativo del equipo.
- [`CLAUDE.md`](./CLAUDE.md) — extensiones específicas para Claude Code.

---

## Licencia y uso

Repositorio interno de esPublico. Material corporativo Gestiona / esFirma.
