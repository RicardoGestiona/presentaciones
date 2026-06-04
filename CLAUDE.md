# CLAUDE.md

Guía específica para Claude Code en este repositorio. Las **convenciones canónicas** del proyecto (sistema de diseño, layouts, reglas de creación de presentaciones) viven en [`AGENTS.md`](./AGENTS.md). Este fichero solo añade lo específico de Claude Code.

> **Lectura obligatoria al empezar a trabajar aquí:** [`AGENTS.md`](./AGENTS.md). Si trabajas con asistentes web sin filesystem, usa [`LLM-CONTEXT.md`](./LLM-CONTEXT.md).

---

## 1. Resumen rápido

Repositorio de presentaciones HTML corporativas (esPublico Gestiona / esFirma). HTML/CSS/JS puro, sin build. Cada presentación es un `<nombre>/index.html` que importa los assets compartidos vía `../assets/`.

```bash
# Preview local
npx serve . -l 8080
# Abrir http://localhost:8080/<nombre>/
```

---

## 2. Personas (Karpathy framework)

El equipo usa tres personas locales en `.claude/` (ignorada por git, configuración personal de cada miembro):

- `@senior` → `.claude/senior.md` — ingeniería rigurosa, crítica, surgical.
- `@junior` → `.claude/junior.md` — prototipado rápido, "hacerlo funcionar".
- `@security` → `.claude/security.md` — auditoría meticulosa.

Auto-trigger: `@senior` y `@security` por defecto si la tarea toca tokens, identidad o PII.

Si `.claude/` no existe en tu copia local, clona las personas desde `~/.config/.claude/` o pídelas a otro miembro del equipo.

---

## 3. Trazabilidad (`log-prompts.md`)

Tras cada sesión productiva añade una entrada ISO-8601 en [`log-prompts.md`](./log-prompts.md):

```
### [YYYY-MM-DD HH:mm] | PROMPT: <resumen> | RESULT: <ficheros tocados>
```

Máximo 4 líneas por entrada. Sin "lessons learned" ni historial de commits — solo el resultado final. `log-prompts.md` está en `.gitignore` (local).

---

## 4. Selección de marca

Cada producto del portfolio esPublico tiene su Pantone propio. **Nunca asumir una marca por defecto.** Si el usuario no la indica, preguntar.

Marcas soportadas: `espublico`, `gestiona`, `esfirma`, `hacienda-local`, `rrhh`, `videoactas`, `tecnologia`, `sistemas`, `drag`, `ecityclic`, `medidata`. Aplicar con `<body data-brand="<marca>">`. Detalle completo en [`AGENTS.md` §1bis](./AGENTS.md). Manual oficial: <https://design.g3stiona.com/recursos-nuevo-espublico/>.

---

## 5. Reglas operativas Claude Code

- **Sandboxing**: operaciones limitadas estrictamente a la raíz del proyecto. Prohibido `cd ..` o tocar rutas externas.
- **GitHub**: SSH only. Convertir HTTPS a SSH automáticamente. Cuenta activa documentada en `CLAUDE.local.md`.
- **Definition of Done**: ver checklist en `~/.claude/CLAUDE.md` (configuración global del usuario).
- **`context7` MCP**: usar para documentación actualizada de librerías antes de implementar.
- **Sin `console.log`**: usar logging estructurado JSON si se requiere observabilidad.

---

## 6. Material no canónico

- `desarrollo-medios/` → proyecto histórico (submódulo). Sirvió de inspiración visual; **no usarlo como referencia activa**. Está en `.gitignore`.
- `_sources/` → material fuente local (PDFs, pptx, docx). Ignorado por git.

---

## 7. Para todo lo demás

Sistema de diseño, layouts, componentes, variantes, reglas de creación de presentaciones → **`AGENTS.md`**.

## 8. Generador HTML a PPTX

Esta sección define las reglas estrictas para modificar o generar código relacionado con la exportación de presentaciones:

1. **Mapeo de Estilos:** Al exportar a PPTX, SIEMPRE preserva la fidelidad visual. Convierte las unidades `rem` a `pt` usando un factor de 1rem = 16pt. Los colores HEX deben inyectarse directamente en las propiedades `fill` de las formas del PPTX.
2. **Animaciones:** Cualquier clase CSS que empiece por `animate-` (ej. `animate-fade-in`) debe mapearse obligatoriamente a la animación de entrada nativa equivalente en la librería de generación de PPTX. No uses imágenes GIF para simular animaciones.
3. **Estructura:** Cada etiqueta `<section>` del HTML original debe corresponder a un único Slide en el PPTX.
4. **Prohibiciones:** NO alteres la lógica del archivo `exportService.js` sin antes revisar que estas reglas de estilo se mantengan intactas.