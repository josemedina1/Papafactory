const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Construcción forzada de PapaFactory...');

function forceCleanDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  
  try {
    console.log(`🧹 Limpieza forzada de ${dirPath}...`);
    
    // Usar PowerShell para forzar la eliminación
    const psCommand = `Remove-Item -Path "${dirPath}" -Recurse -Force -ErrorAction SilentlyContinue`;
    execSync(`powershell -Command "${psCommand}"`, { stdio: 'pipe' });
    
    // Esperar un momento
    setTimeout(() => {}, 1000);
    
  } catch (error) {
    console.warn(`⚠️ Error al limpiar ${dirPath}: ${error.message}`);
    console.log('Continuando con la construcción...');
  }
}

try {
  // 1. Terminar procesos de Electron/PapaFactory
  try {
    console.log('🔄 Terminando procesos de Electron...');
    execSync('taskkill /f /im electron.exe /t', { stdio: 'pipe' });
  } catch (e) {
    // Ignorar si no hay procesos
  }
  
  try {
    execSync('taskkill /f /im papafactory.exe /t', { stdio: 'pipe' });
  } catch (e) {
    // Ignorar si no hay procesos
  }

  // 2. Limpiar directorios
  forceCleanDirectory('dist');
  forceCleanDirectory('dist-electron');
  forceCleanDirectory('build-output');

  // 3. Construir la aplicación React
  console.log('⚛️ Construyendo aplicación React...');
  execSync('npm run build', { stdio: 'inherit' });

  // 4. Verificar que se creó la carpeta dist
  if (!fs.existsSync('dist')) {
    throw new Error('No se pudo crear la carpeta dist');
  }

  // 5. Construir el ejecutable de Electron
  console.log('🖥️ Construyendo ejecutable de Electron...');
  execSync('npx electron-builder', { stdio: 'inherit' });

  console.log('✅ ¡PapaFactory construido exitosamente!');
  console.log('📁 Busca tu ejecutable en la carpeta: build-output/');

} catch (error) {
  console.error('❌ Error durante la construcción:', error.message);
  console.log('💡 Sugerencia: Ejecuta como administrador o reinicia el sistema');
  process.exit(1);
} 