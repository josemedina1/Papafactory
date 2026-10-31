import test from 'node:test'
import assert from 'node:assert/strict'
import { leerPrecio } from '../src/precios.ts'
test('interpreta precios escritos o pegados en formato chileno sin perder miles', () => {
  for (const texto of ['5500', '5.500', '$5.500', '$ 5.500', '5 500', '5.500,00', '5500,00']) assert.equal(leerPrecio(texto), 5500)
  assert.equal(leerPrecio('1.234.567'), 1234567)
  assert.equal(leerPrecio('0'), 0)
  assert.equal(leerPrecio('12,5'), 12.5)
  assert.equal(leerPrecio('12.50'), 12.5)
})
test('no guarda precios vacíos, negativos, parciales o infinitos', () => {
  for (const texto of ['', ' ', '-500', '500abc', '1.2.3', 'Infinity', '1e3']) assert.ok(Number.isNaN(leerPrecio(texto)))
})
