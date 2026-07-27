# Presentació APDCAT — Corporativa + Arquitectura d'interoperabilitat

**Fecha:** 2026-07-28
**Marca:** `ecityclic` (verd llima `#7fb927`)
**Idioma del contenido:** català
**Extensión:** 16 slides (~30-40 min)

---

## 1. Objetivo

Deck mixto para presentar a la **APDCAT** (Autoritat Catalana de Protecció de Dades) las
capacidades del grupo esPublico / ecityclic, con tres cargas: credenciales corporativas,
filosofía y evolución del producto, y arquitectura de interoperabilidad e integración.

La audiencia es mixta (directiva y técnica), por lo que la narrativa avanza de lo
institucional a lo técnico sin exigir conocimiento previo en ningún punto.

Dado que el interlocutor es una autoridad de control en materia de protección de datos,
el deck incluye un slide dedicado a privacidad, seguridad y cumplimiento.

**CTA:** solicitar una reunión técnica de detalle.

---

## 2. Material fuente

Cuatro ficheros aportados por el usuario, actualmente en `APDCAT/`:

| Fichero | Aporte |
|---|---|
| `Presentació Corporativa ecityclic AMB-2.pptx` (29 slides, CA) | Cifras corporativas, mapa de módulos, interoperabilidad, seguridad/ENS, Software Factory, metodología, casos de éxito |
| `KickOff Developers 4 — Presentación del curso y metodología.pptx` (13 slides, ES) | API REST (219 recursos / 46 espacios), modelo Low Code, flujos documentales, procesos reglados, Gestiona `<CODE>` |
| `Expertos grupo esPublico — Arquitectura de interoperabilidad.docx` | Las 7 características de la API, BUS de microservicios, PdP Red SARA, marco normativo |
| `ESTRATEGIA INTEROPERABILIDAD GESTIONA — nov2023.html` | Stub de exportación sin contenido real. **No aporta nada; se descarta.** |

Los cuatro se mueven a `_sources/apdcat/` conforme a la regla 10 de `AGENTS.md`.
`_sources/` está en `.gitignore`, de modo que los `.pptx` (7 MB y 5 MB) no entran al repo.
El directorio `APDCAT/` desaparece tras el movimiento.

**Vigencia de datos:** las cifras corporativas proceden del deck AMB fechado el
7 de febrero de 2025. El usuario las ha confirmado como vigentes a 2026-07-28.

---

## 3. Arquitectura del deck

Fichero único `apdcat/index.html`, autónomo, que importa los assets compartidos vía
`../assets/`. Sin build, sin dependencias npm, coherente con el resto del repositorio.

```
apdcat/
└── index.html    ← 16 <section class="slide-container">
```

- `<body data-brand="ecityclic">` a nivel de deck. Ningún slide sobrescribe la marca.
- `<html lang="ca">`.
- Imports: `../assets/css/corporate.css` y `../assets/js/navigation.js`. No se copia ni
  se modifica `corporate.css`.
- CSS propio del deck: solo dentro de un `<style>` inline en el `index.html`, y
  únicamente si un slide concreto lo exige. Se prefiere siempre una clase existente.
- Cada `<section>` lleva `aria-label` descriptivo; los iconos decorativos, `aria-hidden="true"`.
- Slides de 1280×720 px. Si un contenido no entra, se redistribuye — nunca se escala.

### Registro en el índice

Se añade una tarjeta para la nueva presentación en el `index.html` de la raíz,
siguiendo el patrón de las tarjetas ya existentes.

---

## 4. Estructura de slides

La narrativa es «de la casa al connector»: credenciales → cómo evoluciona lo que
vendemos → cómo interopera → cómo se integra → cómo trabajamos juntos.

### Bloc 1 — Qui som (slides 1-3)

| # | Slide | Layout | Contenido |
|---|---|---|---|
| 1 | Portada | `.title-layout` | «Impulsem la transformació digital» / «Solucions digitals innovadores per a entitats transformadores» / APDCAT / fecha |
| 2 | El grup en xifres | `.tiled-content` | 7.300 administracions clients · 510 persones · >79M signatures electròniques/any · 6 PB d'allotjament i custòdia · >65M€ facturació recurrent · >190K usuaris Gestiona |
| 3 | Mapa de solucions | `.tiled-content` | Els mòduls del portfolio: Gestió d'Expedients, Registre General, Signatura Electrònica, Seu Electrònica, Arxiu Electrònic, Control Intern, Gestió d'Òrgans, Llibres Oficials, Padró, Comptabilitat, OVT, Territori, Nòmina i RRHH, Contractació, Analítica, Eines de Comunicació, Oficina d'Assistència |

### Bloc 2 — Com evoluciona el producte (slides 4-6)

Bloque solicitado expresamente. **Sin hitos con fecha ni compromisos de versión:** no
existe fuente de roadmap en el material aportado, y ante una autoridad de control una
fecha inventada equivale a un compromiso falso. El bloque argumenta el *modelo* de
evolución y lo respalda con evidencia histórica.

| # | Slide | Layout | Contenido |
|---|---|---|---|
| 4 | Separador de sección | `.section-title-layout` | «Com evoluciona el producte» |
| 5 | Filosofia de producte | `.feature-cards` | Cuatro cartas: **SaaS únic** (totes les entitats sobre la mateixa versió, sense derives a mida) · **Compatibilitat garantida** (control de compatibilitat i gestió de canvis comunicada a totes les parts interessades) · **Evolució guiada** (per normativa —39/2015, 40/2015, RD 203/2021, ENS, ENI— i per la comunitat de 7.300 administracions) · **Autonomia de l'entitat** (cap funcionalitat implantada que l'entitat no pugui mantenir sense dependre de nosaltres) |
| 6 | Evolució sostinguda | `.step-cards` | Eje temporal del Factory como prueba: 2014 Consultoria funcional → 2016 OTP Gestiona → 2020 Factory Gestiona → 2024/2025 Gestiona for developers. Cierre: creixement continu de serveis a l'API |

### Bloc 3 — Interoperabilitat i compliment (slides 7-9)

| # | Slide | Layout | Contenido |
|---|---|---|---|
| 7 | Separador de sección | `.section-title-layout` | «Interoperabilitat i compliment» |
| 8 | Interoperabilitat nativa | `.tile-triple` | Serveis comuns integrats de forma nativa: catàleg de procediments, identificació de l'interessat, gestió de la representació, verificació de dades, publicació, notificacions i comunicacions, sistema d'intercanvis de registres, consulta i tramesa d'expedients, relació amb els proveïdors. Mención a PdP de Red SARA |
| 9 | Seguretat i protecció de dades | `.feature-cards` | RGPD i rol d'encarregat del tractament · ENS categoria Alta, ENI, ITIL · Prestador de Serveis de Confiança Qualificats (eIDAS, Reglament UE 910/2014) · Traçabilitat: tota acció via API queda registrada i certificada |

### Bloc 4 — Arquitectura d'integració (slides 10-14)

| # | Slide | Layout | Contenido |
|---|---|---|---|
| 10 | Separador de sección | `.section-title-layout` | «Arquitectura d'integració» |
| 11 | La nostra API REST | `.feature-cards` | Potent (219 recursos en 46 espais) · Documentada · Gratuïta · Servei de suport a desenvolupadors. «Una arquitectura oberta i dissenyada per connectar-se a tot» |
| 12 | Les 7 característiques | `.tiled-content` + `.phase` | Completa · Adaptable · Documentada · Oberta · Estable · Segura · Traçable (fuente: docx) |
| 13 | Model Low Code de connectors | `.two-column` | Abstracció de casos d'ús · desenvolupament àgil · baix manteniment. Incluye mención a Gestiona `<CODE>` como capacidad de ejecución segura de código dentro de la aplicación |
| 14 | Fluxos documentals i processos reglats | `.two-column` + `.highlight-box` | Columna A — fluxos documentals: la lògica es parametritza al circuit, el connector només envia el document i invoca el flux. Columna B — processos reglats: mapeig de camps, execució sense intervenció humana, condicionament del flux. `highlight-box` con el principio común: **canviar la lògica de negoci sense canviar la integració** |

### Bloc 5 — Com treballem (slides 15-16)

| # | Slide | Layout | Contenido |
|---|---|---|---|
| 15 | Metodologia d'integracions | `.step-cards` | 8 pasos: presentació situació inicial → estudi capa integracions/RPA → divisió per mòduls i fases → abast final definitiu → desenvolupament integració/robots → test tècnic → validació funcional a PRE → posada en producció |
| 16 | Tancament | `.title-layout` sobre fondo oscuro | +900 integracions en client · «T'acompanyem fins on vulguis arribar» · **CTA: sol·licitar una reunió tècnica de detall** |

---

## 5. Decisiones de diseño y sus motivos

**Fusión de flujos documentales y procesos reglados en un solo slide (14).** En las
fuentes ocupan 8 slides combinados, pero comparten un único principio —la lógica vive en
la configuración, no en el conector— y presentarlos juntos hace ese principio explícito
en lugar de dejarlo implícito en la repetición.

**Gestiona `<CODE>` sin slide propio.** Es detalle de scripting; ante APDCAT pesa más la
filosofía de producto. Queda como capacidad mencionada en el slide 13.

**El eje 2014→2025 se mueve de metodología a filosofía de producto.** En el deck AMB
ilustra la historia del Factory; aquí funciona mejor como evidencia de que la evolución
sostenida no es una promesa sino un historial.

**Revelación progresiva solo en los slides 12, 14 y 15.** Son los de mayor densidad
enumerativa, donde el `.phase` ayuda a marcar el ritmo del discurso. En el resto el
contenido aparece completo para no ralentizar la exposición.

**Se descarta el fichero HTML fuente.** Es un stub de exportación sin contenido.

---

## 6. Criterios de aceptación

1. `apdcat/index.html` existe, contiene exactamente 16 `<section class="slide-container">`
   y abre sin errores de consola.
2. `<body data-brand="ecityclic">` y `<html lang="ca">`.
3. Todo el contenido visible está en catalán; clases, identificadores y comentarios en inglés.
4. No hay colores hardcodeados: todo vía variables CSS de `corporate.css`.
5. `corporate.css` y `navigation.js` no se han modificado ni copiado.
6. Cada `<section>` tiene `aria-label`; los iconos decorativos, `aria-hidden="true"`.
7. Ningún slide desborda los 1280×720 px, verificado en navegador.
8. La navegación por teclado y los bullets de paginación funcionan en los 16 slides.
9. El `index.html` de la raíz enlaza la nueva presentación.
10. `_sources/apdcat/` contiene los cuatro ficheros originales y `APDCAT/` ya no existe.
11. Ningún `.pptx` ni `.docx` aparece en `git status`.

---

## 7. Verificación

```bash
npx serve . -l 8080
# http://localhost:8080/apdcat/
```

Recorrer los 16 slides con las flechas del teclado y comprobar los criterios 7 y 8.
Nota: el proxy corporativo interfiere con `curl` a localhost; usar `--noproxy '*'` si se
comprueba desde CLI.

---

## 8. Fuera de alcance

- Versión en castellano del deck (`index-es.html`). Se creará solo si se solicita.
- Exportación a PPTX.
- Slide de casos de éxito con clientes nombrados: requeriría autorización de los clientes
  citados y no hay material concreto en las fuentes.
- Roadmap con hitos fechados, por la razón expuesta en el bloque 2.
