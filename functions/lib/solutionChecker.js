const {
  createFrames,
  getLastFrame,
  getIterator
} = require('../utils/frameReducer/frameReducer')
const animalApis = require('../utils/animalApis/index')
const checkCorrect = require('../utils/checkCorrect')
const functions = require('firebase-functions')
const cors = require('cors')({ origin: true })
const objEqual = require('@f/equal-obj')
const admin = require('firebase-admin')
const filter = require('@f/filter')
const express = require('express')
const map = require('@f/map')
const srand = require('@f/srand')

const createApi = animalApis.default
const teacherBot = animalApis.teacherBot
const router = new express.Router()

const savedRef = admin.database().ref('/saved')

router.use(cors)
router.get('*', (req, res) => {
  return res.send('Can not GET')
})
router.post('/', (req, res) => {
  res.set({ 'Cache-Control': 'no-cache' })
  const props = req.body.props
  const {
    active,
    advanced,
    animals,
    palette,
    solution,
    initialData,
    targetPainted,
    capabilities
  } = props
  const saveRef = props.saveRef
    ? savedRef.child(props.saveRef)
    : { update: () => Promise.resolve() }
  const userApi = createApi(capabilities, active, palette)
  const userCode = getIterator(animals[active].sequence, userApi)
  try {
    userCode()
  } catch (e) {
    console.error('saveRef', saveRef, e)
    return res.status(200).send({ status: 'failed', error: e })
  }
  const base = Object.assign({}, props, { painted: {} })
  const togglePaints = filter(
    val => val === 'toggle',
    initialData.initialPainted || {}
  )
  if (!advanced && Object.keys(togglePaints).length === 0) {
    const painted = initialData.initialPainted || {}
    const [answer, steps] = getLastFrame(
      Object.assign({}, base, { painted }),
      userCode
    )
    const seed = [{ painted, userSolution: answer }]
    if (checkCorrect(answer, targetPainted)) {
      console.log('correct')
      return saveRef
        .update({ steps, solutionSteps: props.solutionSteps })
        .then(() =>
          res.status(200).send({
            correctSeeds: seed,
            status: 'success'
          })
        )
    }
    console.log('fail', answer, targetPainted)
    return res.status(200).send({ status: 'failed', failedSeeds: seed })
  }
  const uniquePaints = []
  const failedSeeds = []
  const correctSeeds = []
  if (advanced) {
    const startCode = getIterator(
      initialData.initialPainted,
      createApi(teacherBot, 0, palette.color)
    )
    const solutionIterator = getIterator(solution[0].sequence, userApi)

    for (let i = 0; i < 100; i++) {
      const painted = createPainted(
        Object.assign({}, base, {
          animals: animals
            .filter(a => a.type === 'teacherBot')
            .map(a => Object.assign({}, a, { current: a.initial })),
          rand: srand(i)
        }),
        startCode
      )
      if (uniquePaints.every(paint => !objEqual(paint, painted))) {
        uniquePaints.push(painted)
        const [answer, steps] = getLastFrame(
          Object.assign({}, base, { painted }),
          userCode
        )
        const solutionState = Object.assign({}, props, { startGrid: painted })
        var [solutionPainted, solutionSteps] = generateSolution(
          solutionState,
          solutionIterator
        )
        if (!checkCorrect(answer, solutionPainted)) {
          failedSeeds.push({ painted, userSolution: answer, seed: i })
        } else {
          correctSeeds.push({
            painted,
            userSolution: answer,
            seed: i,
            steps,
            solutionSteps
          })
        }
      }
    }
  } else {
    for (let i = 0; i < 100; i++) {
      const rand = srand(i)
      const painted = map(
        val => (val === 'toggle' ? (rand(2, 0) > 1 ? 'blue' : 'yellow') : val),
        initialData.initialPainted
      )
      if (uniquePaints.every(paint => !objEqual(paint, painted))) {
        uniquePaints.push(painted)
        const [answer, steps] = getLastFrame(
          Object.assign({}, base, { painted }),
          userCode
        )
        if (!checkCorrect(answer, targetPainted)) {
          failedSeeds.push({ painted, userSolution: answer, seed: i })
        } else {
          correctSeeds.push({
            painted,
            userSolution: answer,
            seed: i,
            steps,
            solutionSteps: props.solutionSteps
          })
        }
      }
    }
  }

  if (failedSeeds.length > 0) {
    return res.status(200).send({ status: 'failed', failedSeeds, correctSeeds })
  }
  return saveRef
    .update({
      steps: average(getSteps(correctSeeds, 'steps')),
      solutionSteps: average(getSteps(correctSeeds, 'solutionSteps'))
    })
    .then(() =>
      res.status(200).send({
        status: 'success',
        correctSeeds
      })
    )
})

module.exports = functions.https.onRequest((req, res) => {
  req.url = req.path ? req.url : `/${req.url}`
  return router(req, res)
})

function getSteps (arr, key) {
  return arr.map(val => val[key])
}

function average (arr) {
  return arr.reduce((acc, next) => acc + next, 0) / arr.length
}

function createPainted (state, code) {
  return createFrames(state, code).pop().painted
}

function generateSolution (
  { initialPainted, solution, levelSize, active, startGrid },
  code
) {
  const frames = createFrames(
    {
      active,
      painted: startGrid,
      animals: solution.map(animal =>
        Object.assign({}, animal, { current: animal.initial })
      )
    },
    code
  )
  return [frames.pop().painted, frames.length]
}

function objectSome (obj, fn) {
  if (typeof obj !== 'object') {
    throw 'Must pass object'
  }
  const keys = Object.keys(obj)
  return keys.some(val => fn(obj[val], val, obj))
}
