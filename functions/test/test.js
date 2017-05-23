const {generatePainted, createFrames, getLastFrame, createPaintFrames} = require('../utils/frameReducer')
const animalApis = require('../utils/animalApis/index').default
const checkCorrect = require('../utils/checkCorrect')
const getIterator = require('../utils/getIterator')
const functions = require('firebase-functions')
const cors = require('cors')()
const objEqual = require('@f/equal-obj')
const {Map} = require('immutable')
const srand = require('@f/srand')

  let incorrect = false

  const props = getProps()
  // const {active, animals, solution, initialData, targetPainted} = props
  // const userCode = getIterator(animals[active].sequence, animalApis[animals[active].type].default(active))

  // createPaintFrames(props, userCode)
  console.time('check')
  const {active, animals, solution, initialData, targetPainted} = props
  const userCode = getIterator(animals[active].sequence, animalApis[animals[active].type].default(active))
  const base = Object.assign({}, props, {painted: {}})
  if (targetPainted && Object.keys(targetPainted).length > 0) {
    const painted = initialData.initialPainted || {}
    const answer = getLastFrame(Object.assign({}, base, {painted}), userCode)
    console.log('painted', painted, 'answer', answer)
    // console.log(answer)
    const seed = [{painted, userSolution: answer}]
    if (checkCorrect(answer, targetPainted)) {
      console.log({status: 'success', correctSeeds: seed})
    }
    console.log({status: 'failed', failedSeeds: seed})
  } else {
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
    "title":"Untitled",
    "description":"Use code to draw the image.",
    "inputType":"icons",
    "levelSize":[
    5,
    5
    ],
    "painted":{
    "4,0":"black",
    "3,1":"black"
    },
    "selected":{
    },
    "targetPainted":{
    },
    "initialPainted":{
    "4,0":"black",
    "3,1":"black"
    },
    "initialData":{
    "type":"write",
    "runners":null,
    "title":"Untitled",
    "description":"Use code to draw the image.",
    "inputType":"icons",
    "levelSize":[
    5,
    5
    ],
    "painted":false,
    "selected":{
    },
    "targetPainted":{
    },
    "initialPainted":"repeat(rand(1, 3), () => {\n  paint('black')\n  up()\n  right()\n})",
    "initialData":{
    },
    "solution":[
    {
    "current":{
    "dir":0,
    "location":[
    3,
    1
    ],
    "rot":0
    },
    "hidden":false,
    "initial":{
    "dir":0,
    "location":[
    4,
    0
    ],
    "rot":0
    },
    "sequence":[
    {
    "args":[
    {
    "default":"white",
    "description":"The color to match",
    "name":"color",
    "type":"string",
    "values":[
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
    "block":true,
    "description":"conditional block",
    "payload":[
    "white"
    ],
    "type":"ifColor",
    "usage":"ifColor(color, function(){ // code to execute // if the color matches })"
    },
    {
    "description":"Move the pixelbot right `steps` space.",
    "payload":[
    1
    ],
    "type":"right",
    "usage":"right(steps)"
    },
    {
    "args":[
    {
    "default":"black",
    "description":"The color to paint.",
    "name":"color",
    "type":"string",
    "values":[
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
    "description":"Paint the square the toucan is currently on `color`.",
    "payload":[
    "black"
    ],
    "type":"paint",
    "usage":"paint(color)"
    },
    {
    "type":"block_end"
    },
    {
    "description":"Move the pixelbot right `steps` space.",
    "payload":[
    1
    ],
    "type":"right",
    "usage":"right(steps)"
    },
    {
    "args":[
    {
    "default":"black",
    "description":"The color to paint.",
    "name":"color",
    "type":"string",
    "values":[
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
    "description":"Paint the square the toucan is currently on `color`.",
    "payload":[
    "black"
    ],
    "type":"paint",
    "usage":"paint(color)"
    }
    ],
    "type":"chameleon"
    }
    ],
    "editorState":{
    },
    "activeLine":0,
    "cursor":0,
    "active":0,
    "steps":0,
    "speed":1,
    "frames":{
    },
    "capabilities":{
    "block_end":true,
    "down":true,
    "ifColor":[
    true
    ],
    "left":true,
    "paint":[
    [
    {
    "name":"black",
    "value":"#000000"
    },
    {
    "name":"white",
    "value":"#FFFFFF"
    }
    ]
    ],
    "repeat":[
    true
    ],
    "right":true,
    "up":true
    },
    "animals":[
    {
    "current":{
    "dir":0,
    "location":[
    4,
    0
    ],
    "rot":0
    },
    "hidden":true,
    "initial":{
    "dir":0,
    "location":[
    4,
    0
    ],
    "rot":0
    },
    "sequence":[
    {
    "description":"Move the pixelbot up `steps` space.",
    "payload":[
    1
    ],
    "type":"up",
    "usage":"up(steps)"
    },
    {
    "description":"Move the pixelbot right `steps` space.",
    "payload":[
    1
    ],
    "type":"right",
    "usage":"right(steps)"
    },
    {
    "args":[
    {
    "default":"black",
    "description":"The color to paint.",
    "name":"color",
    "type":"string",
    "values":[
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
    "description":"Paint the square the toucan is currently on `color`.",
    "payload":[
    "black"
    ],
    "type":"paint",
    "usage":"paint(color)"
    }
    ],
    "type":"chameleon"
    },
    {
    "current":{
    "location":[
    4,
    0
    ],
    "rot":0
    },
    "hidden":false,
    "initial":{
    "location":[
    4,
    0
    ],
    "rot":0
    },
    "type":"teacherBot"
    }
    ],
    "advanced":true,
    "creatorID":"OomwNVi8vScVtr3h5dD7CHFkEj62",
    "lastEdited":1495574847454,
    "meta":{
    "creatorID":"OomwNVi8vScVtr3h5dD7CHFkEj62",
    "lastEdited":1495574856204,
    "loc":3,
    "username":"danleavitt0"
    },
    "shortLink":"JNDOG",
    "gameRef":"-Kkmytxo26tYFWa1feZJ",
    "uid":"OomwNVi8vScVtr3h5dD7CHFkEj62",
    "username":"danleavitt0",
    "ready":true
    },
    "solution":[
    {
    "current":{
    "dir":0,
    "location":[
    3,
    1
    ],
    "rot":0
    },
    "hidden":false,
    "initial":{
    "dir":0,
    "location":[
    4,
    0
    ],
    "rot":0
    },
    "sequence":[
    {
    "args":[
    {
    "default":"white",
    "description":"The color to match",
    "name":"color",
    "type":"string",
    "values":[
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
    "block":true,
    "description":"conditional block",
    "payload":[
    "white"
    ],
    "type":"ifColor",
    "usage":"ifColor(color, function(){ // code to execute // if the color matches })"
    },
    {
    "description":"Move the pixelbot right `steps` space.",
    "payload":[
    1
    ],
    "type":"right",
    "usage":"right(steps)"
    },
    {
    "args":[
    {
    "default":"black",
    "description":"The color to paint.",
    "name":"color",
    "type":"string",
    "values":[
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
    "description":"Paint the square the toucan is currently on `color`.",
    "payload":[
    "black"
    ],
    "type":"paint",
    "usage":"paint(color)"
    },
    {
    "type":"block_end"
    },
    {
    "description":"Move the pixelbot right `steps` space.",
    "payload":[
    1
    ],
    "type":"right",
    "usage":"right(steps)"
    },
    {
    "args":[
    {
    "default":"black",
    "description":"The color to paint.",
    "name":"color",
    "type":"string",
    "values":[
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
    "description":"Paint the square the toucan is currently on `color`.",
    "payload":[
    "black"
    ],
    "type":"paint",
    "usage":"paint(color)"
    }
    ],
    "type":"chameleon"
    }
    ],
    "editorState":{
    },
    "activeLine":4,
    "cursor":0,
    "active":0,
    "steps":0,
    "speed":1,
    "frames":{
    },
    "capabilities":{
    "block_end":true,
    "down":true,
    "ifColor":[
    true
    ],
    "left":true,
    "paint":[
    [
    {
    "name":"black",
    "value":"#000000"
    },
    {
    "name":"white",
    "value":"#FFFFFF"
    }
    ]
    ],
    "repeat":[
    true
    ],
    "right":true,
    "up":true
    },
    "animals":[
    {
    "current":{
    "dir":0,
    "location":[
    4,
    0
    ],
    "rot":0
    },
    "hidden":false,
    "initial":{
    "dir":0,
    "location":[
    4,
    0
    ],
    "rot":0
    },
    "sequence":[
    {
    "description":"Move the pixelbot up `steps` space.",
    "payload":[
    1
    ],
    "type":"up",
    "usage":"up(steps)"
    },
    {
    "description":"Move the pixelbot right `steps` space.",
    "payload":[
    1
    ],
    "type":"right",
    "usage":"right(steps)"
    },
    {
    "args":[
    {
    "default":"black",
    "description":"The color to paint.",
    "name":"color",
    "type":"string",
    "values":[
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
    "description":"Paint the square the toucan is currently on `color`.",
    "payload":[
    "black"
    ],
    "type":"paint",
    "usage":"paint(color)"
    }
    ],
    "type":"chameleon"
    },
    {
    "current":{
    "location":[
    4,
    0
    ],
    "rot":0
    },
    "hidden":true,
    "initial":{
    "location":[
    4,
    0
    ],
    "rot":0
    },
    "type":"teacherBot"
    }
    ]
}

}
