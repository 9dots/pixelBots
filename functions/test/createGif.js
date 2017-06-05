
const {createPaintFrames, createFrames, getIterator} = require('../utils/frameReducer/frameReducer')
const animalApis = require('../utils/animalApis/index')
const {gifFrame} = require('../utils/createImage')
const functions = require('firebase-functions')
const createGif = require('../utils/createGif')
const {upload} = require('../utils/storage')
const flatten = require('lodash/flatten')
const admin = require('firebase-admin')
const chunk = require('lodash/chunk')
const fs = require('node-fs-extra')
const Promise = require('bluebird')
const srand = require('@f/srand')
const omit = require('@f/omit')
const co = require('co')

const serviceAccount = require('../serviceAccount.json')
const createApi = animalApis.default
const teacherBot = animalApis.capabilities

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://artbot-dev.firebaseio.com'
})

const saveID = '-Kjyntze8CwFN8cclsRt'
const RUN_TIME = 3
const GIF_SIZE = 500
const db = admin.database()
const savedRef = db.ref('/saved')
const gamesRef = db.ref('/games')

savedRef.child(saveID).once('value')
  .then(snap => Promise.all([
    Promise.resolve(snap.val()),
    snap.val().gameRef
      ? gamesRef.child(snap.val().gameRef).once('value').then(snap => snap.val())
      : Promise.reject(new Error('no game'))
  ]))
  .then(([savedGame, gameState]) => {
    const levelSize = gameState.levelSize[0]
    const {animals} = gameState.type === 'read' ? gameState : savedGame
    const size = Math.floor(GIF_SIZE / levelSize)
    const imageSize = Number(size * levelSize) + Number(levelSize - 1)
    const teacherApi = createApi(teacherBot, 0)
    const startCode = getIterator(gameState.initialPainted, teacherApi)
    const initialPainted = gameState.advanced
      ? createPainted(Object.assign({}, gameState, {
          painted: {},
          startGrid: {},
          animals: animals.filter(a => a.type === 'teacherBot').map(a => Object.assign({}, a, {current: a.initial})),
          rand: srand(1)
        }), startCode)
      : startCode
    const {sequence} = gameState.type === 'read'
      ? gameState.animals[0]
      : animals[0]
    fs.mkdirsSync(`/tmp/${saveID}`)
    const initState = Object.assign({}, gameState, {
      painted: initialPainted,
      animals: animals.map(a => Object.assign({}, a, {
        current: a.initial
      }))
    })
    const it = getIterator(sequence, createApi(gameState.capabilities, 0))
    const frames = createPaintFrames(initState, it)
    const timing = frames / RUN_TIME
    const delay = 100 / timing
    const adjusted = frames.map((frame, i, arr) => {
      const next = arr[i + 1]
        ? arr[i + 1].step
        : frame.step
      return {length: Math.abs(next - frame.step), frame: omit('step', frame)}
    })
    return adjusted
  })
  .then(console.log)
  .catch(console.warn)

  function createPainted (state, code) {
    return createFrames(state, code).pop().painted
  }
