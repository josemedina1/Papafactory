import test from 'node:test'
import assert from 'node:assert/strict'
import { EventEmitter } from 'node:events'
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const { createUpdateController } = require('../desktop-updates.cjs')

function setup(enabled = true) {
  const updater = new EventEmitter()
  let installed = false
  updater.checkForUpdates = async () => updater.emit('update-available', { version: '1.0.1' })
  updater.downloadUpdate = async () => {
    updater.emit('download-progress', { percent: 55.7 })
    updater.emit('update-downloaded', { version: '1.0.1' })
  }
  updater.quitAndInstall = (silent, restart) => { assert.equal(silent, false); assert.equal(restart, true); installed = true }
  const states = []
  const controller = createUpdateController({ updater, version: '1.0.0', enabled, onState: s => states.push(s) })
  return { updater, controller, states, installed: () => installed }
}

test('consulta, descarga con progreso e instala solamente cuando el usuario lo solicita', async () => {
  const { updater, controller, states, installed } = setup()
  assert.equal(updater.autoDownload, false)
  assert.equal(updater.autoInstallOnAppQuit, false)
  assert.equal(controller.install(), false)
  assert.equal((await controller.check()).status, 'available')
  assert.equal(installed(), false)
  assert.equal((await controller.download()).status, 'downloaded')
  assert.ok(states.some(s => s.status === 'downloading' && s.percent === 56))
  // Una consulta posterior no pierde el instalador ya descargado.
  assert.equal((await controller.check()).status, 'downloaded')
  assert.equal(controller.install(), true)
  assert.equal(installed(), true)
})

test('permite reintentar después de un fallo de conexión', async (t) => {
  t.mock.method(console, 'error', () => {})
  const { updater, controller } = setup()
  updater.checkForUpdates = async () => { throw new Error('offline') }
  assert.equal((await controller.check()).status, 'error')
  updater.checkForUpdates = async () => updater.emit('update-not-available')
  assert.equal((await controller.check()).status, 'current')
})

test('evita consultas simultáneas y no instala durante una descarga', async () => {
  const { updater, controller } = setup()
  let finish
  let checks = 0
  updater.checkForUpdates = () => { checks++; return new Promise(resolve => { finish = resolve }) }
  const first = controller.check()
  await controller.check()
  assert.equal(checks, 1)
  finish()
  await first
  updater.emit('update-available', { version: '1.0.1' })
  updater.downloadUpdate = () => new Promise(resolve => { finish = resolve })
  const download = controller.download()
  assert.equal(controller.install(), false)
  finish()
  await download
})

test('en desarrollo no consulta servidores ni permite instalaciones', async () => {
  const { updater, controller } = setup(false)
  updater.checkForUpdates = () => { throw new Error('No debe ejecutarse') }
  assert.equal((await controller.check()).status, 'unsupported')
  assert.equal((await controller.download()).status, 'unsupported')
  assert.equal(controller.install(), false)
})
