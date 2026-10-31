import test from 'node:test'
import assert from 'node:assert/strict'
import { guardarRegistroCatalogo } from '../src/guardarCatalogo.ts'

test('actualiza todos los campos y devuelve el registro confirmado sin otra lectura que pueda sobrescribirlo', async t => {
  for (const datos of [
    { nombre: 'Nombre nuevo', precio: 4800, tamano: 'L', categoria: 'Fajitas', imagen_producto: '', tamanosAgregados: ['L'] },
    { item: 'Agregado nuevo', precioM: 1000, precioL: 1200, precioXL: 1400, categoria: 'Agregados Premium' }
  ]) {
    const llamadas = []
    t.mock.method(globalThis, 'fetch', async (url, opciones) => {
      llamadas.push({ url, opciones })
      return Response.json({ ...JSON.parse(opciones.body), id: '26' })
    })
    const confirmado = await guardarRegistroCatalogo('https://catalogo.test/items', datos, '26')
    assert.deepEqual(confirmado, { ...datos, id: '26' })
    assert.equal(llamadas.length, 1)
    assert.equal(llamadas[0].opciones.method, 'PUT')
    assert.equal(llamadas[0].url, 'https://catalogo.test/items/26')
  }
})

test('no da por guardado un precio que la API no aplicó', async t => {
  t.mock.method(globalThis, 'fetch', async () => Response.json({ id: '1', precio: 4000 }))
  await assert.rejects(guardarRegistroCatalogo('https://catalogo.test/items', { precio: 5000 }, '1'), /precio/)
})

test('comunica fallos HTTP y de conexión y registros equivocados', async t => {
  t.mock.method(globalThis, 'fetch', async () => new Response('', { status: 500 }))
  await assert.rejects(guardarRegistroCatalogo('https://catalogo.test/items', { precio: 5000 }, '1'), /HTTP 500/)
  t.mock.method(globalThis, 'fetch', async () => { throw new Error('Sin conexión') })
  await assert.rejects(guardarRegistroCatalogo('https://catalogo.test/items', { precio: 5000 }, '1'), /Sin conexión/)
  t.mock.method(globalThis, 'fetch', async () => Response.json({ id: '2', precio: 5000 }))
  await assert.rejects(guardarRegistroCatalogo('https://catalogo.test/items', { precio: 5000 }, '1'), /no confirmó/)
})

test('crea registros y acepta precios cero y números serializados como texto', async t => {
  t.mock.method(globalThis, 'fetch', async (_, opciones) => {
    assert.equal(opciones.method, 'POST')
    return Response.json({ id: 'nuevo', precio: '0' })
  })
  assert.equal((await guardarRegistroCatalogo('https://catalogo.test/items', { precio: 0 })).precio, '0')
})
