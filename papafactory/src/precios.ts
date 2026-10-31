// Admite precios sin formato y el formato chileno con puntos de miles.
export function leerPrecio(valor: string): number {
  const texto = valor.trim().replace(/^\$\s*/, '').replace(/\s/g, '')
  if (!texto) return NaN
  let normalizado = texto
  if (/^\d{1,3}(\.\d{3})+(,\d+)?$/.test(texto)) {
    normalizado = texto.replace(/\./g, '').replace(',', '.')
  } else if (/^\d+(,\d+)?$/.test(texto)) {
    normalizado = texto.replace(',', '.')
  } else if (!/^\d+(\.\d+)?$/.test(texto)) return NaN
  const precio = Number(normalizado)
  return Number.isFinite(precio) && precio >= 0 ? precio : NaN
}
