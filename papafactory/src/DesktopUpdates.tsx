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
  const label = state.status === 'available' ? 'Descargar actualización'
    : state.status === 'downloaded' ? 'Actualizar y reiniciar'
    : state.status === 'checking' ? 'Buscando actualizaciones…'
    : state.status === 'downloading' ? `Descargando… ${state.percent || 0}%`
    : installing ? 'Preparando actualización…' : 'Buscar actualizaciones'
  const message = state.status === 'error' ? state.message
    : state.status === 'downloaded' && hasPendingOrder ? 'Finaliza el pedido actual antes de reiniciar.' : ''
  const hint = message || (state.status === 'current' ? 'Estás al día. Buscar actualizaciones' : label)
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
      <button type="button" className="desktop-update-button" aria-label={label} title={hint} disabled={busy || (state.status === 'downloaded' && hasPendingOrder)} onClick={() => void run()}>
        <svg className={busy ? 'desktop-update-spinning' : undefined} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
          <path d="M3 12a9 9 0 0 1 15.36-6.36L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.36 6.36L3 16M3 21v-5h5" />
        </svg>
        {(state.status === 'available' || state.status === 'downloaded') && <span className="desktop-update-dot" aria-hidden="true" />}
      </button>
      <span className="visually-hidden" role="status" aria-live="polite">{hint}</span>
      {message && <small className="desktop-update-message">{message}</small>}
      {state.status === 'downloading' && <small className="desktop-update-progress">{state.percent || 0}%</small>}
    </div>
  )
}
