/**
 * Imports
 */

const functions = require('firebase-functions')
const app = require('express')()
const Boot = require('artbot/lib/components/Boot')
require('regenerator-runtime/runtime')
const vdux = require('vdux/string')
const { element } = require('vdux')
const page = require('./page')

/**
 * Render to string
 */

function render (opts) {
  return vdux(() => element(Boot), { awaitReady: true }).then(page, handleError)
}

/**
 * Helpers
 */

function handleError (err) {
  console.log('caught err', err)
  throw err
}

app.get('*', async (req, res) => {
  console.log('here')
  const html = await render()
  res.send(html)
})

/**
 * Exports
 */

module.exports = functions.https.onRequest(app)
