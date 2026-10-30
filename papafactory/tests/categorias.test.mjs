import test from 'node:test'
import assert from 'node:assert/strict'
import { CATEGORIAS_PRODUCTOS, normalizarCategoriaParaFiltro, permiteAgregados, tamanosDeAgregados } from '../src/categorias.ts'

test('Fajitas está disponible y reconoce variaciones de la API', () => {
  assert.ok(CATEGORIAS_PRODUCTOS.includes('Fajitas'))
  for (const categoria of ['Fajitas', 'fajita', ' FAJÍTAS ']) {
    assert.equal(normalizarCategoriaParaFiltro(categoria), 'Fajitas')
  }
})

test('las fajitas permiten agregados M y L sin cambiar el tamaño base del producto', () => {
  const fajita = { id: '26', nombre: 'Fajita Base Lechuga', categoria: 'Fajitas', tamaño: 'L', precio: 2500 }
  assert.equal(permiteAgregados(fajita), true)
  assert.deepEqual(tamanosDeAgregados(fajita), ['M', 'L'])
  assert.equal(fajita.tamaño, 'L')
  assert.equal(fajita.precio, 2500)
  assert.equal(permiteAgregados({ id: '27', nombre: 'Fajitas', categoria: 'Fajitas' }), true)
})

test('conserva agregados M, L y XL para papas y excluye bebestibles y extras', () => {
  for (const categoria of ['Papas Fritas', 'Salchipapas', 'Chorrillanas']) {
    const producto = { id: '1', nombre: 'Producto', categoria }
    assert.equal(permiteAgregados(producto), true)
    assert.deepEqual(tamanosDeAgregados(producto), ['M', 'L', 'XL'])
  }
  assert.equal(permiteAgregados({ id: 'papas_m', nombre: 'M' }), true)
  assert.equal(permiteAgregados({ id: '7', nombre: 'Agua', categoria: 'Bebestibles' }), false)
  assert.equal(permiteAgregados({ id: '21', nombre: 'Salsa para fajitas', categoria: 'Extras' }), false)
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
