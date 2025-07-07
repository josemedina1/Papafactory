const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Construyendo PapaFactory...');

try {
  console.log('1️⃣ Construyendo React...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('2️⃣ Generando ejecutable...');
  
  // Construir sin firma
  execSync('npx electron-builder --win --config.win.forceCodeSigning=false', { 
    stdio: 'inherit'
  });
  
  console.log('\n✅ ¡LISTO! Tu ejecutable está en: build-output/');
  console.log('📁 Busca PapaFactory Setup 1.0.0.exe');
  
} catch (error) {
  console.error('❌ Error:', error.message);
  console.log('💡 Si persiste el error, usa: npm run build-simple-exe');
} 