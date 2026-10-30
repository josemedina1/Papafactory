// La lógica se mantiene independiente de Electron para probar los estados y reintentos.
function createUpdateController({ updater, version, enabled, onState = () => {} }) {
  let state = { status: enabled ? 'idle' : 'unsupported', currentVersion: version };
  let busy = false;
  const setState = (next) => {
    state = { currentVersion: version, ...next };
    onState(state);
  };
  const fail = (error) => {
    console.error('Actualización de escritorio:', error);
    setState({ status: 'error', message: 'No se pudo consultar o descargar la actualización. Revisa tu conexión y vuelve a intentarlo.' });
  };

  updater.autoDownload = false;
  updater.autoInstallOnAppQuit = false;
  updater.allowPrerelease = false;
  updater.allowDowngrade = false;
  updater.on('update-available', (info) => setState({ status: 'available', version: info.version }));
  updater.on('update-not-available', () => setState({ status: 'current' }));
  updater.on('download-progress', (progress) => setState({ status: 'downloading', version: state.version, percent: Math.max(0, Math.min(100, Math.round(progress.percent))) }));
  updater.on('update-downloaded', (info) => setState({ status: 'downloaded', version: info.version }));
  updater.on('error', fail);

  return {
    getState: () => ({ ...state }),
    async check() {
      if (!enabled || busy || ['available', 'downloaded'].includes(state.status)) return { ...state };
      busy = true;
      setState({ status: 'checking' });
      try { await updater.checkForUpdates(); } catch (error) { fail(error); }
      finally { busy = false; }
      return { ...state };
    },
    async download() {
      if (!enabled || busy || state.status !== 'available') return { ...state };
      busy = true;
      setState({ status: 'downloading', version: state.version, percent: 0 });
      try { await updater.downloadUpdate(); } catch (error) { fail(error); }
      finally { busy = false; }
      return { ...state };
    },
    install() {
      if (!enabled || busy || state.status !== 'downloaded') return false;
      updater.quitAndInstall(false, true);
      return true;
    }
  };
}

module.exports = { createUpdateController };
