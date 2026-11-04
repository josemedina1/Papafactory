import { useRef, useState } from 'react'
import { moverCategoria } from './categorias'

export default function FiltrosCategorias({ categorias, conteos, total, seleccionada, onSeleccionar, onReordenar }: {
  categorias: string[];
  conteos: Record<string, number>;
  total: number;
  seleccionada: string;
  onSeleccionar: (categoria: string) => void;
  onReordenar: (orden: string[]) => boolean;
}) {
  const origen = useRef<string | null>(null)
  const suprimirClick = useRef(false)
  const [arrastrada, setArrastrada] = useState<string | null>(null)
  const [destino, setDestino] = useState<string | null>(null)
  const [aviso, setAviso] = useState('')
  const mover = (desde: string, hasta: string) => {
    if (desde === hasta) return
    const orden = moverCategoria(categorias, desde, hasta)
    if (onReordenar(orden)) setAviso(`${desde} movida a la posición ${orden.indexOf(desde) + 1}. El menú principal usa el mismo orden.`)
  }
  const terminar = () => { origen.current = null; setArrastrada(null); setDestino(null) }
  return (
    <div className="gestor-filtros">
      <span className="gestor-filtros-label">Filtrar por categoría:</span>
      <p className="gestor-orden-ayuda" id="ayuda-orden-categorias">Mantén el clic y arrastra para ordenar. El mismo orden se aplica al menú principal.</p>
      <div className="gestor-filtros-buttons">
        <button type="button" className={`gestor-filtro-btn ${seleccionada === 'Todas' ? 'active' : ''}`} onClick={() => onSeleccionar('Todas')}>Todas ({total})</button>
        {categorias.map((cat, indice) => (
          <button key={cat} type="button" draggable
            className={`gestor-filtro-btn categoria-ordenable ${seleccionada === cat ? 'active' : ''} ${arrastrada === cat ? 'categoria-arrastrando' : ''} ${destino === cat && arrastrada !== cat ? 'categoria-destino' : ''}`}
            aria-describedby="ayuda-orden-categorias"
            title="Arrastra para ordenar. Con teclado: Alt + flechas."
            onPointerDown={() => { suprimirClick.current = false }}
            onClick={() => { if (!suprimirClick.current) onSeleccionar(cat) }}
            onDragStart={e => {
              origen.current = cat; suprimirClick.current = true; setArrastrada(cat)
              e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', cat)
            }}
            onDragOver={e => {
              if (!origen.current) return
              e.preventDefault(); e.dataTransfer.dropEffect = 'move'; setDestino(cat)
            }}
            onDrop={e => {
              e.preventDefault()
              if (origen.current) mover(origen.current, cat)
              terminar()
            }}
            onDragEnd={terminar}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') suprimirClick.current = false
              if (!e.altKey || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) return
              e.preventDefault()
              const siguiente = indice + (e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 1)
              if (siguiente >= 0 && siguiente < categorias.length) mover(cat, categorias[siguiente])
            }}
          >
            <span className="categoria-agarre" aria-hidden="true">⠿</span>{cat} ({conteos[cat] || 0})
          </button>
        ))}
      </div>
      <span className="visually-hidden" role="status" aria-live="polite">{aviso}</span>
    </div>
  )
}
