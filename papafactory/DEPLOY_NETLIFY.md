# Guía de Despliegue en Netlify - PapaFactory

Esta guía te ayudará a desplegar tu aplicación PapaFactory en Netlify.

## 📋 Requisitos Previos

1. Una cuenta en [Netlify](https://www.netlify.com) (gratuita)
2. Tu proyecto en un repositorio Git (GitHub, GitLab, o Bitbucket)
3. Node.js instalado localmente (para pruebas)

## 🚀 Opción 1: Despliegue Automático desde Git (Recomendado)

### Paso 1: Subir tu código a Git

Asegúrate de que tu código esté en un repositorio Git:

```bash
git add .
git commit -m "Preparado para Netlify"
git push origin main
```

### Paso 2: Conectar con Netlify

1. Ve a [app.netlify.com](https://app.netlify.com)
2. Haz clic en **"Add new site"** → **"Import an existing project"**
3. Conecta tu repositorio (GitHub, GitLab, o Bitbucket)
4. Selecciona el repositorio de PapaFactory

### Paso 3: Configurar el Build

Netlify detectará automáticamente la configuración desde `netlify.toml`, pero verifica:

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Base directory:** (deja vacío o `papafactory` si tu repo tiene subcarpetas)

### Paso 4: Desplegar

1. Haz clic en **"Deploy site"**
2. Espera a que termine el build (2-5 minutos)
3. ¡Tu sitio estará en línea!

## 🚀 Opción 2: Despliegue Manual (Drag & Drop)

Si prefieres desplegar manualmente:

### Paso 1: Construir el proyecto localmente

```bash
cd papafactory
npm install
npm run build
```

### Paso 2: Subir a Netlify

1. Ve a [app.netlify.com](https://app.netlify.com)
2. Arrastra la carpeta `dist` a la zona de "Deploy manually"
3. ¡Listo! Tu sitio estará en línea

## ⚙️ Configuración Automática

El archivo `netlify.toml` ya está configurado con:

- ✅ Comando de build: `npm run build`
- ✅ Directorio de publicación: `dist`
- ✅ Redirecciones para SPA (Single Page Application)
- ✅ Headers de seguridad
- ✅ Caché optimizado para assets

## 🔧 Variables de Entorno (Opcional)

Si necesitas variables de entorno en el futuro:

1. Ve a **Site settings** → **Environment variables**
2. Agrega las variables necesarias
3. Netlify las inyectará automáticamente durante el build

## 📝 Notas Importantes

### Funcionalidad en Web vs Electron

- ✅ **Funciona en Web:** Toda la interfaz, selección de productos, pedidos
- ⚠️ **Limitado en Web:** La impresión usará el diálogo del navegador (no impresión silenciosa)
- ✅ **LocalStorage:** Funciona perfectamente en web para guardar historial

### Dominio Personalizado

1. Ve a **Site settings** → **Domain management**
2. Haz clic en **"Add custom domain"**
3. Sigue las instrucciones para configurar tu dominio

### Actualizaciones Automáticas

Cada vez que hagas `git push`, Netlify:
1. Detectará los cambios
2. Ejecutará `npm run build`
3. Desplegará automáticamente la nueva versión

## 🐛 Solución de Problemas

### Error: "Build failed"

**Causa común:** Dependencias faltantes

**Solución:**
```bash
# Verifica que package.json tenga todas las dependencias
npm install
npm run build
```

### Error: "Page not found" al navegar

**Causa:** Falta el archivo `_redirects`

**Solución:** Asegúrate de que `public/_redirects` esté en el repositorio

### Error: "Assets not loading"

**Causa:** Problema con rutas relativas

**Solución:** Verifica que `vite.config.ts` tenga `base: './'`

## 📊 Monitoreo

Netlify proporciona:
- 📈 Analytics de tráfico
- 🔍 Logs de build
- ⚡ Performance insights
- 🔒 SSL automático

## 🔗 URLs

Una vez desplegado, tendrás:
- **URL de producción:** `https://tu-sitio.netlify.app`
- **URL de preview:** Se genera automáticamente para cada pull request

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs de build en Netlify
2. Verifica que `netlify.toml` esté correcto
3. Asegúrate de que `package.json` tenga todas las dependencias

---

¡Tu aplicación PapaFactory ahora está disponible en la web! 🌐

