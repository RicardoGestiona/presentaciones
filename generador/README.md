# Generador esPublico

Aplicación web para generar presentaciones corporativas esPublico desde un formulario, con asistente conversacional para ajustes (v2).

## MVP (v1)

- Formulario: nombre, marca obligatoria, slides tipados.
- Preview en vivo (iframe).
- Descarga ZIP con `index.html` + imágenes.
- Sin LLM aún.

## Tecnología

- **Next.js 15** + React + TypeScript.
- **Zod** para validación de schema.
- **jszip** para generar ZIPs.
- **Ollama** (v2) para chat conversacional.

## Instalación

```bash
cd generador
npm install
npm run dev
```

Abre `http://localhost:3000`.

## Scripts

- `npm run dev` — Servidor development (hot reload).
- `npm run build` — Build producción.
- `npm start` — Servir build producción.
- `npm test` — Correr tests (Vitest).
- `npm run sync-assets` — Sincronizar CSS/JS desde `../assets/` a `public/`.
- `npm run lint` — Linter.

## Estructura

```
generador/
├── src/app/
│   ├── page.tsx          # Home
│   ├── editor/page.tsx   # Editor + preview
│   ├── settings/page.tsx # Config Ollama (v2)
│   └── api/              # API routes
├── lib/
│   ├── schema.ts         # Zod schema (Deck, Slide, Action)
│   ├── render/           # Generador HTML
│   └── llm/              # LLM integrations (v2)
└── public/               # Assets copiados (corporate.css, navigation.js)
```

## Uso

### v1 (MVP)

1. `npm run dev`
2. Ir a `/editor`
3. Llenar formulario (nombre, marca, slides)
4. Click "Descargar HTML"
5. Descomprimir ZIP en raíz de `presentaciones/`

### v2 (Próximamente)

1. Configurar Ollama en `/settings`
2. Usar chat para cambios conversacionales
3. El asistente aplica mutaciones al deck

## Desarrollo

### Añadir nuevo slide type

1. Crear `lib/render/slides/<tipo>.ts` con renderer.
2. Exportar en `lib/render/slides/index.ts`.
3. Añadir a discriminated union en `lib/schema.ts`.
4. Añadir test snapshot en `lib/render/__tests__/render.test.ts`.
5. Actualizador en `lib/llm/apply-actions.ts` (si es necesario).

### Testes

```bash
npm test                 # Correr todos
npm test -- --ui        # UI interactiva
npm test -- render      # Solo renderers
```

## Assets

Los archivos `public/corporate.css` y `public/navigation.js` se sincronizan desde `../assets/`.

```bash
npm run sync-assets
```

Si divergen, el build falla (test de parity).

## Deployment

Vercel. Passwort protection recomendado (serverless, sin filesystem).

ZIP se descarga en el cliente; usuario lo descomprime en `presentaciones/`.

## Notas

- No modifiques `assets/` desde aquí. El `sync-assets` solo es para copia local en `public/`.
- Todos los strings de usuario se escapan (no XSS).
- Imágenes en ZIP van en `<deck>/img/`.
- Brand obligatorio (sin default).
