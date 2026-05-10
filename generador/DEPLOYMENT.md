# Deployment

Estrategia decidida: **frontend en cloud (Vercel u otro estático), backend Ollama detrás de un punto de acceso controlado**. El cliente Next.js es 100% browser-direct hacia Ollama; el deploy solo cambia _dónde_ vive Ollama.

## Roadmap

```
Fase 1 (HOY)        ──>  Fase 2 (validación)  ──>  Fase 3 (producción)
Local Mac única         Tunnel desde Mac            AWS gestionado
ollama serve            cloudflared/Tailscale       EC2 GPU + ALB + auth
```

---

## Fase 1 — Local (estado actual)

Sin deploy. Cada desarrollador corre todo en su máquina.

```bash
# 1. Ollama
OLLAMA_ORIGINS=* ollama serve

# 2. Modelo
ollama pull qwen2.5:7b-instruct

# 3. Frontend
cd generador && npm install && npm run dev
# → http://localhost:3000
```

Settings de cliente: `http://localhost:11434` + `qwen2.5:7b-instruct` (defaults). No tocar.

---

## Fase 2 — Tunnel desde Mac de Ricardo

**Objetivo:** demos internas y pilotos sin AWS aún. La Mac sigue siendo el "servidor" Ollama, expuesto vía tunnel autenticado.

**Premisas:**
- La Mac está encendida y con red mientras alguien usa la app.
- Latencia primer turn ~55s (modelo carga). Aceptable en demos.
- Una sola GPU (Apple Silicon) → un user concurrent. No escala.

### Opción 2a: Tailscale (recomendada para piloto interno)

Mejor opción si los users son colegas con cuenta Tailscale (red privada, ACLs).

```bash
# Mac
brew install tailscale && tailscale up
OLLAMA_ORIGINS=* ollama serve

# Frontend deploy (Vercel)
# Settings UI → URL: http://<tailscale-hostname>:11434
```

Pros: zero infra extra, ACLs nativas, sin DNS público.
Contras: cada user necesita Tailscale instalado.

### Opción 2b: Cloudflare Tunnel

Mejor para users no técnicos con URL pública + Cloudflare Access.

```bash
# Mac
brew install cloudflared
cloudflared tunnel login
cloudflared tunnel create ollama-mvp
cloudflared tunnel route dns ollama-mvp ollama-mvp.ricardo.dev
cloudflared tunnel run --url http://localhost:11434 ollama-mvp

# Configurar Cloudflare Access policy (email allowlist) en
# https://one.dash.cloudflare.com → Access → Applications.

OLLAMA_ORIGINS=https://ollama-mvp.ricardo.dev ollama serve
```

Pros: URL HTTPS pública, auth declarativa.
Contras: depende de Cloudflare account, DNS, Access policies.

### Frontend deploy

```bash
# Desde generador/
vercel --prod
# Vercel env vars: ninguna (cliente browser-direct, no hay /api/chat).
```

Configura un **password gate** sencillo en Vercel (middleware Basic Auth) o Cloudflare Access en el frontend también si la URL no debe ser pública.

---

## Fase 3 — AWS gestionado

**Objetivo:** producción multi-user con HA, escalado, observabilidad.

### Topología propuesta

```
[Browser] ──HTTPS──> [Vercel/CloudFront frontend]
                            │
                            └──HTTPS──> [ALB + Cognito] ──> [EC2/ECS Ollama (GPU)]
                                                                  │
                                                                  └──> [EFS/S3 model cache]
```

### Servicios

- **Compute Ollama:** EC2 `g5.xlarge` (NVIDIA A10G, 24GB VRAM) o ECS Fargate con GPU. Modelo `qwen2.5:7b-instruct` corre cómodo en cualquiera. Para latencia más baja, `g5.2xlarge` o modelo más pequeño (3B).
- **Storage modelo:** EFS montado o S3 + warm-up al boot. Evita re-descarga del 4.7 GB en cada autoscaling.
- **Auth:** ALB con listener HTTPS + autenticación Cognito (Google/SSO esPublico) o Lambda authorizer con JWT.
- **Frontend:** Next.js estático en Vercel/CloudFront. `Settings` URL apunta al ALB.
- **CORS:** `OLLAMA_ORIGINS=https://generador.espublico.com` en el container.
- **Secrets:** ningún secreto en frontend (browser-direct). Auth se delega al ALB.

### Estimación coste mensual orientativa

| Item | $/mes |
|------|-------|
| EC2 g5.xlarge 24/7 | ~600 |
| EFS 10 GB | ~3 |
| ALB | ~20 |
| CloudFront/Vercel frontend | ~20 |
| **Total** | **~650** |

Variantes para reducir coste:
- Apagar EC2 fuera de horario laboral (cron, ~50 % ahorro): ~325 €/mes.
- Spot instances: -70 %. Riesgo interrupción.
- Modelo más pequeño en CPU (qwen2.5:3b-instruct): instancia c6i.xlarge ~140 €/mes pero latencia 3-4×.

### Migración fase 2 → fase 3

1. Provisionar EC2 + ALB + Cognito (Terraform recomendado).
2. Subir modelo a EFS (`ollama pull` desde la instancia una vez).
3. Probar con la URL del ALB desde `Settings` del frontend Vercel ya desplegado.
4. Validar latencia + auth + CORS.
5. Apagar tunnel Mac.

---

## Decisiones cerradas

- **Browser-direct** a Ollama (no `/api/chat` server-side). Ventaja: latencia mínima, sin secretos en frontend. Coste: requiere CORS abierto en Ollama y URL accesible al browser.
- **Streaming NDJSON** ya implementado en `lib/llm/client.ts`. Compatible con cualquier endpoint Ollama-compatible (incluido vLLM o LM Studio si en el futuro se cambia el motor).
- **No cloud LLM** (Anthropic/OpenAI). Razón: PII de presentaciones esPublico; preferencia por mantener cómputo en infra propia.

---

## Notas operacionales

- **Red corporativa esPublico** bloquea el puerto 11434 saliente. Trabajar fuera de la red, o tunnel con TLS sobre 443 (cloudflared lo hace automáticamente).
- **Modelo default**: `qwen2.5:7b-instruct`. Si se sustituye, actualizar `lib/llm/client.ts:DEFAULT_CONFIG.model` y `src/app/settings/page.tsx`.
- **Healthcheck**: `GET /api/tags` en Ollama. El cliente lo usa para `testOllamaConnection`.
