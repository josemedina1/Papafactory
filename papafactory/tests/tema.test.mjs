import test from 'node:test'
import assert from 'node:assert/strict'
import { leerPreferenciaTema } from '../src/temaPreferencia.ts'

test('el tema por defecto es claro y solo oscuro cambia el modo', () => {
  assert.equal(leerPreferenciaTema(null), 'claro')
  assert.equal(leerPreferenciaTema('azul'), 'claro')
  assert.equal(leerPreferenciaTema('sistema'), 'claro')
  assert.equal(leerPreferenciaTema('claro'), 'claro')
  assert.equal(leerPreferenciaTema('oscuro'), 'oscuro')
})
