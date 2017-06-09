const {generatePainted, createFrames, getLastFrame, getIterator, createPaintFrames} = require('../utils/frameReducer/frameReducer')
const animalApis = require('../utils/animalApis/index')
const checkCorrect = require('../utils/checkCorrect')
const functions = require('firebase-functions')
const cors = require('cors')()
const objEqual = require('@f/equal-obj')
const {Map} = require('immutable')
const srand = require('@f/srand')

const createApi = animalApis.default
const teacherBot = animalApis.capabilities

  let incorrect = false

  const props = getProps()
  // const {active, animals, solution, initialData, targetPainted} = props
  // const userCode = getIterator(animals[active].sequence, animalApis[animals[active].type].default(active))

  // createPaintFrames(props, userCode)
  console.time('check')
  const {active, animals, solution, initialData, targetPainted, capabilities, palette} = props
  const userApi = createApi(capabilities, active, palette)
  const userCode = getIterator(animals[active].sequence, userApi)
  const base = Object.assign({}, props, {painted: {}})
  if (targetPainted && Object.keys(targetPainted).length > 0) {
    const painted = initialData.initialPainted || {}
    const answer = getLastFrame(Object.assign({}, base, {painted}), userCode)
    // console.log(answer)
    const seed = [{painted, userSolution: answer}]
    if (checkCorrect(answer, targetPainted)) {
      console.log({status: 'success', correctSeeds: seed})
    }
    console.log({status: 'failed', failedSeeds: seed})
  } else {
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
"type":"write",
"runners":{
},
"title":"test",
"description":"Use code to draw the image. asdf",
"inputType":"icons",
"levelSize":[
8,
8
],
"painted":{
},
"selected":{
},
"targetPainted":{
"2,3":"lightGreen",
"3,2":"lightGreen",
"3,3":"lightGreen",
"3,4":"black",
"4,3":"lightGreen",
"4,4":"black",
"5,4":"black"
},
"initialPainted":{
},
"initialData":{
"type":"write",
"runners":null,
"title":"test",
"description":"Use code to draw the image. asdf",
"inputType":"icons",
"levelSize":[
8,
8
],
"painted":{
},
"selected":{
},
"targetPainted":{
"2,3":"lightGreen",
"3,2":"lightGreen",
"3,3":"lightGreen",
"3,4":"black",
"4,3":"lightGreen",
"4,4":"black",
"5,4":"black"
},
"initialPainted":{
},
"initialData":{
},
"solution":null,
"imageUrl":"https://storage.googleapis.com/artbot-26016.appspot.com/-Km2p8PCjpM7lYLQ4dei.png?GoogleAccessId=firebase-adminsdk-syfaa@artbot-26016.iam.gserviceaccount.com&Expires=1742169600&Signature=GU%2BF1ELMbGPu8fCyUtd62y2SaZrbOp%2BBDWi2z8vvs%2FRQpD739nqk3Te%2F1Lj54HgF9hvs0T1AnWyBmfxRsHmOqVsAn86BLGmdVg2Kk8gpxuvQwuDIftPhZTcbE0NTD93qCrsHI%2BPgtH1Y7%2BZarNSgQKrSFZh0d8qqRK4UvBAE2C0qIrH8m%2FGQg%2FRvnyEjnB5wknhE42MJuzcEgHut5C%2Byd2GMe%2BKtMUlerqRN5RRYgKyBAw1Mrhda90Z%2FF633CsnWFTLRsrewi8VaUiyawrhG1lMYkxOzQsDeSuf4z09tQWOmmQ3cSkdJeOUnaaFFPTf%2BxNzr4zKBb%2Btvvxqi6VVH1g%3D%3D",
"editorState":{
},
"activeLine":0,
"cursor":0,
"active":0,
"steps":0,
"speed":1,
"frames":{
},
"palette":[
{
"name":"red",
"value":"#f44336"
},
{
"name":"pink",
"value":"#e91e63"
},
{
"name":"purple",
"value":"#9c27b0"
},
{
"name":"deepPurple",
"value":"#673ab7"
},
{
"name":"indigo",
"value":"#3f51b5"
},
{
"name":"blue",
"value":"#2196f3"
},
{
"name":"lightBlue",
"value":"#03a9f4"
},
{
"name":"cyan",
"value":"#00bcd4"
},
{
"name":"teal",
"value":"#009688"
},
{
"name":"green",
"value":"#4caf50"
},
{
"name":"lightGreen",
"value":"#8bc34a"
},
{
"name":"lime",
"value":"#cddc39"
},
{
"name":"yellow",
"value":"#ffeb3b"
},
{
"name":"amber",
"value":"#ffc107"
},
{
"name":"orange",
"value":"#ff9800"
},
{
"name":"deepOrange",
"value":"#ff5722"
},
{
"name":"brown",
"value":"#795548"
},
{
"name":"grey",
"value":"#9e9e9e"
},
{
"name":"blueGrey",
"value":"#607d8b"
},
{
"name":"black",
"value":"#000000"
},
{
"name":"white",
"value":"#FFFFFF"
}
],
"capabilities":{
"block_end":true,
"forward":[
true
],
"paintT":[
true
],
"paintZ":[
true
],
"repeat":[
true
],
"turnLeft":true,
"turnRight":true
},
"animals":[
{
"current":{
"dir":0,
"location":[
6,
0
],
"rot":90
},
"hidden":false,
"initial":{
"dir":0,
"location":[
7,
0
],
"rot":0
},
"sequence":[
{
"args":[
{
"default":2,
"description":"The number of times to repeat the loop.",
"name":"num",
"type":"number",
"values":[
1,
2,
3,
4,
5,
6,
7,
8,
9
]
},
{
"description":"The function to be repeated",
"name":"() => { // code to repeat }",
"type":"function"
}
],
"block":true,
"description":"Repeat the actions inside of the loop.",
"payload":[
1
],
"type":"repeat"
},
{
"type":"block_end"
},
{
"args":[
{
"default":1,
"description":"The number of steps forward to move the pixelbot.",
"name":"steps",
"type":"number",
"values":[
1,
2,
3,
4,
5,
6,
7,
8,
9
]
}
],
"description":"Move the pixelbot one space in whichever direction it is facing.",
"payload":[
1
],
"type":"forward"
},
{
"description":"Turn the pixelbot 90 degrees to the right.",
"type":"turnRight"
},
{
"args":[
{
"default":"black",
"description":"The color to paint",
"name":"color",
"type":"string",
"values":[
{
"name":"red",
"value":"#f44336"
},
{
"name":"pink",
"value":"#e91e63"
},
{
"name":"purple",
"value":"#9c27b0"
},
{
"name":"deepPurple",
"value":"#673ab7"
},
{
"name":"indigo",
"value":"#3f51b5"
},
{
"name":"blue",
"value":"#2196f3"
},
{
"name":"lightBlue",
"value":"#03a9f4"
},
{
"name":"cyan",
"value":"#00bcd4"
},
{
"name":"teal",
"value":"#009688"
},
{
"name":"green",
"value":"#4caf50"
},
{
"name":"lightGreen",
"value":"#8bc34a"
},
{
"name":"lime",
"value":"#cddc39"
},
{
"name":"yellow",
"value":"#ffeb3b"
},
{
"name":"amber",
"value":"#ffc107"
},
{
"name":"orange",
"value":"#ff9800"
},
{
"name":"deepOrange",
"value":"#ff5722"
},
{
"name":"brown",
"value":"#795548"
},
{
"name":"grey",
"value":"#9e9e9e"
},
{
"name":"blueGrey",
"value":"#607d8b"
},
{
"name":"black",
"value":"#000000"
},
{
"name":"white",
"value":"#FFFFFF"
}
]
}
],
"description":"Paint an Z shape.",
"payload":[
"blue"
],
"type":"paintZ"
}
],
"type":"penguin"
},
{
"current":{
"location":[
7,
0
],
"rot":0
},
"hidden":true,
"initial":{
"location":[
7,
0
],
"rot":0
},
"type":"teacherBot"
}
],
"advanced":false,
"creatorID":"b1V2uAmlCieLOdP749PkdhGxfUw2",
"lastEdited":1497034926425,
"lineLimit":10,
"meta":{
"attempts":3,
"creatorID":"b1V2uAmlCieLOdP749PkdhGxfUw2",
"lastEdited":1497034929490,
"loc":5,
"username":"danleavitt0"
},
"shortLink":"Y7MEM",
"gameRef":"-Km2p8PCjpM7lYLQ4dei",
"uid":"b1V2uAmlCieLOdP749PkdhGxfUw2",
"username":"danleavitt0",
"solutionIterator":null,
"ready":true
},
"solution":null,
"imageUrl":"https://storage.googleapis.com/artbot-26016.appspot.com/-Km2p8PCjpM7lYLQ4dei.png?GoogleAccessId=firebase-adminsdk-syfaa@artbot-26016.iam.gserviceaccount.com&Expires=1742169600&Signature=GU%2BF1ELMbGPu8fCyUtd62y2SaZrbOp%2BBDWi2z8vvs%2FRQpD739nqk3Te%2F1Lj54HgF9hvs0T1AnWyBmfxRsHmOqVsAn86BLGmdVg2Kk8gpxuvQwuDIftPhZTcbE0NTD93qCrsHI%2BPgtH1Y7%2BZarNSgQKrSFZh0d8qqRK4UvBAE2C0qIrH8m%2FGQg%2FRvnyEjnB5wknhE42MJuzcEgHut5C%2Byd2GMe%2BKtMUlerqRN5RRYgKyBAw1Mrhda90Z%2FF633CsnWFTLRsrewi8VaUiyawrhG1lMYkxOzQsDeSuf4z09tQWOmmQ3cSkdJeOUnaaFFPTf%2BxNzr4zKBb%2Btvvxqi6VVH1g%3D%3D",
"editorState":{
},
"activeLine":-1,
"cursor":0,
"active":0,
"steps":0,
"speed":1,
"frames":{
},
"palette":[
{
"name":"red",
"value":"#f44336"
},
{
"name":"pink",
"value":"#e91e63"
},
{
"name":"purple",
"value":"#9c27b0"
},
{
"name":"deepPurple",
"value":"#673ab7"
},
{
"name":"indigo",
"value":"#3f51b5"
},
{
"name":"blue",
"value":"#2196f3"
},
{
"name":"lightBlue",
"value":"#03a9f4"
},
{
"name":"cyan",
"value":"#00bcd4"
},
{
"name":"teal",
"value":"#009688"
},
{
"name":"green",
"value":"#4caf50"
},
{
"name":"lightGreen",
"value":"#8bc34a"
},
{
"name":"lime",
"value":"#cddc39"
},
{
"name":"yellow",
"value":"#ffeb3b"
},
{
"name":"amber",
"value":"#ffc107"
},
{
"name":"orange",
"value":"#ff9800"
},
{
"name":"deepOrange",
"value":"#ff5722"
},
{
"name":"brown",
"value":"#795548"
},
{
"name":"grey",
"value":"#9e9e9e"
},
{
"name":"blueGrey",
"value":"#607d8b"
},
{
"name":"black",
"value":"#000000"
},
{
"name":"white",
"value":"#FFFFFF"
}
],
"capabilities":{
"block_end":true,
"forward":[
true
],
"paintT":[
true
],
"paintZ":[
true
],
"repeat":[
true
],
"turnLeft":true,
"turnRight":true
},
"animals":[
{
"current":{
"dir":0,
"location":[
7,
0
],
"rot":0
},
"hidden":false,
"initial":{
"dir":0,
"location":[
7,
0
],
"rot":0
},
"sequence":[
{
"args":[
{
"default":2,
"description":"The number of times to repeat the loop.",
"name":"num",
"type":"number",
"values":[
1,
2,
3,
4,
5,
6,
7,
8,
9
]
},
{
"description":"The function to be repeated",
"name":"() => { // code to repeat }",
"type":"function"
}
],
"block":true,
"description":"Repeat the actions inside of the loop.",
"payload":[
1
],
"type":"repeat"
},
{
"type":"block_end"
},
{
"args":[
{
"default":1,
"description":"The number of steps forward to move the pixelbot.",
"name":"steps",
"type":"number",
"values":[
1,
2,
3,
4,
5,
6,
7,
8,
9
]
}
],
"description":"Move the pixelbot one space in whichever direction it is facing.",
"payload":[
1
],
"type":"forward"
},
{
"description":"Turn the pixelbot 90 degrees to the right.",
"type":"turnRight"
},
{
"args":[
{
"default":"black",
"description":"The color to paint",
"name":"color",
"type":"string",
"values":[
{
"name":"red",
"value":"#f44336"
},
{
"name":"pink",
"value":"#e91e63"
},
{
"name":"purple",
"value":"#9c27b0"
},
{
"name":"deepPurple",
"value":"#673ab7"
},
{
"name":"indigo",
"value":"#3f51b5"
},
{
"name":"blue",
"value":"#2196f3"
},
{
"name":"lightBlue",
"value":"#03a9f4"
},
{
"name":"cyan",
"value":"#00bcd4"
},
{
"name":"teal",
"value":"#009688"
},
{
"name":"green",
"value":"#4caf50"
},
{
"name":"lightGreen",
"value":"#8bc34a"
},
{
"name":"lime",
"value":"#cddc39"
},
{
"name":"yellow",
"value":"#ffeb3b"
},
{
"name":"amber",
"value":"#ffc107"
},
{
"name":"orange",
"value":"#ff9800"
},
{
"name":"deepOrange",
"value":"#ff5722"
},
{
"name":"brown",
"value":"#795548"
},
{
"name":"grey",
"value":"#9e9e9e"
},
{
"name":"blueGrey",
"value":"#607d8b"
},
{
"name":"black",
"value":"#000000"
},
{
"name":"white",
"value":"#FFFFFF"
}
]
}
],
"description":"Paint an Z shape.",
"payload":[
"blue"
],
"type":"paintZ"
}
],
"type":"penguin"
},
{
"current":{
"location":[
7,
0
],
"rot":0
},
"hidden":true,
"initial":{
"location":[
7,
0
],
"rot":0
},
"type":"teacherBot"
}
]
}
}
