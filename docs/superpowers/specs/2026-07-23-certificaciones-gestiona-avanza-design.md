# Diseño: Presentación "Certificaciones Gestiona Avanza"

## Contexto

Presentación para cliente/evento externo que resume la estrategia de certificación y transferencia de conocimiento de esPublico dentro del programa Gestiona Avanza, y cada una de las tres certificaciones vigentes. Fuente de contenido: `certificaciones-gestiona-avanza/Certificacion-generico-2026.pdf`, `Dossier-Developers-2026.pdf`, `Dossier-Analiza-2026.pdf`.

## Marca

`data-brand="gestiona-avanza"` (cian, submarca de formación/comunidad de Gestiona).

## Estructura: 6 slides

Base: `templates/slide-template.html`, imports a `../assets/`.

### Slide 1 — Portada (`title-layout`)
- H1: "Certificaciones Gestiona Avanza"
- Subtítulo: "Estrategia de capacitación y transferencia de conocimiento a clientes"

### Slide 2 — Cómo funciona el modelo
Layout: `slide-title` + `tile-triple` o `feature-cards` (4 pilares).
Mensaje: el programa transfiere capacidad real a la entidad, no solo uso de herramienta.
Pilares:
1. **Itinerarios especializados por perfil/rol** — cada certificación dirigida a un perfil distinto (administrador, developer, analista).
2. **Aprendizaje aplicado** — entorno demo, proyecto final, tutor personal desde el inicio.
3. **Evaluación con acreditación oficial** — evaluación teórico-práctica ante tribunal examinador, certificación oficial de esPublico.
4. **Modalidad híbrida sostenida en el tiempo** — semipresencial (telemática + presencial), carga lectiva estructurada por calendario y niveles de dificultad progresivos.

### Slide 3 — Valor para la entidad
Layout: `slide-title` + `bullet-list` o `tile-triple`.
Eje: beneficio/ROI para el cliente, sin repetir la mecánica descrita en el slide 2.
Puntos:
1. **Autonomía real** — la entidad configura y explota Gestiona sin depender de terceros.
2. **Reducción de riesgo** — administración cualificada de una plataforma crítica y transversal.
3. **Máximo aprovechamiento de la inversión** — visión 360º de las capacidades de la plataforma.
4. **Comunidad de referencia entre entidades** — al certificarse, el personal se integra en "Gestiona Avanza": acceso a novedades, proyectos piloto y red de contactos con otras administraciones certificadas.

### Slide 4 — Certificación: Administración avanzada de Gestiona
Layout: `slide-title` + `two-column` o `feature-cards`.
- A quién va dirigida: personal administrativo, perfiles de gestión/dirección, informáticos, técnicos de gestión documental y archivo, responsables de simplificación administrativa.
- Objetivo esencial: dominio integral (360º) de la plataforma — configuración, administración de usuarios, gestión documental y archivo, tramitación de expedientes, gestión económica, analítica de datos y metodologías ágiles de diseño de servicios digitales.

### Slide 5 — Certificación: Gestiona for Developers
Layout: `slide-title` + `two-column` o `feature-cards`.
- A quién va dirigida: perfiles técnicos, informáticos y responsables de sistemas, proveedores de desarrollo con contrato Gestiona.
- Objetivo esencial: capacitar en integración de sistemas mediante las herramientas low-code de Gestiona — programación con Gestiona Code, API de Gestiona, automatización y orquestación de procesos con n8n.

### Slide 6 — Certificación: Analiza
Layout: `slide-title` + `two-column` o `feature-cards`.
- A quién va dirigida: personal técnico/administrativo de modernización, perfiles de gestión y dirección, informáticos, especialistas en analítica de datos.
- Objetivo esencial: capacitar en el módulo Analiza de Gestiona para la gobernanza del dato — diseño y personalización de cuadros de mando complejos, explotación avanzada de la información para la toma de decisiones basada en evidencias.

## Fuera de alcance

- No se incluyen detalles operativos (fechas de convocatoria, requisitos de acceso, profesorado, precios) — la presentación se queda en la esencia estratégica y de contenido, no en el detalle logístico de cada dossier.
- No se crea una diapositiva de cierre/CTA adicional; el diseño se cierra con la tercera certificación (Analiza).
