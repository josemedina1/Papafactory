const fs = require('fs');
const path = require('path');

console.log('🎨 Preparando icono PNG para la aplicación...');

const inputPath = path.join(__dirname, 'src/assets/iconPapa1.png');
const outputPath = path.join(__dirname, 'public/icon.png');

// Verificar que existe el archivo PNG
if (!fs.existsSync(inputPath)) {
  console.error('❌ No se encontró el archivo:', inputPath);
  process.exit(1);
}

try {
  // Copiar el archivo PNG a public
  fs.copyFileSync(inputPath, outputPath);
  console.log('✅ ¡Icono PNG copiado exitosamente!');
  console.log('📁 Archivo guardado en:', outputPath);
  console.log('💡 Nota: Usando PNG directamente. Para mejor compatibilidad, convierte a ICO online.');
  
} catch (error) {
  console.error('❌ Error al copiar:', error.message);
} 