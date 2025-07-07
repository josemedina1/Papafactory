const { execSync } = require('child_process');

console.log('🚀 Construyendo PapaFactory SIN FIRMA...');

try {
  console.log('1️⃣ Construyendo React...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('2️⃣ Generando ejecutable SIN FIRMA...');
  execSync('npx electron-builder --win --config.win.forceCodeSigning=false', { stdio: 'inherit' });
  
  console.log('✅ ¡LISTO! Tu ejecutable está en: build-output/');
  console.log('📁 Busca PapaFactory Setup 0.0.0.exe');
  
} catch (error) {
  console.error('❌ Error:', error.message);
  console.log('💡 Si persiste el error, usa: npm run build-simple-exe');
} 