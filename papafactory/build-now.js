const { execSync } = require('child_process');

console.log('🚀 Construyendo PapaFactory AHORA...');

try {
  console.log('1️⃣ Construyendo React...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('2️⃣ Generando ejecutable...');
  execSync('npx electron-builder --win', { stdio: 'inherit' });
  
  console.log('✅ ¡LISTO! Tu ejecutable está en: build-output/');
  console.log('📁 Busca el archivo .exe en esa carpeta');
  
} catch (error) {
  console.error('❌ Error:', error.message);
} 