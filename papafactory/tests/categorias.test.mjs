import test from 'node:test'
import assert from 'node:assert/strict'
import { CATEGORIAS_PRODUCTOS, normalizarCategoriaParaFiltro } from '../src/categorias.ts'

test('Fajitas está disponible y reconoce variaciones de la API', () => {
  assert.ok(CATEGORIAS_PRODUCTOS.includes('Fajitas'))
  for (const categoria of ['Fajitas', 'fajita', ' FAJÍTAS ']) {
    assert.equal(normalizarCategoriaParaFiltro(categoria), 'Fajitas')
  }
})

test('respeta la categoría del Gestor aunque el nombre mencione otros productos', () => {
  assert.equal(normalizarCategoriaParaFiltro('Fajitas', 'Pollo con papas y salsa'), 'Fajitas')
  assert.equal(normalizarCategoriaParaFiltro('Extras', 'Salsa para fajitas'), 'Extras')
  assert.equal(normalizarCategoriaParaFiltro('Bebestibles', 'Combo papas'), 'Bebestibles')
})

test('admite productos anteriores sin categoría y conserva las categorías existentes', () => {
  assert.equal(normalizarCategoriaParaFiltro(undefined, 'Fajita de pollo'), 'Fajitas')
  assert.equal(normalizarCategoriaParaFiltro('', 'Papa Chorrillana M'), 'Chorrillanas')
  assert.equal(normalizarCategoriaParaFiltro('', 'Salchipapa L'), 'Salchipapas')
  assert.equal(normalizarCategoriaParaFiltro('Bebidas'), 'Bebestibles')
  for (const categoria of CATEGORIAS_PRODUCTOS) {
    assert.equal(normalizarCategoriaParaFiltro(categoria), categoria)
  }
  assert.equal(normalizarCategoriaParaFiltro('', 'Producto sin clasificar'), null)
})
