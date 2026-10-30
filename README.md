# PapaFactory

Sistema de punto de venta para web y Windows, con React, TypeScript, Vite y Electron.

Repositorio: [josemedina1/Papafactory](https://github.com/josemedina1/Papafactory).
Instaladores: [última versión publicada](https://github.com/josemedina1/Papafactory/releases/latest).

## Continuar con otro agente

No es necesario disponer del chat anterior. El contexto está guardado en:

- [AGENTS.md](AGENTS.md): instrucciones de trabajo para agentes.
- [CONTINUIDAD.md](CONTINUIDAD.md): estado actual, decisiones, errores resueltos y verificaciones pendientes.
- [Actualizaciones de escritorio](papafactory/ACTUALIZACIONES.md): publicación y uso del actualizador.

Mensaje para entregar al siguiente agente:

> Continúa el proyecto https://github.com/josemedina1/Papafactory. Lee primero AGENTS.md, README.md y CONTINUIDAD.md. La aplicación está en papafactory/. Revisa el estado de Git y conserva los cambios existentes. Usa esos documentos como contexto y luego trabaja en la siguiente función que te indique.

## Ejecutar en desarrollo

Usar Node.js 24 y npm. Ejecutar npm dentro de `papafactory/`, no en la raíz del repositorio.

```powershell
git clone https://github.com/josemedina1/Papafactory.git
cd Papafactory/papafactory
npm ci
npm run dev -- --host 127.0.0.1
```

Abrir [http://localhost:5173](http://localhost:5173).

## Validar y generar instalador

Desde `papafactory/`:

```powershell
npm test
npm run build
npm run build-admin
```

El instalador local queda en `papafactory/build-output/PapaFactory Setup 1.0.0.exe`
(el número corresponde a la versión del `package.json` local).
`dist/`, `node_modules/` y `build-output/` son generados y no se suben a Git.

## Publicar cambios

Subir cambios de `papafactory/` a `main` ejecuta el workflow
[desktop-release.yml](.github/workflows/desktop-release.yml), que prueba, compila y publica
una versión de Windows en GitHub Releases. La app instalada puede usar
**Buscar actualizaciones → Descargar → Actualizar y reiniciar**.

Las instalaciones antiguas sin actualizador necesitan instalar una versión moderna una vez.
Desplegar una web externa por sí solo no actualiza el código de escritorio: los cambios
deben subirse a este repositorio para generar su release.

## Datos y web

El **Gestor** administra productos y agregados en MockAPI. Los cambios del catálogo
no necesitan recompilar el instalador. El historial de pedidos se guarda localmente
en cada navegador o instalación; no es una base de datos compartida.

Para Netlify, usar carpeta base `papafactory`, comando `npm run build` y salida `dist`.
Ver [netlify.toml](papafactory/netlify.toml) y la
[guía de despliegue existente](papafactory/DEPLOY_NETLIFY.md).
