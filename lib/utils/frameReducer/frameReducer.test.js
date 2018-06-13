/**
 * Imports
 */

import 'regenerator-runtime/runtime'
import test from 'tape'
import frameReducer from '.'
import {
  validate,
  updateAnimal,
  computeLocation,
  setAnimalPos,
  getCurrentColor,
  createRand,
  isEqualSequence,
  getIterator,
  createIterator,
  createFrames,
  createPaintFrames,
  checkBounds,
  getLastFrame,
  getLastTeacherFrame
} from './frameReducer'

import createApi, { capabilities } from 'animalApis'

/**
 * <Frame Reducer/> tests
 */

test('<frameReducer/> validate tests', t => {
  t.plan(4)

  const frames = [{ '3,1': 'red' }, { '2,1': 'red' }]
  const location = [3, 1]

  t.notEqual(
    validate([], 0, location, 'black'),
    null,
    'takes empty frames array'
  )
  t.equal(
    validate(frames, 1, location, 'red'),
    'location',
    'returns location error'
  )
  t.equal(
    validate(frames, 0, location, 'black'),
    'color',
    'returns color error'
  )
  t.equal(validate(frames, 0, location, 'red'), null, 'returns no error')
})

test('<frameReducer/> paint tests', t => {
  t.plan(4)

  const paint = (frame, ...args) => frameReducer(frame, 'paint', args)[0]

  const hasPaintedState = {
    animals: [{ current: { location: [4, 0] } }],
    painted: { '3,1': 'black' },
    paints: 1
  }
  const isPaintedState = paint(hasPaintedState, 0, 'red')
  t.equal(isPaintedState.paints, 2, 'increments paints')
  t.deepEqual(
    isPaintedState.painted,
    { '3,1': 'black', '4,0': 'red' },
    'adds coord to painted'
  )

  const noPaintedState = {
    animals: hasPaintedState.animals
  }
  const nowIsPaintedState = paint(noPaintedState, 0, 'black')
  t.equal(nowIsPaintedState.paints, 1, 'adds paints prop to state')
  t.deepEqual(
    nowIsPaintedState.painted,
    { '4,0': 'black' },
    'adds painted prop to state'
  )
})

test('<frameReducer/> updateAnimal tests', t => {
  t.plan(1)

  const animals = [{ current: { rot: 0 } }, { current: { rot: 1 } }]
  const afterRotAnimals = [{ current: { rot: 0 } }, { current: { rot: -1 } }]

  t.deepEqual(
    updateAnimal(animals, 'current.rot', 1, -1),
    afterRotAnimals,
    'animal prop gets updated'
  )
})

test('<frameReducer/> computeLocation tests', t => {
  t.plan(2)

  const animalState = {
    animals: [{ current: { location: [4, 0] } }]
  }

  t.deepEqual(computeLocation({}, 0, [1, 2]), [1, 2], 'takes an array')
  t.deepEqual(
    computeLocation(animalState, 0, (l, r) => l.map(x => x + 1)),
    [5, 1],
    'takes a function'
  )
})

test('<frameReducer/> setAnimalPos tests', t => {
  t.plan(1)

  const startFrame = {
    animals: [
      { current: { location: [1, 0] } },
      { current: { location: [0, 1] } }
    ]
  }
  const movedAnimals = [
    { current: { location: [1, 0] } },
    { current: { location: [1, 1] } }
  ]

  t.deepEqual(
    setAnimalPos(startFrame, 1, [1, 1]).animals,
    movedAnimals,
    'updates animal location'
  )
})

test('<frameReducer/> addAnimalPos tests', t => {
  t.plan(4)

  const up = (frame, ...args) => frameReducer(frame, 'up', args)[0]
  const down = (frame, ...args) => frameReducer(frame, 'down', args)[0]
  const left = (frame, ...args) => frameReducer(frame, 'left', args)[0]
  const right = (frame, ...args) => frameReducer(frame, 'right', args)[0]

  const startFrame = {
    animals: [
      { current: { location: [1, 0] } },
      { current: { location: [0, 1] } },
      { current: { location: [2, 2] } },
      { current: { location: [1, 1] } }
    ]
  }
  const movedAnimals = [
    { current: { location: [0, 0] } },
    { current: { location: [1, 1] } },
    { current: { location: [2, 0] } },
    { current: { location: [1, 3] } }
  ]

  t.deepEqual(
    up(startFrame, 0, 1).animals[0],
    movedAnimals[0],
    'moves animal up'
  )
  t.deepEqual(
    down(startFrame, 1, 1).animals[1],
    movedAnimals[1],
    'moves animal down'
  )
  t.deepEqual(
    left(startFrame, 2, 2).animals[2],
    movedAnimals[2],
    'moves animal left'
  )
  t.deepEqual(
    right(startFrame, 3, 2).animals[3],
    movedAnimals[3],
    'moves animal right'
  )
})

test('<frameReducer/> turn and forward tests', t => {
  t.plan(3)

  const turnRight = (frame, ...args) =>
    frameReducer(frame, 'turnRight', args)[0]
  const turnLeft = (frame, ...args) => frameReducer(frame, 'turnLeft', args)[0]
  const forward = (frame, ...args) => frameReducer(frame, 'forward', args)[0]

  const startFrame = {
    animals: [
      { current: { rot: 0 } },
      { current: { rot: 180 } },
      { current: { location: [1, 1], rot: 0 } }
    ]
  }
  const rotatedAnimals = [
    { current: { rot: 90 } },
    { current: { rot: 90 } },
    { current: { location: [1, 2], rot: 90 } }
  ]

  t.deepEqual(
    turnRight(startFrame, 0).animals[0],
    rotatedAnimals[0],
    'rotates animal right'
  )
  t.deepEqual(
    turnLeft(startFrame, 1).animals[1],
    rotatedAnimals[1],
    'rotates animal left'
  )
  t.deepEqual(
    forward(turnRight(startFrame, 2), 2).animals[2],
    rotatedAnimals[2],
    'animal turns then moves forward'
  )
})

test('<frameReducer/> getCurrentColor tests', t => {
  t.plan(2)

  const frame = {
    animals: [
      { current: { location: [1, 0] } },
      { current: { location: [0, 2] } }
    ],
    painted: { '1,0': 'black', '0,1': 'red' }
  }
  const activeZeroFrame = { ...frame, active: 0 }
  const activeOneFrame = { ...frame, active: 1 }

  t.equal(getCurrentColor(activeZeroFrame)[1], 'black', 'returns current color')
  t.equal(
    getCurrentColor(activeOneFrame)[1],
    'white',
    'returns white if no color'
  )
})

test('<frameReducer/> createRand tests', t => {
  t.plan(2)

  const framesWithRand = {
    rand: (min, max) => min + max
  }

  t.equal(createRand(framesWithRand, -1, 20)[1], 20, 'handles only max param')
  t.equal(
    createRand(framesWithRand, -1, 4, 7)[1],
    11,
    'handles min and max params'
  )
})

test('<frameReducer/> isEqualSequence tests', t => {
  t.plan(3)

  const sequenceA = [
    { sequence: 'a,b,c' },
    { sequence: '1,2,3' },
    { hasNoSequence: 'nope' }
  ]
  const sequenceB = [
    { sequence: 'd,e,f' },
    { sequence: '2,3,4' },
    { alsoNoSequence: 'nope' }
  ]

  t.ok(isEqualSequence(sequenceA, sequenceA), 'same reference returns true')
  t.ok(
    isEqualSequence(sequenceB, [
      { sequence: 'd,e,f' },
      { sequence: '2,3,4' },
      {}
    ]),
    'different reference but deepEqual returns true'
  )
  t.notOk(isEqualSequence(sequenceA, sequenceB), 'not equal returns false')
})

test('<frameReducer/> iterator tests', t => {
  t.plan(3)

  const sequenceA = [
    { type: 'paint', payload: 'blue' },
    { type: 'forward', payload: 1 },
    { type: 'left', payload: 2 },
    { type: 'paint', payload: 'blue' }
  ]
  const iteratorA = createIterator(getIterator(sequenceA, {}))

  t.equal(
    typeof iteratorA,
    'object',
    'generator object gets created from sequence'
  )
  t.equal(typeof iteratorA.next(), 'object', 'next returns iterable')

  const errorB = { error: { name: 'testError', loc: { line: -1 } } }
  const expectedError = { e: errorB.error, message: 'testError', lineNum: -2 }

  try {
    const iteratorB = createIterator(() => errorB)
  } catch (e) {
    t.deepEqual(e, expectedError, 'throws error when present in generator')
  }
})

test('<frameReducer/> createFrames and createPaintFrames tests', t => {
  t.plan(3)

  const apiA = createApi(capabilities, 0)
  const sequenceA = [
    { type: 'paint', payload: 'blue' },
    { type: 'down', payload: 2 },
    { type: 'right', payload: 3 },
    { type: 'paint', payload: 'blue' }
  ]

  const startFrame = {
    animals: [{ current: { location: [0, 0] } }]
  }
  const endFrame = {
    animals: [{ current: { location: [2, 3] } }],
    paints: 2,
    painted: { '0,0': 'blue', '2,3': 'blue' }
  }

  const createdFramesA = createFrames(
    startFrame,
    getIterator(sequenceA, apiA),
    'seed'
  )
  t.ok(Array.isArray(createdFramesA), 'returns array of frames')
  t.deepEqual(createdFramesA[3], endFrame, 'iterates and paints frames')

  const endPaintFrames = [{ '0,0': 'blue' }, { '0,0': 'blue', '2,3': 'blue' }]
  const paintFramesA = createPaintFrames(
    startFrame,
    getIterator(sequenceA, apiA),
    'seed'
  )
  t.deepEqual(paintFramesA, endPaintFrames, 'returns only paint frames')
})

test('<frameReducer/> getLastFrame and getLastTeacherFrame tests', t => {
  t.plan(4)

  const apiA = createApi(capabilities, 0)
  const sequenceA = [
    { type: 'paint', payload: 'blue' },
    { type: 'down', payload: 2 },
    { type: 'right', payload: 3 },
    { type: 'paint', payload: 'blue' }
  ]

  const startFrame = {
    animals: [{ initial: { location: [0, 0] } }],
    levelSize: [4, 4]
  }
  const endFrame = { '0,0': 'blue', '2,3': 'blue' }

  const lastFrameA = getLastFrame(startFrame, getIterator(sequenceA, apiA))
  t.notOk(Array.isArray(lastFrameA), 'returns one frame')
  t.deepEqual(lastFrameA, endFrame, 'iterates, paints, returns last frame')

  const lastTeacherFrameB = getLastTeacherFrame(
    startFrame,
    getIterator(sequenceA, apiA)
  )
  t.notOk(Array.isArray(lastFrameA), 'returns one teacher frame')
  t.deepEqual(
    lastFrameA,
    endFrame,
    'iterates, paints, returns last teacher frame'
  )
})

test('<frameReducer/> checkBounds tests', t => {
  t.plan(4)

  t.ok(checkBounds([0, 0], [2, 2]), 'within bounds')
  t.notOk(checkBounds([2, 2], [2, 2]), 'bad coord, on bounds')
  t.notOk(checkBounds([-1, 0], [2, 2]), 'bad row, negative')
  t.notOk(checkBounds([0, 3], [2, 2]), 'bad column, out of bounds')
})
