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
  const explicita = limpiarNombreCategoria(categoria || '')
  if (explicita) {
    const aliases: Record<string, string> = {
      'papas fritas': 'Papas Fritas', 'papa frita': 'Papas Fritas', papa: 'Papas Fritas', papas: 'Papas Fritas',
      chorrillana: 'Chorrillanas', chorrillanas: 'Chorrillanas',
      salchipapa: 'Salchipapas', salchipapas: 'Salchipapas',
      fajita: 'Fajitas', fajitas: 'Fajitas',
      bebida: 'Bebestibles', bebidas: 'Bebestibles', bebestible: 'Bebestibles', bebestibles: 'Bebestibles',
      gaseosa: 'Bebestibles', gaseosas: 'Bebestibles', jugo: 'Bebestibles', jugos: 'Bebestibles',
      extra: 'Extras', extras: 'Extras', aderezo: 'Extras', aderezos: 'Extras', salsa: 'Extras', salsas: 'Extras'
    }
    const clave = claveCategoria(explicita)
    return Object.prototype.hasOwnProperty.call(aliases, clave) ? aliases[clave] : explicita
  }
  return reconocerCategoria(nombreProducto || '')
}

export function limpiarNombreCategoria(nombre: string): string {
  return nombre.trim().replace(/\s+/g, ' ')
}

export function claveCategoria(nombre: string): string {
  return limpiarNombreCategoria(nombre).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[_-]/g, ' ').replace(/\s+/g, ' ').trim()
}

export function mismaCategoria(a: string | null | undefined, b: string): boolean {
  return claveCategoria(a || '') === claveCategoria(b)
}

export function combinarCategorias(...fuentes: string[][]): string[] {
  const categorias: string[] = [...CATEGORIAS_PRODUCTOS]
  for (const nombre of fuentes.flat()) {
    const categoria = normalizarCategoriaParaFiltro(nombre)
    if (categoria && categoria.length <= 60 && !['todas', 'todos'].includes(claveCategoria(categoria)) && !categorias.some(c => mismaCategoria(c, categoria))) {
      categorias.push(categoria)
    }
  }
  return categorias
}

export function leerCategoriasGuardadas(valor: string | null): string[] {
  try {
    const parsed: unknown = JSON.parse(valor || '[]')
    return Array.isArray(parsed) ? combinarCategorias(parsed.filter((v): v is string => typeof v === 'string')).slice(CATEGORIAS_PRODUCTOS.length) : []
  } catch { return [] }
}

interface ProductoClasificable {
  id: string;
  nombre: string;
  categoria?: string;
  tamanosAgregados?: string[];
}

export function categoriaDelProducto(producto: ProductoClasificable): string | null {
  return normalizarCategoriaParaFiltro(producto.categoria, producto.nombre)
    || normalizarCategoriaParaFiltro(undefined, producto.id)
}

export function permiteAgregados(producto: ProductoClasificable): boolean {
  return tamanosDeAgregados(producto).length > 0
}

export function tamanosDeAgregados(producto: ProductoClasificable): string[] {
  if (Array.isArray(producto.tamanosAgregados)) {
    return ['M', 'L', 'XL'].filter(tamano => producto.tamanosAgregados!.includes(tamano))
  }
  const categoria = categoriaDelProducto(producto)
  if (categoria === 'Fajitas') return ['L']
  return ['Papas Fritas', 'Chorrillanas', 'Salchipapas'].includes(categoria || '') ? ['M', 'L', 'XL'] : []
}
