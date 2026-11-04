# Continuidad de PapaFactory

Fecha de esta guía: **4 de noviembre de 2026**. Permite continuar sin el chat ni la cuenta del agente anterior.
Revisar Git y Releases para conocer cambios posteriores a esta fecha.

## Objetivo y estado

El usuario mantiene un punto de venta para web y Windows. Quiere administrar productos
desde el Gestor y actualizar la app instalada mediante un botón, sin reinstalaciones manuales repetidas.

Implementado:

- **Fajitas** en menú de ventas, formulario y filtro del Gestor.
- Fajitas abre el modal de agregados al agregarla y al editarla desde el pedido. Sus agregados permiten solamente L; el tamaño base no cambia. Otros productos conservan M, L y XL.
- Los agregados se distinguen por nombre, tamaño y tipo para no mezclar precios y cantidades de M y L.
- Bebestibles prioriza `imagen_producto` de la API sobre las imágenes históricas por ID; ya no aplica la misma imagen genérica a los IDs numéricos.
- CRUD de productos con MockAPI. Crear desde un filtro preselecciona esa categoría.
- Botón **Nueva categoría** junto a Nuevo Producto, con formulario, control de duplicados y categorías disponibles en filtros, selector de productos y secciones del menú de ventas.
- Las categorías vacías se conservan en `localStorage` (`categoriasPapaFactory`) en ese navegador/app. Las categorías de productos se descubren al leer el catálogo de la API, por lo que aparecen en otros equipos cuando ya tienen productos. No hay un recurso independiente de categorías en la API; no afirmar sincronización de categorías vacías entre equipos.
- Las categorías del Gestor se pueden arrastrar y soltar para ordenar; el menú principal y el selector usan el mismo orden. `Todas` es un filtro fijo. También se pueden mover con Alt + flechas al enfocar una categoría. El orden se guarda localmente en `ordenCategoriasPapaFactory`, no se sincroniza entre dispositivos.
- Clasificación compartida que respeta la categoría asignada sobre el nombre del producto.
- Corrección de la recarga después de guardar: se eliminó `?t=...`, que causaba 404.
- Avisos de conexión y conservación de cambios confirmados si falla una recarga posterior.
- Actualizador con consulta al iniciar, búsqueda manual, descarga con progreso y confirmación de reinicio.
- El control de actualización es un icono circular de refresh, sin versión visible. Conserva nombres accesibles, indicación de actualización disponible, progreso y mensajes de error o pedido pendiente.
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
| `papafactory/src/ModalCategoria.tsx` | Creación de categorías con nombre validado y mensajes de error. |
| `papafactory/src/FiltrosCategorias.tsx` | Filtros arrastrables y reordenamiento por teclado. |
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
Los precios y cantidades anteriores son históricos: el usuario sigue editando el catálogo real.
En la prueba de orden del 04/11 se observaron otros precios y una categoría Chicken pop corn;
no se modificó ningún producto ni se deben restaurar precios antiguos desde esta guía.

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

- `npm test`: **24 pruebas aprobadas** de categorías personalizadas, orden, almacenamiento de categorías, tamaños por producto, precios chilenos, guardado del catálogo, lectura de API y controlador de actualizaciones. Se integraron antes de publicar los commits remotos `f5231c8` y `a7a8fdd`, conservando sus cambios de tamaños y persistencia.
- Orden verificado en sesión de prueba (`127.0.0.1`): arrastre real de Chicken pop corn al inicio, mismo orden de secciones en el menú principal antes y después de recargar, movimiento por teclado y filtro funcionando. El orden de prueba no se aplicó al origen `localhost` del usuario.
- Nueva categoría verificada en una sesión local separada (`127.0.0.1`): rechazo de alias duplicado, creación, filtro, preselección en Nuevo Producto y persistencia tras recargar. No se crearon productos de prueba en la API.
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

1. Leer la nueva petición y revisar `git status`. Los nombres y precios vigentes deben consultarse en la API; no queda otra función de negocio acordada pendiente.
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

## Ajuste del 31/10/2026

- Las fajitas ahora muestran únicamente agregados L en el modal, tanto al agregar como al editar el pedido. Otros productos conservan M, L y XL. La prueba histórica con M/L descrita arriba corresponde al comportamiento anterior.

## Tamaños de agregados por producto (31/10/2026)

- Nuevo Producto y Editar Producto permiten marcar M, L y XL. La selección se envía en el campo de producto `tamanosAgregados` y se conserva en el mapeo desde la API y al editar.
- Un arreglo vacío desactiva los agregados; una selección explícita prevalece sobre la categoría, también para categorías personalizadas.
- Productos sin ese campo conservan el comportamiento anterior: fajitas solo L, papas/chorrillanas/salchipapas M/L/XL y otras categorías sin agregados.
- No se modificaron productos reales para probar esta función.

## Guardado del Gestor (31/10/2026)

- Productos y agregados usan guardarCatalogo.ts para enviar todos los campos y verificar la respuesta del servidor. Si devuelve datos distintos, el modal sigue abierto y muestra qué campos no fueron confirmados.
- Se actualiza el catálogo visible con el registro confirmado y se evita recargar inmediatamente una lista que pueda devolver valores anteriores. Las imágenes se pueden quitar enviando una cadena vacía.
- Pruebas de persistencia con API simulada; no se modificaron precios reales como prueba. El fallo original no se reprodujo de extremo a extremo contra la API real.

- Se comprobó en navegador contra un servidor simulado: edición conjunta de nombre, tamaño, precio, categoría, imagen y agregados; guardado y persistencia después de recargar. La API real solo se leyó.
- Los campos de precio permiten escribir y pegar formato chileno (5.500 o $5.500) y se interpretan sin perder los miles. El tamaño del producto es opcional.
