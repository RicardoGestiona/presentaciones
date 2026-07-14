# Diseño: Workshop "Buscando soluciones para el territorio"

## Contexto

Nueva presentación en `brainstorming-hub/index.html`, dentro del portafolio de sesiones temáticas del Hub de Transformación Digital de ecityclic (hermana de `hub-td-ecityclic`, que cubre el taller de tramitación reglada).

Esta sesión es un workshop de co-diseño con clientes municipales (20-24 personas) para hacer brainstorming sobre qué uso darle a las instalaciones físicas del hub. Se basa en la guía `Guia_facilitacion_como_ayudar_a_quienes_ayudan_al_ciudadano.docx` (ya presente en `brainstorming-hub/`), que define una dinámica de 90 minutos en 4 mesas mixtas de 4-5 personas, con metodología de brainwriting, agrupación por afinidad, co-diseño, galería y votación. Se ejecuta en dos sesiones idénticas.

El deck sirve como **pantalla proyectada durante la sesión en vivo** — lo que ven los participantes en cada fase — no como chuleta completa del facilitador. Por tanto incluye solo lo esencial de cada fase (pregunta, instrucción breve, tiempo), sin el guion largo ("Di:"), sin preguntas de rescate ni planes de contingencia de la guía.

## Marca y base técnica

- `<body data-brand="ecityclic">` — verde lima `#7fb927`.
- Estructura clonada de `hub-td-ecityclic`: importa `../assets/css/corporate.css` y `../assets/js/navigation.js` vía rutas relativas (`brainstorming-hub/index.html` está al mismo nivel que `hub-td-ecityclic/`, así que usa `../assets/`, no una copia local).
- Reutiliza componentes existentes de `corporate.css`: `.slide-container`, `.slide-title`, `.phase` (y variantes `--slide-left`/`--slide-right`/`--fade`), `.card`, `.metric-number`, tokens de color de marca.
- Sin animaciones ni assets nuevos más allá de los ya definidos en el sistema de diseño compartido.

## Estructura de slides (15)

1. **Portada** — "Workshop: Buscando soluciones para el territorio" + subtítulo "Hub de Transformación Digital · ecityclic".
2. **Bienvenida y propósito** — lema "Cómo ayudar a quienes ayudan al ciudadano" + pregunta de trabajo completa (guía §1).
3. **El recorrido de la dinámica** — mapa visual de los 6 pasos (beneficio ciudadano → cambio organizativo → capacidades profesionales → papel del software → experiencia del espacio → transferencia), tomado de la tabla de la guía §1.1.
4. **Reglas del juego** — las 7 reglas del cartel (Anexo 3 de la guía): una idea por nota, primero escribimos después hablamos, todas las voces cuentan, hablamos de capacidades no de funcionalidades, el ciudadano es el propósito, la transferencia forma parte de la experiencia, los votos orientan no deciden.
5. **Roles de mesa** — 4 tarjetas: responsable de mesa, portavoz, guardián del ciudadano, guardián de la transferencia (guía §2.1 / Anexo 2, sin incluir "control del tiempo" ni "guardián del nivel conceptual" para no sobrecargar — son roles de apoyo del facilitador, no de mesa).
6. **Código visual de las notas** — tabla color → significado: azul (beneficio ciudadano), rosa (cambio/barrera), amarillo (capacidad profesional), verde (papel del software), morado (transferencia), blanco/naranja (título de agrupación).
7. **Fase 1 — Generación individual (0:08-0:15)** — pregunta ("¿Qué nota el ciudadano...?"), instrucción (3 notas azules, una idea por nota), tiempo.
8. **Fase 2 — Mural ciudadano (0:15-0:27)** — compartir por turnos, agrupar, votar un beneficio prioritario.
9. **Fase 3 — Cadena de cambio (0:27-0:39)** — cambio organizativo (notas rosas) + capacidades profesionales (notas amarillas), recorriendo al menos 4 perfiles.
10. **Fase 4 — Software y transferencia (0:39-0:49)** — papel conceptual del software (verde) + condiciones de transferencia (morado).
11. **Fase 5 — Diseño de experiencia (0:49-1:07)** — construcción del lienzo de concepto; lista resumida de sus campos (beneficio, cambio, perfiles, capacidades, software, antes/durante/después, resultado, transferencia, nombre del concepto).
12. **Fase 6 — Presentaciones (1:07-1:19)** — guion del portavoz en 7 líneas (ciudadano, cambio, personas, software, experiencia, resultado, transferencia), 3 min por mesa.
13. **Fase 7 — Galería y votación (1:19-1:26)** — 3 criterios de voto con su color: azul (impacto ciudadano), amarillo (capacidad transformadora), verde (valor del espacio).
14. **Cierre (1:26-1:30)** — mensaje de cierre: no se elige un ganador hoy, se han identificado los elementos que deben convertir el espacio en un referente; próximos pasos (comparación entre las dos sesiones, devolución de conclusiones).
15. **Cierre/agradecimiento final** — slide de cortesía coherente con el resto del portfolio (agradecimiento, logo).

Cada slide de fase (7-13) sigue un patrón visual común: título de fase + rango horario, pregunta principal destacada (similar a `.metric-number` o tratamiento tipográfico grande), instrucción breve para el grupo. Se usa `.phase` con revelación progresiva donde tenga sentido (p. ej. pregunta primero, instrucción después).

## Fuera de alcance

- No se incluye el guion largo del facilitador ("Di:" completo), preguntas de rescate, plan de contingencia de tiempo, ni contingencias materiales — quedan en la guía docx como material de apoyo del facilitador, no en pantalla.
- No se incluyen los anexos de materiales (lista de compra), distribución de sala, ni checklist de preparación — son logística previa, no contenido de sesión.
- No se genera el lienzo de concepto imprimible (Anexo 1) como slide — es un documento A2/A3 físico, fuera del deck.

## Testing / verificación

- Preview local (`npx serve . -l 8080`) y revisión visual de las 15 slides, navegación por teclado/dots, y `.phase` en las slides que lo usen.
- Verificar que `data-brand="ecityclic"` aplica correctamente los tokens de color en todos los componentes reutilizados.
