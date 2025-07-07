const { execSync } = require('child_process');

console.log('🚀 Generando ejecutable SIMPLE...');

try {
  console.log('1️⃣ Construyendo React...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('2️⃣ Generando SOLO el ejecutable...');
  execSync('npx electron-builder --win --config.win.target=dir', { stdio: 'inherit' });
  
  console.log('✅ ¡LISTO! Tu aplicación está en: build-output/win-unpacked/');
  console.log('📁 Ejecuta: build-output/win-unpacked/PapaFactory.exe');
  
} catch (error) {
  console.error('❌ Error:', error.message);
} 