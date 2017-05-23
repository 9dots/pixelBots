const {createFrames, getLastFrame} = require('../utils/frameReducer')
const animalApis = require('../utils/animalApis/index').default
const checkCorrect = require('../utils/checkCorrect')
const getIterator = require('../utils/getIterator')
const functions = require('firebase-functions')
const cors = require('cors')({origin: true})
const objEqual = require('@f/equal-obj')
const express = require('express')
const srand = require('@f/srand')

const router = new express.Router()

router.use(cors)
router.get('*', (req, res) => {
  return res.send('Can not GET')
})
router.post('/', (req, res) => {
  res.set({'Cache-Control': 'no-cache'})
  const props = req.body.props
  const {active, animals, solution, initialData, targetPainted} = props
  const userCode = getIterator(animals[active].sequence, animalApis[animals[active].type].default(active))
  const base = Object.assign({}, props, {painted: {}})
  console.log(targetPainted)
  if (targetPainted && Object.keys(targetPainted).length > 0) {
    const painted = initialData.initialPainted || {}
    console.log('painted & sequence', painted, animals[active].sequence)
    const answer = getLastFrame(Object.assign({}, base, {painted}), userCode)
    const seed = [{painted, userSolution: answer}]
    if (checkCorrect(answer, targetPainted)) {
      return res.status(200).send({status: 'success', correctSeeds: seed})
    }
    return res.status(200).send({status: 'failed', failedSeeds: seed})
  }

  const startCode = getIterator(initialData.initialPainted, animalApis.teacherBot.default(0))
  const solutionIterator = getIterator(solution[0].sequence, animalApis[solution[0].type].default(0))
  const uniquePaints = []
  const failedSeeds = []
  const correctSeeds = []
  for (let i = 0; i < 100; i++) {
    const painted = createPainted(Object.assign({}, base, {
      startGrid: {},
      animals: animals.filter(a => a.type === 'teacherBot').map(a => Object.assign({}, a, {current: a.initial})),
      rand: srand(i)
    }), startCode)
    console.log(`paint-${i}`, painted)
    if (uniquePaints.every((paint) => !objEqual(paint, painted))) {
      uniquePaints.push(painted)
      const answer = getLastFrame(Object.assign({}, base, {painted}), userCode)
      console.log(`answer-${i}`, answer)
      const solutionState = Object.assign({}, props, {startGrid: painted})
      if (!checkCorrect(answer, generateSolution(solutionState, solutionIterator))) {
        failedSeeds.push({painted, userSolution: answer, seed: i})
      } else {
        correctSeeds.push({painted, userSolution: answer, seed: i})
      }
    }
  }
  if (failedSeeds.length > 0) {
    return res.status(200).send({status: 'failed', failedSeeds, correctSeeds})
  }
  return res.status(200).send({status: 'success', correctSeeds})
})

module.exports = functions.https.onRequest((req, res) => {
  req.url = req.path ? req.url : `/${req.url}`
  return router(req, res)
})

function createPainted (state, code) {
  return createFrames(state, code).pop().painted
}

function generateSolution ({initialPainted, solution, levelSize, active, startGrid}, code) {
  return createFrames({
    active,
    painted: startGrid,
    animals: solution.map(animal => Object.assign({}, animal, {current: animal.initial}))
  }, code).pop().painted
}
