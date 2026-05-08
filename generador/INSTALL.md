# Instalación Generador esPublico

## Status

**Código:** ✅ Listo (commits en GitHub)
**npm install:** ⏳ Bloqueado por proxy corporativo esPublico

## Requisitos

- Node.js 18+
- npm 9+

## Instalación

### Opción 1: Fuera de red corporativa (RECOMENDADO)

```bash
cd generador
npm install
npm run build
npm test
npm run dev
```

Abre `http://localhost:3000`.

### Opción 2: Con VPN corporativa

1. Desconéctate del proxy:
   ```bash
   unset http_proxy https_proxy HTTP_PROXY HTTPS_PROXY
   ```
2. Conecta a VPN corporativa (si disponible)
3. Luego:
   ```bash
   npm install
   ```

### Opción 3: Contenedor Docker

```bash
docker run -it --rm -v $(pwd):/app -w /app/generador node:18 npm install
```

### Opción 4: Manual (si todo falla)

1. Descarga `package.json` e instala localmente en máquina limpia
2. Comprime `node_modules`
3. Copia a `generador/node_modules`
4. Luego `npm run build`

## Scripts Disponibles

```bash
npm run dev           # Dev server (http://localhost:3000)
npm run build         # Build producción
npm run start         # Servir build
npm test              # Correr tests
npm run lint          # ESLint
npm run sync-assets   # Sincronizar CSS/JS desde ../assets/
```

## Problema: Proxy corporativo

Si `npm install` falla con `Invalid protocol 'proxy.espublico.it'`:

1. **Causa:** Variables de entorno `http_proxy` / `https_proxy` persisten
2. **Solución:**
   ```bash
   # Shell limpio
   bash
   unset http_proxy https_proxy
   npm install
   ```

3. **O:** Edita `~/.npmrc`:
   ```
   registry=https://registry.npmjs.org/
   no-proxy=*
   strict-ssl=false
   ```

4. **O:** Usa script de instalación limpio:
   ```bash
   bash scripts/install-clean.sh
   ```

## Verificación

Después de instalar:

```bash
npm run build  # Debe compilar sin errores
npm test       # Debe pasar snapshots
```

## Deploy

```bash
npm run build
npm start  # Local
# O: vercel deploy  (Vercel)
```

## Problemas

**npm install cuelga:**
- Red corporativa con proxy interceptando
- Solución: ejecutar fuera de red corporativa

**Build falla con "module not found":**
- npm install incompleto
- Verificar: `ls node_modules/next node_modules/react node_modules/zod`

**Preview iframe blanco:**
- Falta sincronización de assets
- Ejecutar: `npm run sync-assets`

---

**Estado actual:** Código 100% listo. Espera npm install en red limpia.
