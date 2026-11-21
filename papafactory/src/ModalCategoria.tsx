import { useState } from 'react'
import { limpiarNombreCategoria, mismaCategoria, validarNombreCategoria } from './categorias'

// Sin `categoriaActual` crea una categoría; con ella, la renombra.
export default function ModalCategoria({ categorias, categoriaActual, cantidadProductos = 0, onClose, onSave }: {
  categorias: string[];
  categoriaActual?: string;
  cantidadProductos?: number;
  onClose: () => void;
  onSave: (nombre: string) => void | Promise<void>;
}) {
  const editando = !!categoriaActual
  const [nombre, setNombre] = useState(categoriaActual || '')
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)
  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget && !guardando) onClose() }}
      onKeyDown={e => { if (e.key === 'Escape' && !guardando) onClose() }}>
      <div className="modal-content" role="dialog" aria-modal="true" aria-labelledby="nueva-categoria-title">
        <div className="modal-header">
          <h2 id="nueva-categoria-title">{editando ? 'Editar categoría' : 'Nueva categoría'}</h2>
          <button type="button" className="btn-cerrar" aria-label={editando ? 'Cerrar editar categoría' : 'Cerrar nueva categoría'} onClick={onClose} disabled={guardando}>×</button>
        </div>
        <form className="modal-body" onSubmit={async e => {
          e.preventDefault()
          const problema = validarNombreCategoria(nombre, categorias, categoriaActual)
          if (problema) { setError(problema); return }
          setGuardando(true)
          try { await onSave(limpiarNombreCategoria(nombre)); onClose() }
          catch (err) { setError(err instanceof Error ? err.message : 'No se pudo guardar la categoría. Inténtalo nuevamente.') }
          finally { setGuardando(false) }
        }}>
          <label htmlFor="nombre-categoria" className="form-label">Nombre de la categoría</label>
          <input id="nombre-categoria" className="form-control" autoFocus required maxLength={60} value={nombre} disabled={guardando} onChange={e => { setNombre(e.target.value); setError('') }} placeholder="Por ejemplo: Hamburguesas" />
          {editando ? (
            <p className="mt-3">{cantidadProductos > 0
              ? `Se actualizará la categoría de ${cantidadProductos} producto${cantidadProductos === 1 ? '' : 's'} en el catálogo.`
              : 'Esta categoría no tiene productos.'}</p>
          ) : (
            <>
              <p className="mt-3">Después podrás agregar productos a esta categoría desde Nuevo Producto.</p>
              <p className="text-muted">Las categorías vacías se guardan en este navegador o app. Al guardar productos en ellas, también aparecerán en tus otros equipos.</p>
            </>
          )}
          {error && <div role="alert" className="alert alert-danger">{error}</div>}
          <div className="gestor-acciones">
            <button type="button" className="btn btn-outline-secondary" onClick={onClose} disabled={guardando}>Cancelar</button>
            <button type="submit" className="btn-crear-producto" disabled={guardando}>
              {guardando ? 'Guardando...' : editando ? 'Guardar cambios' : 'Crear categoría'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Si la categoría tiene productos, exige elegir a qué categoría moverlos antes de eliminarla.
export function ModalEliminarCategoria({ categoria, categorias, cantidadProductos, onClose, onConfirm }: {
  categoria: string;
  categorias: string[];
  cantidadProductos: number;
  onClose: () => void;
  onConfirm: (destino: string | null) => Promise<void>;
}) {
  const opciones = categorias.filter(c => !mismaCategoria(c, categoria))
  const [destino, setDestino] = useState('')
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)
  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget && !guardando) onClose() }}
      onKeyDown={e => { if (e.key === 'Escape' && !guardando) onClose() }}>
      <div className="modal-content" role="dialog" aria-modal="true" aria-labelledby="eliminar-categoria-title">
        <div className="modal-header">
          <h2 id="eliminar-categoria-title">Eliminar categoría</h2>
          <button type="button" className="btn-cerrar" aria-label="Cerrar eliminar categoría" onClick={onClose} disabled={guardando}>×</button>
        </div>
        <form className="modal-body" onSubmit={async e => {
          e.preventDefault()
          if (cantidadProductos > 0 && !destino) { setError('Elige a qué categoría mover los productos.'); return }
          setGuardando(true)
          try { await onConfirm(cantidadProductos > 0 ? destino : null); onClose() }
          catch (err) { setError(err instanceof Error ? err.message : 'No se pudo eliminar la categoría.') }
          finally { setGuardando(false) }
        }}>
          <p>¿Eliminar la categoría <strong>{categoria}</strong>?</p>
          {cantidadProductos > 0 ? (
            <>
              <label htmlFor="destino-categoria" className="form-label">
                Tiene {cantidadProductos} producto{cantidadProductos === 1 ? '' : 's'}. Moverlos a:
              </label>
              <select id="destino-categoria" className="form-select" required value={destino} disabled={guardando} onChange={e => { setDestino(e.target.value); setError('') }}>
                <option value="">Seleccione una categoría</option>
                {opciones.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <p className="text-muted mt-2">Los productos no se borran; solo cambian de categoría.</p>
            </>
          ) : (
            <p className="text-muted">No tiene productos.</p>
          )}
          {error && <div role="alert" className="alert alert-danger">{error}</div>}
          <div className="gestor-acciones">
            <button type="button" className="btn btn-outline-secondary" onClick={onClose} disabled={guardando}>Cancelar</button>
            <button type="submit" className="btn-eliminar" disabled={guardando || (cantidadProductos > 0 && opciones.length === 0)}>
              {guardando ? 'Eliminando...' : 'Eliminar categoría'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
