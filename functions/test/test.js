const {generatePainted, createFrames, getLastFrame, getIterator, createPaintFrames} = require('../utils/frameReducer/frameReducer')
const animalApis = require('../utils/animalApis/index')
const checkCorrect = require('../utils/checkCorrect')
const functions = require('firebase-functions')
const cors = require('cors')()
const objEqual = require('@f/equal-obj')
const {Map} = require('immutable')
const srand = require('@f/srand')
const map = require('@f/map')


const createApi = animalApis.default
const teacherBot = animalApis.teacherBot

let incorrect = false

const props = getProps()
  // const {active, animals, solution, initialData, targetPainted} = props
  // const userCode = getIterator(animals[active].sequence, animalApis[animals[active].type].default(active))

  // createPaintFrames(props, userCode)
console.time('check')
// console.log('teacherBot', teacherBot)
const {active, advanced, animals, solution, initialData, targetPainted, capabilities, palette} = props
const userApi = createApi(capabilities, active, palette)
const userCode = getIterator(animals[0].sequence, userApi)
const base = Object.assign({}, props, {painted: {}})
if (!advanced) {
  const painted = initialData.initialPainted || {}
  const answer = getLastFrame(Object.assign({}, base, {painted}), userCode)

    // console.log(answer)
  const seed = [{painted, userSolution: answer}]
  if (checkCorrect(answer, targetPainted)) {
    console.log({status: 'success', correctSeeds: seed})
  }
  console.log(painted, answer, userCode)
  console.log({status: 'failed', failedSeeds: seed})
} else if (advanced) {
  const startCode = getIterator(initialData.initialPainted, createApi(teacherBot, 0))
  const solutionIterator = getIterator(solution[0].sequence, userApi)
  const uniquePaints = []
  const failedSeeds = []
  const correctSeeds = []
  for (let i = 0; i < 100; i++) {
    const painted = createPainted(Object.assign({}, base, {
      startGrid: {},
      animals: animals.filter(a => a.type === 'teacherBot').map(a => Object.assign({}, a, {current: a.initial})),
      rand: srand(i)
    }), startCode)
    if (uniquePaints.every((paint) => !objEqual(paint, painted))) {
      uniquePaints.push(painted)
      const answer = getLastFrame(Object.assign({}, base, {painted}), userCode)
      const solutionState = Object.assign({}, props, {startGrid: painted})
      if (!checkCorrect(answer, generateSolution(solutionState, solutionIterator))) {
        failedSeeds.push({painted, userSolution: answer, seed: i})
      } else {
        correctSeeds.push({painted, userSolution: answer, seed: i})
      }
    }
  }
  console.log('failed', failedSeeds, 'correct', correctSeeds)
} else {
    const uniquePaints = []
    const failedSeeds = []
    const correctSeeds = []
    for (let i = 0; i < 100; i++) {
      const rand = srand(i)
      const painted = map((val) => val === 'toggle' ? rand(2, 0) > 1 ? 'blue' : 'yellow' : val, initialData.initialPainted || {})
      if (uniquePaints.every((paint) => !objEqual(paint, painted))) {
        uniquePaints.push(painted)
        const [answer, steps] = getLastFrame(Object.assign({}, base, {painted}), userCode)
        console.log('answer', answer, 'targetPainted', targetPainted)
        if (!checkCorrect(answer, targetPainted)) {
          failedSeeds.push({painted, userSolution: answer, seed: i})
        } else {
          correctSeeds.push({painted, userSolution: answer, seed: i, steps})
        }
      }
    }
    console.log(correctSeeds, failedSeeds, uniquePaints)
  }

console.timeEnd('check')

  // if (failedSeeds.length > 0) {
  //   console.log({status: 'failed', failedSeeds, correctSeeds})
  // } else {
  //   console.log({status: 'success', correctSeeds})
  // }

function createPainted (state, code) {
  return createFrames(state, code).pop().painted
}

function generateSolution ({initialPainted, solution, levelSize, active, startGrid}, code) {
  return createFrames({
    active: 0,
    painted: startGrid,
    animals: solution.map(animal => Object.assign({}, animal, {current: animal.initial}))
  }, code).pop().painted
}

function getProps () {
  return {
    "inventorySize": "2", "type":"write","runners":{},"title":"2's grouping demo (even)","description":"Use code to draw the image.","inputType":"icons","levelSize":[11,11],"painted":{"0,0":"black","0,1":"black","0,2":"black","0,3":"black","0,4":"black","0,5":"black","0,6":"black","0,7":"black","0,8":"black","0,9":"black"},"selected":[],"targetPainted":{"0,0":"black","0,2":"black","0,4":"black","0,6":"black","0,8":"black","1,0":"black","1,2":"black","1,4":"black","1,6":"black","1,8":"black"},"initialPainted":{"0,0":"black","0,1":"black","0,2":"black","0,3":"black","0,4":"black","0,5":"black","0,6":"black","0,7":"black","0,8":"black","0,9":"black"},"initialData":{"type":"write","runners":null,"title":"2's grouping demo (even)","description":"Use code to draw the image.","inputType":"icons","levelSize":[11,11],"painted":{"0,0":"black","0,1":"black","0,2":"black","0,3":"black","0,4":"black","0,5":"black","0,6":"black","0,7":"black","0,8":"black","0,9":"black"},"selected":[],"targetPainted":{"0,0":"black","0,2":"black","0,4":"black","0,6":"black","0,8":"black","1,0":"black","1,2":"black","1,4":"black","1,6":"black","1,8":"black"},"initialPainted":{"0,0":"black","0,1":"black","0,2":"black","0,3":"black","0,4":"black","0,5":"black","0,6":"black","0,7":"black","0,8":"black","0,9":"black"},"initialData":{},"saveRef":null,"solution":null,"solutionSteps":null,"imageUrl":"https://storage.googleapis.com/artbot-26016.appspot.com/-Ku64FRpW1AliUy7Ctyz.png?GoogleAccessId=firebase-adminsdk-syfaa@artbot-26016.iam.gserviceaccount.com&Expires=1742169600&Signature=nDZzjeiy0dG06bFMOCNGHWtHOXjq1B9kYOfRqtyGYboRRCHwJQOIQEsi1XfP9417sWk93KeUrVN7ytXiFUHH%2FTAC2PoDIx%2FRVFeDS01JvFMzOffwMqxCB4nk5jfuWGoEsECHzqVgS1f359b4yuBQEH%2BM9xkBG9EpY%2FuswdIKX6opTeJ7ev5o3XUNSdVAUBf0B9UB8bE4jTdr2LhDExk3YnhG%2BGkH9K2tAMsw7mpDnpfjV3%2Fp2g9eHTiFN2luU0qWBky4ZxHGYQQA4hNOhOttZ0SNHsM%2FA%2FDasW2BF%2FLIbrdBwb5kTAO8yPId4g8MOIMBSYT34szc8rWLTwGSwCd0TQ%3D%3D&v=2","editorState":[],"activeLine":0,"loops":{},"cursor":0,"active":0,"advanced":null,"steps":0,"speed":1,"frames":[],"palette":[{"name":"black","value":"#000000"},{"name":"white","value":"#FFFFFF"}],"capabilities":{"block_end":true,"down":[true],"faceNorth":true,"ifColor":[true],"left":[true],"moveTo":[true,true],"paint":[true],"pickUp":true,"place":true,"repeat":[true],"right":[true],"up":[true]},"animals":[{"current":{"dir":0,"location":[0,0],"rot":90},"initial":{"dir":0,"location":[0,0],"rot":90},"sequence":[{"args":[{"default":2,"description":"The number of times to repeat the loop.","name":"num","type":"number","values":[1,2,3,4,5,6,7,8,9]},{"description":"The function to be repeated","name":"() => {\n\t// code to repeat\n}","type":"function"}],"block":true,"description":"Repeat the actions inside of the loop `num` times.","id":"1505505694989.0","payload":[5],"type":"repeat"},{"args":[{"default":1,"description":"The number of steps right to move the pixelbot.","name":"steps","type":"number","values":[1,2,3,4,5,6,7,8,9]}],"defaultArgs":[1],"description":"Move the pixelbot right <%= args[0] %> space.","id":"1505505715606.1","payload":[1],"type":"right"},{"description":"Pick up the paint on the current pixel.","id":"1505505720055.2","type":"pickUp"},{"args":[{"default":1,"description":"The number of steps right to move the pixelbot.","name":"steps","type":"number","values":[1,2,3,4,5,6,7,8,9]}],"defaultArgs":[1],"description":"Move the pixelbot down <%= args[0] %> space.","id":"1505505721051.3","payload":[1],"type":"down"},{"args":[{"default":1,"description":"The number of steps right to move the pixelbot.","name":"steps","type":"number","values":[1,2,3,4,5,6,7,8,9]}],"defaultArgs":[1],"description":"Move the pixelbot left <%= args[0] %> space.","id":"1505505721918.4","payload":[1],"type":"left"},{"description":"Place the last inventory slot on the current pixel.","id":"1505505723455.5","type":"place"},{"args":[{"default":1,"description":"The number of steps right to move the pixelbot.","name":"steps","type":"number","values":[1,2,3,4,5,6,7,8,9]}],"defaultArgs":[1],"description":"Move the pixelbot up <%= args[0] %> space.","id":"1505505762162.8","payload":[1],"type":"up"},{"args":[{"default":1,"description":"The number of steps right to move the pixelbot.","name":"steps","type":"number","values":[1,2,3,4,5,6,7,8,9]}],"defaultArgs":[1],"description":"Move the pixelbot right <%= args[0] %> space.","id":"1505505729540.7","payload":[2],"type":"right"},{"id":8,"type":"block_end"}],"type":"penguin","hidden":false}],"creatorID":"r00DfjCLohZoPzKu3ourVEiBGAm2","imageVersion":2,"inventorySize":2,"lastEdited":1505523222001,"meta":{"runs":1,"slowdowns":1,"timeElapsed":7637},"shortLink":"ONQER","gameRef":"-Ku64FRpW1AliUy7Ctyz","uid":"LZjsDfVTMfUciywMaCneHLDcR6f1","runs":1,"slowdowns":1,"timeElapsed":7637,"solutionIterator":null,"lloc":8,"ready":true},"saveRef":"-Ku75Pth8r_4PNoiofqK0","solution":null,"solutionSteps":null,"imageUrl":"https://storage.googleapis.com/artbot-26016.appspot.com/-Ku64FRpW1AliUy7Ctyz.png?GoogleAccessId=firebase-adminsdk-syfaa@artbot-26016.iam.gserviceaccount.com&Expires=1742169600&Signature=nDZzjeiy0dG06bFMOCNGHWtHOXjq1B9kYOfRqtyGYboRRCHwJQOIQEsi1XfP9417sWk93KeUrVN7ytXiFUHH%2FTAC2PoDIx%2FRVFeDS01JvFMzOffwMqxCB4nk5jfuWGoEsECHzqVgS1f359b4yuBQEH%2BM9xkBG9EpY%2FuswdIKX6opTeJ7ev5o3XUNSdVAUBf0B9UB8bE4jTdr2LhDExk3YnhG%2BGkH9K2tAMsw7mpDnpfjV3%2Fp2g9eHTiFN2luU0qWBky4ZxHGYQQA4hNOhOttZ0SNHsM%2FA%2FDasW2BF%2FLIbrdBwb5kTAO8yPId4g8MOIMBSYT34szc8rWLTwGSwCd0TQ%3D%3D&v=2","editorState":[],"activeLine":-1,"loops":{},"cursor":0,"active":0,"advanced":null,"steps":0,"speed":1,"frames":[],"palette":[{"name":"black","value":"#000000"},{"name":"white","value":"#FFFFFF"}],"capabilities":{"block_end":true,"down":[true],"faceNorth":true,"ifColor":[true],"left":[true],"moveTo":[true,true],"paint":[true],"pickUp":true,"place":true,"repeat":[true],"right":[true],"up":[true]},"animals":[{"current":{"dir":0,"location":[0,0],"rot":90},"initial":{"dir":0,"location":[0,0],"rot":90},"sequence":[{"args":[{"default":2,"description":"The number of times to repeat the loop.","name":"num","type":"number","values":[1,2,3,4,5,6,7,8,9]},{"description":"The function to be repeated","name":"() => {\n\t// code to repeat\n}","type":"function"}],"block":true,"description":"Repeat the actions inside of the loop `num` times.","id":"1505505694989.0","payload":[5],"type":"repeat"},{"args":[{"default":1,"description":"The number of steps right to move the pixelbot.","name":"steps","type":"number","values":[1,2,3,4,5,6,7,8,9]}],"defaultArgs":[1],"description":"Move the pixelbot right <%= args[0] %> space.","id":"1505505715606.1","payload":[1],"type":"right"},{"description":"Pick up the paint on the current pixel.","id":"1505505720055.2","type":"pickUp"},{"args":[{"default":1,"description":"The number of steps right to move the pixelbot.","name":"steps","type":"number","values":[1,2,3,4,5,6,7,8,9]}],"defaultArgs":[1],"description":"Move the pixelbot down <%= args[0] %> space.","id":"1505505721051.3","payload":[1],"type":"down"},{"args":[{"default":1,"description":"The number of steps right to move the pixelbot.","name":"steps","type":"number","values":[1,2,3,4,5,6,7,8,9]}],"defaultArgs":[1],"description":"Move the pixelbot left <%= args[0] %> space.","id":"1505505721918.4","payload":[1],"type":"left"},{"description":"Place the last inventory slot on the current pixel.","id":"1505505723455.5","type":"place"},{"args":[{"default":1,"description":"The number of steps right to move the pixelbot.","name":"steps","type":"number","values":[1,2,3,4,5,6,7,8,9]}],"defaultArgs":[1],"description":"Move the pixelbot up <%= args[0] %> space.","id":"1505505762162.8","payload":[1],"type":"up"},{"args":[{"default":1,"description":"The number of steps right to move the pixelbot.","name":"steps","type":"number","values":[1,2,3,4,5,6,7,8,9]}],"defaultArgs":[1],"description":"Move the pixelbot right <%= args[0] %> space.","id":"1505505729540.7","payload":[2],"type":"right"},{"id":8,"type":"block_end"}],"type":"penguin","hidden":false}]}
  }
