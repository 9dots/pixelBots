const {getActions, getFrames} = require('../utils/synchronousRunner')
const initialGameState = require('../utils/initialGameState')
const {getAndRunIterator} = require('../utils/getIterator')
const animalApis = require('../utils/animalApis/index')
const test = require('blue-tape')
const sinon = require('sinon')

functions = require('firebase-functions');
configStub = sinon.stub(functions, 'config').returns({
  firebase: {
    databaseURL: 'https://not-a-project.firebaseio.com',
    storageBucket: 'not-a-project.appspot.com',
  }
})
const createIterator = require('../lib/autoYield')

test('createIterator', (t) => {
  const req = { body: {code: `right()\nright(`, id: 0, api: {right: 'stuff'}} }
  const send = (code) => console.log(code)
  const res = { status: (code) => ({ send }), send }

  createIterator(req, res)
  t.end()
})

test.only('create frames from code', (t) => {
  const sequence = `right()
    up()
    right()
    paint('green')
  `
  const animals = [{
    type: 'chameleon',
    sequence
  }]

  const initState = Object.assign({}, initialGameState, {
    animals: animals.map(a => Object.assign({}, initialGameState.animals[0], a))
  })

  const it = getAndRunIterator(sequence, animalApis[animals[0].type].default(0))
  const actions = getActions(it)
  const frames = getFrames(actions, initState)
  console.log(frames)
})
