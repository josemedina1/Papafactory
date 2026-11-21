// Mueve productos a otra categoría uno por uno. Si un guardado falla, se detiene y
// devuelve los que sí confirmó el servidor para que la vista no muestre cambios no guardados.
export async function cambiarCategoriaDeProductos<T extends { id: string }>(
  productos: T[], guardar: (producto: T) => Promise<T>
): Promise<{ confirmados: T[]; error?: Error }> {
  const confirmados: T[] = []
  for (const producto of productos) {
    try {
      confirmados.push(await guardar(producto))
    } catch (e) {
      const motivo = e instanceof Error ? e.message : 'error de conexión'
      return {
        confirmados,
        error: new Error(`Se actualizaron ${confirmados.length} de ${productos.length} productos. Falló "${String((producto as { nombre?: string }).nombre ?? producto.id)}": ${motivo}`)
      }
    }
  }
  return { confirmados }
}
