const { execSync } = require('child_process');

console.log('Construyendo PapaFactory SIN FIRMA...');

const buildEnv = {
  ...process.env,
  CSC_IDENTITY_AUTO_DISCOVERY: 'false'
};

try {
  console.log('1. Construyendo React...');
  execSync('npm run build', { stdio: 'inherit' });

  console.log('2. Generando ejecutable SIN FIRMA...');
  execSync(
    'npx --no-install electron-builder --win nsis --x64 --publish never --config.win.forceCodeSigning=false --config.win.signAndEditExecutable=false --config.win.verifyUpdateCodeSignature=false',
    { stdio: 'inherit', env: buildEnv }
  );

  console.log('LISTO. Tu ejecutable está en: build-output/');
  console.log(`Busca PapaFactory Setup ${require('./package.json').version}.exe`);

} catch (error) {
  console.error('Error:', error.message);
  console.log('Si Windows vuelve a bloquear winCodeSign, abre la terminal como Administrador o activa el Modo desarrollador.');
  console.log('Para generar la app sin instalador, usa: npm run build-simple-exe');
  process.exitCode = 1;
}
