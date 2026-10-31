// El estado visible se actualiza solo con la respuesta confirmada del guardado.
export async function guardarRegistroCatalogo<T extends { id: string }>(
  url: string, datos: Omit<T, 'id'> | T, id?: string
): Promise<T> {
  const response = await fetch(id ? url + '/' + encodeURIComponent(id) : url, {
    method: id ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  })
  if (!response.ok) throw new Error('No se pudo guardar (HTTP ' + response.status + '). Los cambios siguen en el formulario.')
  const guardado = await response.json() as T
  if (!guardado || !guardado.id || (id && String(guardado.id) !== String(id))) {
    throw new Error('El servidor no confirmó el registro guardado. Revisa la conexión y vuelve a intentarlo.')
  }
  const campos = Object.entries(datos).filter(([campo, valor]) => campo !== 'id' && valor !== undefined)
  const diferentes = campos.filter(([campo, valor]) => {
    const recibido = (guardado as Record<string, unknown>)[campo]
    return typeof valor === 'number' ? Number(recibido) !== valor : JSON.stringify(recibido) !== JSON.stringify(valor)
  }).map(([campo]) => campo)
  if (diferentes.length) throw new Error('El servidor no confirmó los cambios en: ' + diferentes.join(', ') + '. El formulario sigue abierto para reintentar.')
  return guardado
}
