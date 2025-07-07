const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🎨 Creando icono ICO desde PNG...');

const inputPath = path.join(__dirname, 'src/assets/iconPapa1.png');
const outputPath = path.join(__dirname, 'public/icon.ico');

// Verificar que existe el archivo PNG
if (!fs.existsSync(inputPath)) {
  console.error('❌ No se encontró el archivo:', inputPath);
  process.exit(1);
}

try {
  // Comando PowerShell para convertir PNG a ICO con redimensionamiento
  const psCommand = `
    Add-Type -AssemblyName System.Drawing;
    $img = [System.Drawing.Image]::FromFile('${inputPath.replace(/\//g, '\\')}');
    $newImg = New-Object System.Drawing.Bitmap(256, 256);
    $graphics = [System.Drawing.Graphics]::FromImage($newImg);
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic;
    $graphics.DrawImage($img, 0, 0, 256, 256);
    $newImg.Save('${outputPath.replace(/\//g, '\\')}', [System.Drawing.Imaging.ImageFormat]::Icon);
    $graphics.Dispose();
    $newImg.Dispose();
    $img.Dispose();
  `;

  console.log('🔄 Convirtiendo imagen...');
  execSync(`powershell -Command "${psCommand}"`, { stdio: 'inherit' });
  
  console.log('✅ ¡Icono creado exitosamente!');
  console.log('📁 Archivo guardado en:', outputPath);
  
} catch (error) {
  console.error('❌ Error al convertir:', error.message);
  console.log('💡 Usa un convertidor online como https://convertio.co/es/png-ico/');
} 