# PapaFactory - Sistema de Punto de Venta

Sistema de punto de venta para PapaFactory construido con React + TypeScript + Electron.

## 🌐 Despliegue Web

Este proyecto puede desplegarse tanto como:
- **Aplicación de escritorio** (Electron) - Ver sección "Instalación en un Nuevo Equipo"
- **Aplicación web** (Netlify) - Ver [DEPLOY_NETLIFY.md](./DEPLOY_NETLIFY.md) para instrucciones completas

### Despliegue Rápido en Netlify

1. Sube tu código a un repositorio Git
2. Conecta el repositorio con Netlify
3. Netlify detectará automáticamente la configuración desde `netlify.toml`
4. ¡Listo! Tu app estará en línea

Para más detalles, consulta [DEPLOY_NETLIFY.md](./DEPLOY_NETLIFY.md)

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** versión 18 o superior ([Descargar aquí](https://nodejs.org))
- **npm** (viene incluido con Node.js)
- **Git** para clonar el repositorio

## Instalación en un Nuevo Equipo

Sigue estos pasos para configurar el proyecto en cualquier computador:

### 1. Clonar el Repositorio

```bash
git clone [URL_DEL_REPOSITORIO]
cd Papafactory/papafactory
```

### 2. Instalar Dependencias

```bash
npm install
```

Este comando instalará automáticamente todas las dependencias necesarias listadas en `package.json`.

### 3. Crear el Instalador .exe

Una vez instaladas las dependencias, puedes generar el instalador con cualquiera de estos comandos:

#### Opción 1: Build Estándar (Recomendado)
```bash
npm run build-admin
```

#### Opción 2: Build Simple (Si hay problemas con la opción 1)
```bash
npm run build-simple-exe
```

El instalador se generará en la carpeta: `build-output/PapaFactory Setup 0.0.0.exe`

## Comandos Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Compila el proyecto React
- `npm run build-admin` - Genera el instalador .exe sin firma digital
- `npm run build-simple-exe` - Genera el instalador .exe (versión simplificada)
- `npm run electron` - Inicia la aplicación en modo Electron

## Solución de Problemas Comunes

### Error de Permisos en Windows

Si encuentras errores de permisos al ejecutar scripts, abre PowerShell como Administrador y ejecuta:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Error de Memoria Insuficiente

Si el build falla por memoria insuficiente:

```bash
# En PowerShell
$env:NODE_OPTIONS="--max-old-space-size=4096"
npm run build-admin
```

### Limpiar Caché y Reinstalar

Si tienes problemas persistentes:

```bash
rm -rf node_modules package-lock.json dist build-output
npm install
npm run build-admin
```

### Verificar Versión de Node.js

```bash
node --version
# Debe ser v18.0.0 o superior
```

## Estructura del Proyecto

```
papafactory/
├── src/                    # Código fuente
│   ├── App.tsx            # Componente principal
│   ├── productos.json     # Base de datos de productos
│   └── ...
├── public/                # Recursos públicos (iconos, etc.)
├── dist/                  # Build de desarrollo (generado)
├── build-output/          # Instalador final (generado)
├── build-admin.js         # Script para generar instalador
├── electron-simple.js     # Configuración de Electron
├── package.json           # Dependencias del proyecto
└── vite.config.ts         # Configuración de Vite

```

## Archivos Importantes (NO Eliminar)

Estos archivos son esenciales para generar el instalador:

- `package.json` - Lista de dependencias
- `package-lock.json` - Versiones exactas de paquetes
- `tsconfig*.json` - Configuración de TypeScript
- `vite.config.ts` - Configuración de Vite
- `electron-builder.yml` - Configuración del instalador
- `build-*.js` - Scripts de construcción
- `electron-*.js` / `*.cjs` - Archivos de Electron
- `src/` - Todo el código fuente
- `public/` - Assets públicos (iconos, etc.)

## Tecnologías Utilizadas

- **React 19** - Framework de interfaz de usuario
- **TypeScript** - Lenguaje tipado
- **Vite** - Build tool y servidor de desarrollo
- **Electron** - Framework para aplicaciones de escritorio
- **Electron Builder** - Generador de instaladores
- **Bootstrap 5** - Framework CSS

## Notas de Desarrollo

- Los tamaños de productos ahora usan nomenclatura: M, L, XL
- El sistema maneja papas fritas, chorrillanas, bebidas y extras
- Impresión configurada para tickets de 58mm

## Contacto y Soporte

Para problemas o consultas, contactar al equipo de desarrollo.
