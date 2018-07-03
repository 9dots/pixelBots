/**
 * http cloud functions
 * checkUserEmail
 * copyPlaylist
 * createNewUser
 * pinAssignment
 * solutionChecker
 * weoAuth
 */

const uploadAnimationThumb = require('./uploadAnimationThumb')
const solutionChecker = require('./solutionChecker')
const createInstance = require('./createInstance')
const checkUserEmail = require('./checkUserEmail')
const externalUpdate = require('./externalUpdate')
const createNewUser = require('./createNewUser')
const pinAssignment = require('./pinAssignment')
const checkUsername = require('./checkUsername')
const functions = require('firebase-functions')
const copyPlaylist = require('./copyPlaylist')
const cors = require('cors')({ origin: true })
const weoAuth = require('./weoAuth')
const express = require('express')
const unfurl = require('./unfurl')

const app = express()

app.use(cors)

app.get('/api/keepAlive', (req, res) => res.send({ ok: true }))
app.post('/api/uploadAnimationThumb', uploadAnimationThumb)
app.post('/api/solutionChecker', solutionChecker)
app.post('/api/externalUpdate', externalUpdate)
app.post('/api/checkUserEmail', checkUserEmail)
app.post('/api/createInstance', createInstance)
app.post('/api/createNewUser', createNewUser)
app.post('/api/pinAssignment', pinAssignment)
app.post('/api/checkUsername', checkUsername)
app.post('/api/copyPlaylist', copyPlaylist)
app.post('/api/copy', createInstance)
app.post('/api/weoAuth', weoAuth)
app.post('/api/unfurl', unfurl)

// Expose the API as a function
module.exports = functions.https.onRequest(app)
