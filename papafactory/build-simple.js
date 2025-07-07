const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 Construcción simple de PapaFactory...');

try {
  // 1. Construir la aplicación React
  console.log('⚛️ Construyendo aplicación React...');
  execSync('npm run build', { stdio: 'inherit' });

  // 2. Verificar que se creó la carpeta dist
  if (!fs.existsSync('dist')) {
    throw new Error('No se pudo crear la carpeta dist');
  }

  // 3. Construir el ejecutable de Electron
  console.log('🖥️ Construyendo ejecutable de Electron...');
  execSync('npx electron-builder', { stdio: 'inherit' });

  console.log('✅ ¡PapaFactory construido exitosamente!');
  console.log('📁 Busca tu ejecutable en la carpeta: dist-electron/');

} catch (error) {
  console.error('❌ Error durante la construcción:', error.message);
  console.log('💡 Sugerencia: Cierra cualquier instancia de PapaFactory y vuelve a intentar');
  process.exit(1);
} 