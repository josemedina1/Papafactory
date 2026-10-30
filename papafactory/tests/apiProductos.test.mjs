import test from 'node:test'
import assert from 'node:assert/strict'
import { fetchJsonPrimeraUrlOk } from '../src/apiProductos.ts'

test('lee el catálogo sin parámetros que MockAPI pueda interpretar como filtros', async (t) => {
  const productos = [{ id: '26', nombre: 'Fajita', categoria: 'Fajitas' }]
  const fetchMock = t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(url, 'https://example.test/Productos')
    assert.equal(options.cache, 'no-store')
    return Response.json(productos)
  })
  const resultado = await fetchJsonPrimeraUrlOk(['https://example.test/Productos'])
  assert.deepEqual(resultado.data, productos)
  assert.equal(fetchMock.mock.callCount(), 1)
})

test('prueba la siguiente ruta ante un 404 y comunica el fallo si ninguna responde', async (t) => {
  t.mock.method(globalThis, 'fetch', async (url) => url.endsWith('/Productos')
    ? new Response('Not found', { status: 404 })
    : Response.json([]))
  const resultado = await fetchJsonPrimeraUrlOk(['https://example.test/Productos', 'https://example.test/productos'])
  assert.equal(resultado.url, 'https://example.test/productos')
  assert.deepEqual(resultado.data, [])
  await assert.rejects(fetchJsonPrimeraUrlOk(['https://example.test/Productos']), /HTTP 404/)
})
