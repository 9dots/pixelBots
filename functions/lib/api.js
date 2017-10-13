/**
 * http cloud functions
 * checkUserEmail
 * copyPlaylist
 * createNewUser
 * pinAssignment
 * solutionChecker
 * weoAuth
 */

const solutionChecker = require('./solutionChecker')
const checkUserEmail = require('./checkUserEmail')
const createNewUser = require('./createNewUser')
const pinAssignment = require('./pinAssignment')
const functions = require('firebase-functions')
const copyPlaylist = require('./copyPlaylist')
const cors = require('cors')({ origin: true })
const weoAuth = require('./weoAuth')
const express = require('express')
const helmet = require('helmet')
// const admin = require('firebase-admin')

const app = express()

app.use(cors)
// app.use(helmet())
// app.use(authenticate)

app.post('/api/checkUserEmail', checkUserEmail)
app.post('/api/copyPlaylist', copyPlaylist)
app.post('/api/createNewUser', createNewUser)
app.post('/api/pinAssignment', pinAssignment)
app.post('/api/solutionChecker', solutionChecker)
app.post('/api/weoAuth', weoAuth)
app.get('/api', (req, res) => res.send('hello'))

// Expose the API as a function
module.exports = functions.https.onRequest(app)

// Express middleware that validates Firebase ID Tokens passed in the Authorization HTTP header.
// The Firebase ID token needs to be passed as a Bearer token in the Authorization HTTP header like this:
// `Authorization: Bearer <Firebase ID Token>`.
// when decoded successfully, the ID Token content will be added as `req.user`.
// const authenticate = (req, res, next) => {
//   if (
//     !req.headers.authorization ||
//     !req.headers.authorization.startsWith('Bearer ')
//   ) {
//     res.status(403).send('Unauthorized')
//     return
//   }
//   const idToken = req.headers.authorization.split('Bearer ')[1]
//   console.log('idToken', idToken)
//   admin
//     .auth()
//     .verifyIdToken(idToken)
//     .then(decodedIdToken => {
//       req.user = decodedIdToken
//       next()
//     })
//     .catch(e => {
//       console.log(e)
//       res.status(403).send('Unauthorized')
//     })
// }
