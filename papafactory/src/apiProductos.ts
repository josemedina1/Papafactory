export async function fetchJsonPrimeraUrlOk(urls: string[]): Promise<{ url: string; data: unknown }> {
  let ultimoStatus = 0
  for (const url of urls) {
    // MockAPI interpreta los parámetros de consulta como filtros. No añadir timestamps.
    const response = await fetch(url, { cache: 'no-store' })
    if (response.ok) {
      return { url, data: await response.json() }
    }
    ultimoStatus = response.status
  }
  throw new Error(`Ninguna URL respondió OK (último HTTP ${ultimoStatus}). Rutas probadas: ${urls.join(', ')}`)
}
