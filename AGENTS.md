# Instrucciones para agentes de PapaFactory

## Preparación

- Leer `README.md` y `CONTINUIDAD.md` antes de continuar una función.
- La app activa está en `papafactory/`. Ejecutar npm desde esa carpeta.
- Usar Node.js 24, igual que GitHub Actions. Instalar con `npm ci`; conservar el lockfile.
- Revisar `git status` antes de editar. No descartar cambios existentes ni incluir cambios ajenos por accidente.
- `src/main.tsx` carga `src/App.tsx`. Los archivos `*-Jose.*`, scripts alternativos de Electron y `src-tauri/` no son el flujo activo de este trabajo.

## Catálogo y API

- Los productos y agregados reales están en MockAPI. `src/productos.json` es un respaldo.
- Mantener `USE_LOCAL_DATA = false` en uso normal.
- No añadir timestamps a las consultas de productos: `?t=...` provoca 404 en el endpoint actual. Usar `fetch(url, { cache: 'no-store' })` de `src/apiProductos.ts`.
- Mantener la clasificación en `src/categorias.ts`. La categoría del Gestor tiene prioridad sobre palabras del nombre del producto.
- Conservar nombres de categorías personalizadas, incluso si contienen palabras como Fajitas o Papas. Solo los alias exactos se convierten a las categorías base. No volver a usar una lista fija para filtros o selectores.
- Las categorías vacías usan `categoriasPapaFactory` en almacenamiento local; las que tienen productos también se descubren en la API. No afirmar que las categorías vacías se sincronizan entre equipos.
- El orden de categorías usa `ordenCategoriasPapaFactory` localmente y debe reflejarse en Gestor y menú principal. Conservar el orden guardado mientras llega el catálogo de la API; añadir categorías nuevas al final y mantener `Todas` como filtro fijo.
- Para probar CRUD, usar datos simulados. No crear, borrar o modificar productos reales como prueba sin que forme parte de lo solicitado por el usuario.
- No reemplazar silenciosamente cambios confirmados por el respaldo cuando falla una recarga.

## Escritorio y actualizaciones

- Entrada de Electron: `electron-simple.js`; configuración activa de electron-builder: campo `build` de `package.json`.
- Conservar `appId = com.papafactory.app` para mantener la identidad de instalaciones existentes.
- Conservar `nodeIntegration: false`, `contextIsolation: true`, `sandbox: true` y el puente limitado de `preload.cjs`.
- No exponer un `ipcRenderer.invoke` genérico ni incluir tokens de GitHub dentro de la app.
- Actualizador: `desktop-updates.cjs` y `src/DesktopUpdates.tsx`. Mantener descarga e instalación por acción del usuario y protección del pedido pendiente antes de reiniciar.
- No cambiar la numeración `1.0.<github.run_number>` ni recrear el workflow sin un plan que preserve versiones crecientes.
- Publicar instalador, `.blockmap` y `latest.yml` con nombres que coincidan exactamente con el manifiesto. Publicar la release solo después de subir todos sus archivos.
- Un push con cambios de `papafactory/` a `main` genera una release, incluso si son documentos. No subir pruebas incompletas a `main`.
- Usar `npm run build-admin` para un instalador local sin publicar. Los scripts alternativos históricos no tienen validación equivalente.

## Verificar y entregar

- Cambios de lógica: ejecutar `npm test` y `npm run build` desde `papafactory/`.
- Cambios de empaquetado: ejecutar `npm run build-admin` y comprobar archivos y manifiesto.
- Documentación solamente: comprobar exactitud, enlaces relativos y `git diff --check`; no hace falta recompilar por una edición de texto.
- Distinguir pruebas simuladas, lectura real de API y pruebas de Windows. No afirmar una actualización instalada de extremo a extremo si solo se verificó la detección.
- No borrar historial, datos locales, lockfile o instaladores anteriores para resolver fallos sin investigar la causa.
- Informar lo cambiado, lo probado, las limitaciones y si se subió a GitHub. Actualizar `CONTINUIDAD.md` cuando cambien decisiones o tareas pendientes.
