# Resumen tareas última semana (2026-05-05 → 2026-05-11)

## Generador web (foco principal)

### Scaffold inicial
- **MVP v1** (2026-05-06): Next.js + Zod schema + renderers + API routes.
- **v2 framework** (2026-05-06): cliente Ollama + system prompt + `ChatPanel`.

### Instalación y entorno
- `INSTALL.md` + scripts install para proxy corporativo (2026-05-08).
- Fix build tras `npm install` fuera de red corporativa.
- Default model Ollama: `qwen2.5:7b-instruct`.
- Bump `@typescript-eslint` v8 — resuelve 6 vulns ReDoS en minimatch.

### Funcionalidad chat / LLM
- Streaming Ollama con preview JSON en vivo.
- Error handling tipado en chat Ollama.
- Cobertura tests LLM client + system-prompt.
- Polish: prompt en español + warning imagen faltante + rename UI.

### Editor v2
- Image upload UI + descarga ZIP server.
- Asociar imágenes a slides desde el chat.
- Persistencia + import + delete slide UI.
- Mirror `public/assets/{css,js}/` para preview iframe.

### Testing / CI
- Workflow GitHub Actions: test + build.
- Cobertura two-column / step-cards + parity layouts canónicos.

### Documentación
- `DEPLOYMENT.md` con estrategia tunnel → AWS.

## Presentaciones

- **gestiona-avanza** (2026-05-05): nueva presentación con branding.

## Stats

- 18 commits.
- 17 en `generador/`, 1 en `gestiona-avanza/`.
- Foco: generador pasa de scaffold MVP a editor v2 funcional con LLM streaming, imágenes, persistencia y CI.
