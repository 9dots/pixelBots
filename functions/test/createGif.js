
const {createPaintFrames, createFrames} = require('../utils/frameReducer')
const animalApis = require('../utils/animalApis/index').default
const getIterator = require('../utils/getIterator')
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
    const timing = (levelSize * levelSize) / RUN_TIME
    const delay = 100 / timing
    const {animals} = gameState.type === 'read' ? gameState : savedGame
    const size = Math.floor(GIF_SIZE / levelSize)
    const imageSize = Number(size * levelSize) + Number(levelSize - 1)
    const teacherApi = animalApis.teacherBot.default(0)
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
    const it = getIterator(sequence, animalApis[animals[0].type].default(0))
    const frames = [Object.assign({}, initialPainted, {frame: 0})].concat(createPaintFrames(initState, it))
    const adjusted = frames.map((frame, i, arr) => {
      const next = arr[i + 1]
        ? arr[i + 1].frame
        : frame.frame
      return {length: Math.abs(next - frame.frame), frame: omit('frame', frame)}
    })
  })
  .catch(console.warn)

  function createPainted (state, code) {
    return createFrames(state, code).pop().painted
  }
