# CLAUDE.md

Guía para Claude Code trabajando en la presentación **Certificación Gobernanza Digital · esPublico INAP**.

---

## 1. Qué es este proyecto

Presentación corporativa de **esPublico** sobre "Certificación en Gobernanza Digital" dirigida al Instituto Nacional de Administración Pública (INAP). Actualmente contiene:

- **index.html** con estructura custom (1600×900, estilos inline)
- Contenido temático: pilares jurídicos + tecnológicos, gobernanza digital

**Estado**: Migración en progreso hacia la plantilla corporativa estándar del proyecto raíz. Ver §2.

---

## 2. Migración a plantilla corporativa

El `index.html` actual **NO sigue** el sistema de diseño de `AGENTS.md`. Próximas tareas:

1. **Estandarizar dimensiones**: 1280×720 px (no 1600×900)
2. **Usar corporate.css**: Importar `../assets/css/corporate.css` en lugar de estilos inline
3. **Aplicar navigation.js**: Gestión de slides mediante `../assets/js/navigation.js`
4. **Definir marca**: Confirmar `data-brand` en `<body>` (recomendado: `gestiona` o `espublico`)
5. **Reutilizar layouts**: Aplicar clases de `corporate.css` (`.slide-title`, `.two-column`, `.card`, etc.)

Leer **`../AGENTS.md`** §2–4 para detalles sobre sistema de diseño, layouts y componentes.

---

## 3. Marca y colores

El HTML actual usa paleta custom:

```css
--teal-500: #00B8A9  (primario)
--accent:   #FF7A59  (coral/CTAs)
```

Posibles mapping a marcas corporativas:
- **`gestiona`** (azul petróleo `#006d85`) — si es presentación Gestiana
- **`espublico`** (naranja `#ff9900`) — si es matriz esPublico

**Acción**: Ricardo debe confirmar marca antes de migrar. Una vez decidida, aplicar en:
```html
<body data-brand="<marca>">
```

Esto automáticamente reestiliza todas las clases de `corporate.css` con los tokens de marca.

---

## 4. Estructura actual

```
certificacion-inap/
├── index.html         ← Presenta custom. Contiene:
│                        - Portada (teal turquesa)
│                        - Sección "Pilares" (jurídico + tecnológico)
│                        - Contenido temas gobernanza
│                        - Cierre
│
└── (sin assets locales)   ← Debe importar de ../assets/
```

---

## 5. Próximos pasos (roadmap)

1. **Confirmar marca** (Ricardo).
2. **Refactor HTML**:
   - Cambiar `<slide>` → `<section class="slide-container">`
   - Reducir 1600×900 → 1280×720
   - Mover estilos custom a `<style>` inline únicamente si no existen en `corporate.css`
   - Importar `../assets/css/corporate.css` y `../assets/js/navigation.js`
3. **Aplicar layouts** de `AGENTS.md` §3 (`.title-layout`, `.two-column`, `.card`, etc.)
4. **Verificar accesibilidad**: `aria-label` en cada slide, iconos `aria-hidden="true"`.
5. **Testing local**:
   ```bash
   cd /Users/rilihouse/proyectos-espublico/presentaciones
   npx serve . -l 8080
   # Abrir http://localhost:8080/certificacion-inap/
   ```

---

## 6. Reglas de edición

Leer `../AGENTS.md` §5 completo. Resumen:

- ✅ Usa variables CSS (`--color-primary`, `--color-primary-light`, etc.) — **nunca hardcodees colores**.
- ✅ Mantén idioma: UI/contenido visible en **español**, clases/variables en **inglés**.
- ✅ Slides 1280×720 px — no cambiar dimensiones. Si no entra contenido, redistribuir.
- ✅ Usa layouts existentes de `corporate.css` antes de inventar nuevos.
- ❌ No copies `corporate.css` o `navigation.js` a esta carpeta.
- ❌ No introduzcas frameworks ni npm. Stack puro.
- ❌ No uses f-strings en JS para insertar HTML.

---

## 7. Accesibilidad y metadata

Cada `<section class="slide-container">` debe tener:

```html
<section class="slide-container" aria-label="Descripción breve del slide">
    …
</section>
```

Iconos decorativos: `aria-hidden="true"`.

---

## 8. Referencia rápida

| Comando | Propósito |
|---------|-----------|
| `npx serve . -l 8080` | Preview local en http://localhost:8080/certificacion-inap/ |
| `cd .. && git status` | Ver cambios en el repo completo |
| Read `../AGENTS.md` | Convenciones canónicas del proyecto |
| Read `../CLAUDE.md` | Instrucciones globales para todas las presentaciones |

---

## 9. Contacto y escalada

- **Contenido/Marca**: Ricardo (ricardpenalver@gmail.com)
- **Sistema de diseño**: Leer `../assets/css/corporate.css` (única fuente de verdad para tokens y componentes)
- **Bugs en navigation.js**: Leer `../assets/js/navigation.js` o escalar a Ricardo
