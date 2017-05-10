const test = require('blue-tape')
const sinon = require('sinon')
const getIterator = require('../utils/getIterator').default
const {createPaintFrames} = require('../utils/frameReducer')
const animalApis = require('../utils/animalApis/index').default
const initialGameState = require('../utils/initialGameState')

// const it = getIterator('right(1)\npaint()\nright()\npaint()', api)
// const frames = createPaintFrames({painted: {}, animals: [{type: 'zebra', current: {location: [4,0], rot: 0}}]}, it)
// console.log(frames)

const sequence = `right()
  up()
  right()
  paint('green')
  up()
  paint('blue')
`
const animals = [{
  type: 'chameleon',
  sequence
}]

const initState = Object.assign({}, initialGameState, {
  animals: animals.map(a => Object.assign({}, initialGameState.animals[0], a))
})

const it = getIterator(sequence, animalApis[animals[0].type].default(0))
const frames = createPaintFrames(initState, it)
console.log(frames)

// functions = require('firebase-functions');
// configStub = sinon.stub(functions, 'config').returns({
//   firebase: {
//     databaseURL: 'https://not-a-project.firebaseio.com',
//     storageBucket: 'not-a-project.appspot.com',
//   }
// })
// const createIterator = require('../lib/autoYield')

// test('createIterator', (t) => {
//   const req = { body: {code: `right()\nright(`, id: 0, api: {right: 'stuff'}} }
//   const send = (code) => console.log(code)
//   const res = { status: (code) => ({ send }), send }

//   createIterator(req, res)
//   t.end()
// })