const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando construcción de PapaFactory para Electron...');

// Función para limpiar directorios de forma más robusta
function cleanDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  
  try {
    console.log(`🧹 Limpiando ${dirPath}...`);
    
    // Intentar eliminar archivos individualmente
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      try {
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
          fs.rmSync(filePath, { recursive: true, force: true });
        } else {
          fs.unlinkSync(filePath);
        }
      } catch (err) {
        console.warn(`⚠️ No se pudo eliminar ${filePath}: ${err.message}`);
      }
    }
    
    // Intentar eliminar el directorio principal
    try {
      fs.rmdirSync(dirPath);
    } catch (err) {
      console.warn(`⚠️ No se pudo eliminar el directorio ${dirPath}, continuando...`);
    }
    
  } catch (error) {
    console.warn(`⚠️ Error al limpiar ${dirPath}: ${error.message}`);
    console.log('Continuando con la construcción...');
  }
}

try {
  // 1. Limpiar directorios anteriores
  cleanDirectory('dist');
  cleanDirectory('dist-electron');

  // 2. Construir la aplicación React
  console.log('⚛️ Construyendo aplicación React...');
  execSync('npm run build', { stdio: 'inherit' });

  // 3. Verificar que se creó la carpeta dist
  if (!fs.existsSync('dist')) {
    throw new Error('No se pudo crear la carpeta dist');
  }

  // 4. Construir el ejecutable de Electron
  console.log('🖥️ Construyendo ejecutable de Electron...');
  execSync('npx electron-builder', { stdio: 'inherit' });

  console.log('✅ ¡PapaFactory construido exitosamente!');
  console.log('📁 Busca tu ejecutable en la carpeta: dist-electron/');

} catch (error) {
  console.error('❌ Error durante la construcción:', error.message);
  process.exit(1);
} 