import { useState } from 'react'
import { claveCategoria, limpiarNombreCategoria, mismaCategoria, normalizarCategoriaParaFiltro } from './categorias'

export default function ModalCategoria({ categorias, onClose, onSave }: {
  categorias: string[];
  onClose: () => void;
  onSave: (nombre: string) => void;
}) {
  const [nombre, setNombre] = useState('')
  const [error, setError] = useState('')
  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal-content" role="dialog" aria-modal="true" aria-labelledby="nueva-categoria-title">
        <div className="modal-header">
          <h2 id="nueva-categoria-title">Nueva categoría</h2>
          <button type="button" className="btn-cerrar" aria-label="Cerrar nueva categoría" onClick={onClose}>×</button>
        </div>
        <form className="modal-body" onSubmit={e => {
          e.preventDefault()
          const categoria = limpiarNombreCategoria(nombre)
          if (!categoria || categoria.length > 60) { setError('Ingrese un nombre de 1 a 60 caracteres.'); return }
          if (['todas', 'todos'].includes(claveCategoria(categoria))) { setError('Elija otro nombre; este se usa en los filtros.'); return }
          if (categorias.some(c => mismaCategoria(c, normalizarCategoriaParaFiltro(categoria) || categoria))) { setError('Ya existe una categoría con ese nombre.'); return }
          try { onSave(categoria); onClose() }
          catch { setError('No se pudo guardar la categoría en este dispositivo. Inténtalo nuevamente.') }
        }}>
          <label htmlFor="nombre-categoria" className="form-label">Nombre de la categoría</label>
          <input id="nombre-categoria" className="form-control" autoFocus required maxLength={60} value={nombre} onChange={e => { setNombre(e.target.value); setError('') }} placeholder="Por ejemplo: Hamburguesas" />
          <p className="mt-3">Después podrás agregar productos a esta categoría desde Nuevo Producto.</p>
          <p className="text-muted">Las categorías vacías se guardan en este navegador o app. Al guardar productos en ellas, también aparecerán en tus otros equipos.</p>
          {error && <div role="alert" className="alert alert-danger">{error}</div>}
          <div className="gestor-acciones">
            <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-crear-producto">Crear categoría</button>
          </div>
        </form>
      </div>
    </div>
  )
}
