# Actualizaciones de escritorio

La app usa `electron-updater` y las versiones públicas de `josemedina1/Papafactory`.
Los productos siguen cargándose desde la API y no requieren una versión nueva.

## Para quienes usan la app

Instalar una vez `PapaFactory Setup 1.0.0.exe` (o una versión posterior que ya incluya el actualizador).
La app consulta actualizaciones al abrirse. También se puede usar **Buscar actualizaciones**.
Cuando hay una versión nueva, elegir **Descargar** y luego **Actualizar y reiniciar**.
Antes de reiniciar hay que finalizar el pedido actual. No se instala al cerrar la app sin confirmación.

## Publicación automática

Al subir cambios de `papafactory/` a `main`, GitHub Actions ejecuta las pruebas,
compila en Windows y publica una release con instalador, blockmap y `latest.yml`.
No basta con desplegar un sitio externo: los cambios de código deben estar en este repositorio.

La versión publicada es `1.0.<número de ejecución del workflow>`; el archivo local
`package.json` conserva la versión inicial. Los reintentos de una misma ejecución conservan la versión.
Mantener este workflow y su historial para que las versiones sigan siendo crecientes.
La release solo se publica al terminar de subir sus archivos.

Requiere GitHub Actions habilitado y el permiso `contents: write` del `GITHUB_TOKEN`
(ya declarado en el workflow). No se incluyen tokens de GitHub dentro de la app.

Para construir un instalador local sin publicarlo:

```powershell
npm ci
npm test
npm run build-admin
```

Los archivos quedan en `build-output/`. El workflow también se puede ejecutar manualmente
desde la pestaña Actions de GitHub.
