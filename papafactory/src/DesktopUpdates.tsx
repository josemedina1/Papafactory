import { useEffect, useState } from 'react'

export interface DesktopUpdateState {
  status: 'idle' | 'unsupported' | 'checking' | 'current' | 'available' | 'downloading' | 'downloaded' | 'error';
  currentVersion: string;
  version?: string;
  percent?: number;
  message?: string;
}

declare global {
  interface Window {
    desktopUpdates?: {
      getState: () => Promise<DesktopUpdateState>;
      check: () => Promise<DesktopUpdateState>;
      download: () => Promise<DesktopUpdateState>;
      install: () => Promise<boolean>;
      onState: (callback: (state: DesktopUpdateState) => void) => () => void;
    };
  }
}

export default function DesktopUpdates({ hasPendingOrder }: { hasPendingOrder: boolean }) {
  const [state, setState] = useState<DesktopUpdateState | null>(null)
  const [installing, setInstalling] = useState(false)
  useEffect(() => {
    const api = window.desktopUpdates
    if (!api) return
    let active = true
    const unsubscribe = api.onState((next) => { if (active) setState(next) })
    void api.getState().then((next) => { if (active) setState(next) }).catch(() => {})
    return () => { active = false; unsubscribe() }
  }, [])

  if (!state || state.status === 'unsupported') return null
  const busy = state.status === 'checking' || state.status === 'downloading' || installing
  const label = state.status === 'available' ? `Descargar v${state.version}`
    : state.status === 'downloaded' ? 'Actualizar y reiniciar'
    : state.status === 'checking' ? 'Buscando actualizaciones…'
    : state.status === 'downloading' ? `Descargando… ${state.percent || 0}%`
    : installing ? 'Preparando actualización…' : 'Buscar actualizaciones'
  const run = async () => {
    const api = window.desktopUpdates
    if (!api) return
    try {
      if (state.status === 'downloaded') {
        if (hasPendingOrder) return
        setInstalling(true)
        await api.install()
      } else if (state.status === 'available') await api.download()
      else await api.check()
    } catch {
      setState({ status: 'error', currentVersion: state.currentVersion, message: 'No se pudo iniciar la actualización. Vuelve a intentarlo.' })
    } finally { setInstalling(false) }
  }
  return (
    <div className="desktop-updates">
      <button type="button" className="btn-gestor" disabled={busy || (state.status === 'downloaded' && hasPendingOrder)} onClick={() => void run()}>
        {label}
      </button>
      <small role="status" aria-live="polite">
        {state.status === 'error' ? state.message
          : state.status === 'downloaded' && hasPendingOrder ? 'Finaliza el pedido actual antes de reiniciar.'
          : state.status === 'current' ? `v${state.currentVersion} · Estás al día`
          : `Versión ${state.currentVersion}`}
      </small>
    </div>
  )
}
