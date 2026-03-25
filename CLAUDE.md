# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Proyecto
Presentaciones HTML corporativas para **esPublico Gestiona** y **esFirma**. HTML/CSS/JS puro + Google Fonts (Roboto) + Font Awesome 6.5.1 via CDN.

## Paleta de Colores (CSS Custom Properties)
Definidas en `assets/css/corporate.css`:
- **Gestiona:** `--color-primary: #006d85`, `--color-primary-light: #00dfb2`, `--color-primary-dark: #004d5e`, `--color-accent: #5fffdf`, `--color-bg-light: #ecf0f3`
- **esFirma:** `--color-gold: #aa9944`
- **Fondo oscuro:** `--color-bg-dark: #003040`

## Webs comerciales
- espublicogestiona.com
- esfirma.com

## Estructura
```
presentaciones/
├── assets/css/corporate.css  — Estilos compartidos (paleta, tipografía, layouts)
├── assets/js/navigation.js   — Navegación horizontal (translateX) por teclado
├── assets/img/               — Logos e imágenes compartidas
├── templates/                — Plantilla HTML reutilizable
└── <nombre>/index.html       — Cada presentación es un subdirectorio
```

## Sistema visual (basado en desarrollo-medios)
- **Slides** = `<section class="slide-container">` de 1280×720px, centrados en fondo oscuro
- **Navegación** = transición horizontal `translateX` via `<main role="presentation">`
- **Tipografía** = Roboto (Google Fonts)
- **Iconos** = Font Awesome 6.5.1

## Layouts disponibles
| Clase | Uso |
|---|---|
| `.title-layout` | Portada y cierre (centrado vertical) |
| `.section-title-layout` | Separador de sección (fondo oscuro completo) |
| `.slide-title` | Título estándar con barra lateral (`.slide-title--gold` para esFirma) |
| `.two-column` | Grid de 2 columnas con gap 60px |
| `.tiled-content` | Grid 2×2 de tarjetas (`.tile`) |
| `.tile-triple` | Variante de 3 columnas |
| `.table-layout` | Tabla con cabecera oscura |
| `.bullet-list` | Lista con iconos Font Awesome (`.bullet-list--gold` para esFirma) |

## Variantes esFirma
- `.esfirma-theme` en `slide-container` → decoración de fondo dorada
- `.tile--gold` → borde superior dorado en tiles
- `.card--bordered-gold` → borde superior dorado en cards
- `.section-title-layout--gold` → separador con línea dorada

## Convenciones
- Cada presentación = subdirectorio con su `index.html` que importa `../assets/css/corporate.css` y `../assets/js/navigation.js`
- Estilos específicos de una presentación → `<style>` inline en su HTML
- UI y comentarios en **español**; nombres de clases CSS y variables JS en **inglés**

## Comandos
```bash
# Preview local (desde raíz del proyecto)
npx serve . -l 8080
# Abrir http://localhost:8080/<nombre>/
```

## Crear nueva presentación
1. Copiar `templates/slide-template.html` a `<nombre>/index.html`
2. Editar contenido de slides
3. Las rutas a assets ya apuntan a `../assets/`
