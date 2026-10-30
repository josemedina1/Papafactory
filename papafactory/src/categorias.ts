export const CATEGORIAS_PRODUCTOS = [
  'Papas Fritas', 'Chorrillanas', 'Salchipapas', 'Fajitas', 'Bebestibles', 'Extras'
] as const

function reconocerCategoria(valor: string): string | null {
  const texto = valor.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  if (texto.includes('fajita')) return 'Fajitas'
  if (texto.includes('salchipapa')) return 'Salchipapas'
  if (texto.includes('chorrillana')) return 'Chorrillanas'
  if (texto.includes('papa')) return 'Papas Fritas'
  if (/bebida|bebestible|gaseosa|jugo/.test(texto)) return 'Bebestibles'
  if (/extra|aderezo|salsa/.test(texto)) return 'Extras'
  return null
}

// La categoría elegida en el Gestor tiene prioridad sobre el nombre del producto.
export function normalizarCategoriaParaFiltro(categoria?: string, nombreProducto?: string): string | null {
  return reconocerCategoria(categoria || '') || reconocerCategoria(nombreProducto || '')
}
