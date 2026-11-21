import { useCallback, useEffect, useRef, useState } from 'react'

// Reemplaza window.confirm/alert: en Electron para Windows, tras un diálogo nativo
// los campos de texto pueden quedar sin recibir teclado hasta cambiar de ventana.
type Peticion = { mensaje: string; confirmar: string; cancelar?: string; peligro?: boolean; resolver: (ok: boolean) => void }

export function useDialogo() {
  const [peticion, setPeticion] = useState<Peticion | null>(null)
  const confirmar = useCallback((mensaje: string, confirmarTexto = 'Eliminar') =>
    new Promise<boolean>(resolver => setPeticion({ mensaje, confirmar: confirmarTexto, cancelar: 'Cancelar', peligro: true, resolver })), [])
  const avisar = useCallback((mensaje: string) =>
    new Promise<void>(resolver => setPeticion({ mensaje, confirmar: 'Aceptar', resolver: () => resolver() })), [])
  const cerrar = (ok: boolean) => { peticion?.resolver(ok); setPeticion(null) }
  const dialogo = peticion && <Dialogo peticion={peticion} onCerrar={cerrar} />
  return { confirmar, avisar, dialogo }
}

function Dialogo({ peticion, onCerrar }: { peticion: Peticion; onCerrar: (ok: boolean) => void }) {
  const boton = useRef<HTMLButtonElement>(null)
  useEffect(() => { boton.current?.focus() }, [])
  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onCerrar(false) }}
      onKeyDown={e => { if (e.key === 'Escape') onCerrar(false) }}>
      <div className="modal-content dialogo-app" role="alertdialog" aria-modal="true" aria-describedby="dialogo-mensaje">
        <div className="modal-body">
          <p id="dialogo-mensaje" className="dialogo-mensaje">{peticion.mensaje}</p>
          <div className="gestor-acciones">
            {peticion.cancelar && <button type="button" className="btn btn-outline-secondary" onClick={() => onCerrar(false)}>{peticion.cancelar}</button>}
            <button ref={boton} type="button" className={peticion.peligro ? 'btn-eliminar' : 'btn-crear-producto'} onClick={() => onCerrar(true)}>{peticion.confirmar}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
