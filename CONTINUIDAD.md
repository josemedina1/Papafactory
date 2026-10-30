# Continuidad de PapaFactory

Fecha de esta guía: **30 de octubre de 2026**. Permite continuar sin el chat ni la cuenta del agente anterior.
Revisar Git y Releases para conocer cambios posteriores a esta fecha.

## Objetivo y estado

El usuario mantiene un punto de venta para web y Windows. Quiere administrar productos
desde el Gestor y actualizar la app instalada mediante un botón, sin reinstalaciones manuales repetidas.

Implementado:

- **Fajitas** en menú de ventas, formulario y filtro del Gestor.
- Fajitas abre el modal de agregados al agregarla y al editarla desde el pedido. Sus agregados permiten M y L; el tamaño base no cambia. Otros productos conservan M, L y XL.
- Los agregados se distinguen por nombre, tamaño y tipo para no mezclar precios y cantidades de M y L.
- Bebestibles prioriza `imagen_producto` de la API sobre las imágenes históricas por ID; ya no aplica la misma imagen genérica a los IDs numéricos.
- CRUD de productos con MockAPI. Crear desde un filtro preselecciona esa categoría.
- Clasificación compartida que respeta la categoría asignada sobre el nombre del producto.
- Corrección de la recarga después de guardar: se eliminó `?t=...`, que causaba 404.
- Avisos de conexión y conservación de cambios confirmados si falla una recarga posterior.
- Actualizador con consulta al iniciar, búsqueda manual, descarga con progreso y confirmación de reinicio.
- El botón aparece en Windows empaquetado; no en la web ni en Electron sin empaquetar.
- La interfaz bloquea el reinicio con pedido pendiente. No instala automáticamente al cerrar.
- GitHub Actions genera y publica versiones al subir cambios de `papafactory/` a `main`.

## Mapa del código activo

| Archivo | Responsabilidad |
| --- | --- |
| `papafactory/src/main.tsx` | Entrada React, importa `App.tsx`. |
| `papafactory/src/App.tsx` | Ventas, pedidos, historial, impresión, login local, Gestor y CRUD. Archivo grande; editar con cuidado. |
| `papafactory/src/App.css` | Estilos activos. |
| `papafactory/src/categorias.ts` | Categorías y normalización compartida. |
| `papafactory/src/apiProductos.ts` | Lectura del catálogo sin parámetros artificiales. |
| `papafactory/src/productos.json` | Catálogo de respaldo. |
| `papafactory/electron-simple.js` | Ventana principal, IPC autorizado y configuración del actualizador. |
| `papafactory/preload.cjs` | Expone únicamente `window.desktopUpdates`. |
| `papafactory/desktop-updates.cjs` | Estados de consulta, descarga, error e instalación. |
| `papafactory/src/DesktopUpdates.tsx` | Botón y estado de actualización en ambos encabezados. |
| `papafactory/package.json` | Dependencias, versión local y configuración activa de electron-builder. |
| `papafactory/build-admin.js` | Compila y genera NSIS x64 en `build-output/`, sin publicar. |
| `.github/workflows/desktop-release.yml` | Prueba, compila, numera y publica versiones. |
| `papafactory/ACTUALIZACIONES.md` | Uso y publicación del actualizador. |

Hay copias históricas `*-Jose.*`, otros scripts/configuraciones de Electron y una carpeta Tauri.
No asumir que son el punto de entrada. El flujo validado es el de la tabla.

## API y almacenamiento

Base: `https://6839d6ff6561b8d882b1e5de.mockapi.io`.
Recursos principales: `/Productos` y `/Agregados`; la app contempla variaciones de mayúsculas en las rutas.
`USE_LOCAL_DATA` debe permanecer en `false` para el uso normal.

Campos de producto: `id`, `nombre`, `tamano`, `precio`, `moneda`, `categoria`, `imagen_producto`.
En la interfaz se mapean `tamano` a `tamaño` e `imagen_producto` a `descripcion`.
Para agregados, revisar interfaces y normalizadores en `App.tsx`, que toleran estructuras anidadas y nombres de campos variables.

El fallo original se reprodujo contra la API real: `/Productos` respondía correctamente,
pero `/Productos?t=<timestamp>` devolvía 404. La app guardaba el producto y luego mostraba
el respaldo local, dando la impresión de que había desaparecido. No reintroducir ese parámetro.

El 30/10/2026 se corrigió únicamente la categoría de las Fajitas con IDs 21 a 25,
de `Papas Fritas` a `Fajitas`, conservando los demás campos y haciendo respaldo local previo.
El ID 26 ya era Fajitas. Se verificaron **25 productos y 6 fajitas**: son cantidades históricas,
no valores fijos para las pruebas. Algunos nombres o imágenes parecen de intentos previos;
no borrar ni fusionar productos sin indicación del usuario.

En una consulta posterior durante la última petición, el catálogo ya contenía una sola fajita:
ID 26, `Fajita Base Lechuga`, tamaño L, precio $2.500. El usuario confirmó la segunda opción: `Fajita Coleslaw`.
Se agregó a la API, sin imagen inventada; ambas opciones son L a $2.500. También se incluyeron en el catálogo de respaldo.
No restaurar los intentos antiguos ni limitar el CRUD a un número fijo de productos.

El historial de pedidos y otros estados usan `localStorage`, por ejemplo
`historialPedidosPapaFactory` y `usuarioAutenticadoPapaFactory`. No se sincronizan entre web y escritorio.
El acceso al Gestor se valida localmente en `ModalLogin`; no es autenticación de servidor.
No copiar sus credenciales a documentación, logs o mensajes. Migrar la autenticación sería un trabajo específico.

## GitHub y versiones

Repositorio: https://github.com/josemedina1/Papafactory, rama `main`.
Commits de referencia anteriores a esta guía:

- `46f6602`: Fajitas en menú y Gestor.
- `abe5098`: corrección de MockAPI y conservación de cambios.
- `339784b`: actualizador y publicación automática; incluye los ajustes locales previos del instalador.

El primer workflow completó correctamente la publicación de **v1.0.1**:
https://github.com/josemedina1/Papafactory/releases/tag/v1.0.1

Consultar siempre https://github.com/josemedina1/Papafactory/releases/latest para instalar la versión vigente.
Cada ejecución publica `1.0.<número de ejecución>`; el `package.json` local conserva inicialmente `1.0.0`.
El workflow modifica la versión solo en su entorno; no crea un commit de versión de vuelta a `main`.
Conservar su historial para mantener versiones crecientes.

La release incluye `PapaFactory-Setup-<versión>.exe`, `.exe.blockmap` y `latest.yml`.
Localmente el instalador usa espacios (`PapaFactory Setup 1.0.0.exe`); el workflow renombra
instalador y blockmap para que coincidan con las URLs del manifiesto.
La release se prepara en borrador y solo se publica cuando termina de subir sus archivos.

GitHub Actions usa su token temporal con `contents: write`; no hay tokens personales incrustados en Electron.
Conservar `appId: com.papafactory.app`, destino NSIS y proveedor GitHub.
No hay un certificado de firma digital configurado actualmente.

Una instalación antigua necesita instalar una versión con actualizador una vez.
Después puede usar **Buscar actualizaciones → Descargar → Actualizar y reiniciar**.
Los cambios del catálogo llegan desde la API sin release; los cambios de código requieren la publicación automática.
Desplegar únicamente un sitio externo no actualiza los archivos de escritorio.

## Comprobaciones realizadas

- `npm test`: **11 pruebas aprobadas** de categorías, tamaños de agregados, lectura de API y controlador de actualizaciones.
- `npm run build`: TypeScript y Vite aprobados.
- `npm run build-admin`: instalador local `1.0.0` generado en Windows.
- Archivos de `app.asar` comparados con la compilación, incluidos preload y controlador.
- SHA512 del instalador, `latest.yml` y proveedor de `app-update.yml` verificados.
- Puente IPC probado con simulaciones: remitentes permitidos, rechazo de otros remitentes y cancelación de instalación.
- Catálogo real leído y Fajitas visibles en Gestor y menú después de recargar.
- Verificación en pestaña de prueba: modal Fajitas solo M/L, base L a $2.500, Mayonesa M $900 y L $1.100 suman $4.500; decrementar L conserva M, y reabrir el pedido permite editarlo. No se finalizó ningún pedido de prueba.
- Se comprobaron siete URLs distintas de bebestibles en el DOM, coincidentes con las imágenes de la API. Las URLs remotas que fallen se ocultan, sin reintentar infinitamente ni mostrar una imagen genérica repetida.
- Workflow remoto con pruebas, empaquetado y publicación de v1.0.1 completados.
- Prueba sin ventana con **electron-updater real** y app `1.0.0`: detectó `1.0.1` en GitHub.

La revisión visual final de la nueva app empaquetada se interrumpió con Escape.
**No se completó una actualización instalada de extremo a extremo en el equipo del usuario.**
La detección y publicación están comprobadas; no presentarlas como prueba de instalación completa.

## Pendientes y cómo continuar

1. Leer la nueva petición y revisar `git status`. Las dos fajitas actuales son Base Lechuga y Coleslaw, ambas L a $2.500; no queda otra función de negocio acordada pendiente.
2. Para validar el actualizador completo, usar una instalación de prueba: búsqueda, descarga,
   bloqueo con pedido pendiente, confirmación, reinicio y persistencia del historial.
   No interrumpir ventas reales ni modificar el catálogo real como prueba.
3. Si se toca impresión, probar tickets e historial en Windows: se abren ventanas `about:blank`
   y ahora Electron usa aislamiento de contexto y sandbox. La impresora física no se revalidó en este trabajo.
4. Ejecutar los comandos del README y mantener esta guía actualizada con decisiones y tareas reales.

## Recuperar el proyecto sin el chat

Clonar el repositorio y entregar al agente disponible el mensaje de continuidad del README.
El código y esta documentación están en GitHub; los instaladores publicados están en Releases.
`node_modules/`, `dist/` y `build-output/` se regeneran y no son necesarios para recuperar el código.
Los datos de MockAPI y el historial local son recursos separados: no se recuperan únicamente clonando Git.
