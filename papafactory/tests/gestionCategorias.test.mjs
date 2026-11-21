import test from 'node:test'
import assert from 'node:assert/strict'
import { validarNombreCategoria, quitarCategoriaDeLista, reemplazarCategoriaEnLista, contarProductosPorCategoria, filtrarCategoriasEliminadas, categoriasConProductos } from '../src/categorias.ts'
import { cambiarCategoriaDeProductos } from '../src/cambiarCategoriaProductos.ts'

const categorias = ['Papas Fritas', 'Fajitas', 'Hamburguesas']

test('valida nombres al crear y al renombrar categorías', () => {
  assert.equal(validarNombreCategoria('Postres', categorias), '')
  assert.match(validarNombreCategoria('papas', categorias), /Ya existe/)
  assert.match(validarNombreCategoria('Todas', categorias), /filtros/)
  assert.match(validarNombreCategoria('  ', categorias), /1 a 60/)
  assert.match(validarNombreCategoria('Hamburguesas', categorias, 'Hamburguesas'), /no cambió/)
  assert.equal(validarNombreCategoria('HAMBURGUESAS', categorias, 'Hamburguesas'), '')
  assert.equal(validarNombreCategoria('Burgers', categorias, 'Hamburguesas'), '')
  assert.match(validarNombreCategoria('Fajita', categorias, 'Hamburguesas'), /Ya existe/)
})

test('renombrar conserva la posición y eliminar quita alias', () => {
  assert.deepEqual(reemplazarCategoriaEnLista(categorias, 'Fajitas', 'Wraps'), ['Papas Fritas', 'Wraps', 'Hamburguesas'])
  assert.deepEqual(reemplazarCategoriaEnLista(['A'], 'Fajitas', 'Wraps'), ['A', 'Wraps'])
  assert.deepEqual(quitarCategoriaDeLista(['fajita', 'Hamburguesas'], 'Fajitas'), ['Hamburguesas'])
})

test('el menú oculta categorías vacías y las eliminadas vuelven solo con productos', () => {
  const productos = [
    { id: '1', nombre: 'Papas M', categoria: 'Papas Fritas' },
    { id: '2', nombre: 'Fajita L', categoria: '' },
    { id: '3', nombre: 'Burger', categoria: 'Otra' }
  ]
  const conteos = contarProductosPorCategoria(productos, categorias)
  assert.deepEqual(conteos, { 'Papas Fritas': 1, Fajitas: 1, Hamburguesas: 0 })
  assert.deepEqual(categoriasConProductos(categorias, conteos), ['Papas Fritas', 'Fajitas'])
  assert.deepEqual(filtrarCategoriasEliminadas(categorias, ['hamburguesas', 'Fajitas'], conteos), ['Papas Fritas', 'Fajitas'])
})

test('mueve productos de categoría y se detiene al primer fallo sin perder los confirmados', async () => {
  const productos = [{ id: '1', nombre: 'A' }, { id: '2', nombre: 'B' }, { id: '3', nombre: 'C' }]
  const ok = await cambiarCategoriaDeProductos(productos, async p => ({ ...p, categoria: 'X' }))
  assert.equal(ok.confirmados.length, 3)
  assert.equal(ok.error, undefined)
  const guardados = []
  const parcial = await cambiarCategoriaDeProductos(productos, async p => {
    if (p.id === '2') throw new Error('HTTP 500')
    guardados.push(p.id)
    return p
  })
  assert.deepEqual(parcial.confirmados.map(p => p.id), ['1'])
  assert.deepEqual(guardados, ['1'])
  assert.match(parcial.error.message, /1 de 3.*"B".*HTTP 500/)
})
