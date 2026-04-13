const { execSync } = require('child_process');

console.log('🚀 Construyendo PapaFactory como EJECUTABLE PORTABLE...');

try {
  console.log('1️⃣ Construyendo React...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('2️⃣ Generando ejecutable portable (sin instalador)...');
  // Usar target portable para crear un .exe que no requiere instalación
  execSync('npx electron-builder --win portable --config.win.forceCodeSigning=false', { stdio: 'inherit' });
  
  console.log('✅ ¡LISTO! Tu ejecutable portable está en: build-output/');
  console.log('📁 Busca PapaFactory.exe (ejecutable portable)');
  
} catch (error) {
  console.error('❌ Error:', error.message);
  console.log('💡 Asegúrate de que electron-builder esté instalado: npm install electron-builder --save-dev');
}
