# PapaFactory: aplicación

La guía principal está en [README.md de la raíz](../README.md).
Para continuar con otro agente, leer [AGENTS.md](../AGENTS.md) y [CONTINUIDAD.md](../CONTINUIDAD.md).

Usar Node.js 24. Desde esta carpeta:

```powershell
npm ci
npm run dev -- --host 127.0.0.1
```

Para validar código y compilar:

```powershell
npm test
npm run build
```

Para generar el instalador de Windows local sin publicar:

```powershell
npm run build-admin
```

La salida queda en `build-output/`. La configuración activa de Electron Builder está
en `package.json`, y la entrada de escritorio es `electron-simple.js`.

Las versiones de escritorio se publican automáticamente al subir cambios de esta carpeta a `main`.
Ver [ACTUALIZACIONES.md](ACTUALIZACIONES.md) y descargar desde
[GitHub Releases](https://github.com/josemedina1/Papafactory/releases/latest).

Para la web, ver [netlify.toml](netlify.toml) y [DEPLOY_NETLIFY.md](DEPLOY_NETLIFY.md).
