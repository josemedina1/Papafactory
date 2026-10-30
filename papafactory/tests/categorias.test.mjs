import test from 'node:test'
import assert from 'node:assert/strict'
import { CATEGORIAS_PRODUCTOS, normalizarCategoriaParaFiltro, permiteAgregados, tamanosDeAgregados, combinarCategorias, leerCategoriasGuardadas, mismaCategoria } from '../src/categorias.ts'

test('Fajitas está disponible y reconoce variaciones de la API', () => {
  assert.ok(CATEGORIAS_PRODUCTOS.includes('Fajitas'))
  for (const categoria of ['Fajitas', 'fajita', ' FAJÍTAS ']) {
    assert.equal(normalizarCategoriaParaFiltro(categoria), 'Fajitas')
  }
})

test('conserva categorías personalizadas aunque incluyan nombres de categorías existentes', () => {
  assert.equal(normalizarCategoriaParaFiltro('Hamburguesas', 'Papas con carne'), 'Hamburguesas')
  assert.equal(normalizarCategoriaParaFiltro('Fajitas especiales', 'Fajita XL'), 'Fajitas especiales')
  assert.equal(normalizarCategoriaParaFiltro('  Papas   rellenas  '), 'Papas rellenas')
  assert.equal(normalizarCategoriaParaFiltro('constructor'), 'constructor')
  assert.equal(permiteAgregados({ id: '30', nombre: 'Papas con carne', categoria: 'Hamburguesas' }), false)
})

test('combina categorías locales y del catálogo sin duplicados ni nombres de filtros', () => {
  const categorias = combinarCategorias(['Postres', '  Hamburguesas '], ['POSTRES', 'Bebidas', 'Todas', '', 'Hamburguesas'])
  assert.deepEqual(categorias, [...CATEGORIAS_PRODUCTOS, 'Postres', 'Hamburguesas'])
  assert.equal(mismaCategoria('Sándwiches', 'sandwiches'), true)
})

test('recupera categorías guardadas y tolera almacenamiento incompleto o dañado', () => {
  assert.deepEqual(leerCategoriasGuardadas('["Postres",null,42,"POSTRES","Papas Fritas"]'), ['Postres'])
  assert.deepEqual(leerCategoriasGuardadas(null), [])
  assert.deepEqual(leerCategoriasGuardadas('roto'), [])
  assert.deepEqual(leerCategoriasGuardadas('{}'), [])
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
