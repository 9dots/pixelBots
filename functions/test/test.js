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
const {active, advanced, animals, solution, initialData, targetPainted, capabilities, palette} = props
const userApi = createApi(capabilities, active, palette)
const userCode = getIterator(animals[active].sequence, userApi)
const base = Object.assign({}, props, {painted: {}})
if (!advanced) {
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
    console.log(`painted-${i}`, painted)
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
    'type': 'write',
    'runners': {
    },
    'title': 'Advanced test',
    'description': 'Use code to draw the image.',
    'inputType': 'code',
    'levelSize': [
      5,
      5
    ],
    'painted': {
      '4,0': 'black',
      '3,1': 'black'
    },
    'selected': {
    },
    'targetPainted': {
      '0,3': 'black',
      '1,2': 'black',
      '1,3': 'black',
      '2,1': 'black',
      '2,2': 'black',
      '3,0': 'black',
      '3,1': 'black',
      '4,0': 'black'
    },
    'initialPainted': {
      '4,0': 'black',
      '3,1': 'black'
    },
    'initialData': {
      'type': 'write',
      'runners': null,
      'title': 'Advanced test',
      'description': 'Use code to draw the image.',
      'inputType': 'code',
      'levelSize': [
        5,
        5
      ],
      'painted': false,
      'selected': {
      },
      'targetPainted': {
        '0,3': 'black',
        '1,2': 'black',
        '1,3': 'black',
        '2,1': 'black',
        '2,2': 'black',
        '3,0': 'black',
        '3,1': 'black',
        '4,0': 'black'
      },
      'initialPainted': 'const r = rand(0, 5)\n repeat(r, () => { paint()\n up()\n right() })',
      'initialData': {
      },
      'saveRef': null,
      'solution': [
        {
          'current': {
            'dir': 0,
            'location': [
              0,
              4
            ],
            'rot': 0
          },
          'hidden': false,
          'initial': {
            'dir': 0,
            'location': [
              4,
              0
            ],
            'rot': 0
          },
          'sequence': "repeat(4, () => { ifColor('black', () => { up()\n paint('black')\n down() }) up() right() }) ",
          'type': 'penguin'
        }
      ],
      'solutionSteps': 15,
      'imageUrl': 'https://storage.googleapis.com/artbot-dev.appspot.com/-KlWNmnzmyGoqVdN1w9j.png?GoogleAccessId=firebase-adminsdk-s9axw@artbot-dev.iam.gserviceaccount.com&Expires=1742169600&Signature=joM8QHZ8aD7pnHzyI4vqcvf%2Bqk%2FekU1nCBPO2rWhn7vXmplGs66GXYL1IpdoFcHg0pXkvoDTl6QJob6IpLkaXdgWlxgxtVjEb8VgQzT73opWxNPjI0ygxxEwB89EsAsmhFFPzeAadAfM9DYOtVLEJ9uDyvn9gWr%2B5oesUTbTxYtQaXWtn6n9Nkj2VyW3EC%2FZKYyWZvpraox8nYmbOIXxbph5Y4%2BoyA2k%2FOS2rIy3DoclhR7C1HM0OHfgR4nwcd6nugsQvT1EXOOAyjdbXMW5BpclwDgEw7Tx2HvEl4O4TOKmNqDU2DD7au6RPkeAUvS3kHNfj5Q4zknTBljY1%2FV8zA%3D%3D',
      'editorState': {
      },
      'activeLine': 0,
      'cursor': 0,
      'active': 0,
      'advanced': true,
      'steps': 16,
      'speed': 1,
      'frames': {
      },
      'palette': [
        {
          'name': 'pink',
          'value': '#e91e63'
        },
        {
          'name': 'purple',
          'value': '#9c27b0'
        },
        {
          'name': 'deepPurple',
          'value': '#673ab7'
        },
        {
          'name': 'indigo',
          'value': '#3f51b5'
        },
        {
          'name': 'blue',
          'value': '#2196f3'
        },
        {
          'name': 'lightBlue',
          'value': '#03a9f4'
        },
        {
          'name': 'cyan',
          'value': '#00bcd4'
        },
        {
          'name': 'teal',
          'value': '#009688'
        },
        {
          'name': 'green',
          'value': '#4caf50'
        },
        {
          'name': 'lightGreen',
          'value': '#8bc34a'
        },
        {
          'name': 'lime',
          'value': '#cddc39'
        },
        {
          'name': 'yellow',
          'value': '#ffeb3b'
        },
        {
          'name': 'amber',
          'value': '#ffc107'
        },
        {
          'name': 'orange',
          'value': '#ff9800'
        },
        {
          'name': 'deepOrange',
          'value': '#ff5722'
        },
        {
          'name': 'brown',
          'value': '#795548'
        },
        {
          'name': 'grey',
          'value': '#9e9e9e'
        },
        {
          'name': 'blueGrey',
          'value': '#607d8b'
        },
        {
          'name': 'black',
          'value': '#000000'
        },
        {
          'name': 'white',
          'value': '#FFFFFF'
        }
      ],
      'capabilities': {
        'block_end': true,
        'down': [
          true
        ],
        'ifColor': [
          true
        ],
        'left': [
          true
        ],
        'moveTo': [
          true,
          true
        ],
        'paint': [
          true
        ],
        'paintI': [
          true
        ],
        'paintO': [
          true
        ],
        'paintS': [
          true
        ],
        'repeat': [
          true
        ],
        'right': [
          true
        ],
        'up': [
          true
        ]
      },
      'animals': [
        {
          'current': {
            'dir': 0,
            'location': [
              4,
              0
            ],
            'rot': 0
          },
          'hidden': true,
          'initial': {
            'dir': 0,
            'location': [
              4,
              0
            ],
            'rot': 0
          },
          'sequence': "repeat(4, i => { ifColor('black', () => { up() paint() down() }) up() right() })",
          'type': 'penguin'
        },
        {
          'current': {
            'location': [
              4,
              0
            ],
            'rot': 0
          },
          'hidden': false,
          'initial': {
            'location': [
              4,
              0
            ],
            'rot': 0
          },
          'type': 'teacherBot'
        }
      ],
      'creatorID': 'b1V2uAmlCieLOdP749PkdhGxfUw2',
      'lastEdited': 1498676797074,
      'meta': {
        'lastEdited': 1498674333057,
        'loc': 1,
        'runs': 2,
        'slowdowns': 2,
        'timeElapsed': 631236
      },
      'shortLink': '59G2B',
      'stretch': {
        'type': 'lineLimit',
        'value': '10'
      },
      'gameRef': '-KlWNmnzmyGoqVdN1w9j',
      'uid': 'b1V2uAmlCieLOdP749PkdhGxfUw2',
      'ready': true
    },
    'saveRef': '-KnHE7RCqguhWs-0rsNT5',
    'solution': [
      {
        'current': {
          'dir': 0,
          'location': [
            0,
            4
          ],
          'rot': 0
        },
        'hidden': false,
        'initial': {
          'dir': 0,
          'location': [
            4,
            0
          ],
          'rot': 0
        },
        'sequence': "repeat(4, i => { ifColor('black', () => { up()\n paint()\n down() })\n up()\n right() })",
        'type': 'penguin'
      }
    ],
    'solutionSteps': 15,
    'imageUrl': 'https://storage.googleapis.com/artbot-dev.appspot.com/-KlWNmnzmyGoqVdN1w9j.png?GoogleAccessId=firebase-adminsdk-s9axw@artbot-dev.iam.gserviceaccount.com&Expires=1742169600&Signature=joM8QHZ8aD7pnHzyI4vqcvf%2Bqk%2FekU1nCBPO2rWhn7vXmplGs66GXYL1IpdoFcHg0pXkvoDTl6QJob6IpLkaXdgWlxgxtVjEb8VgQzT73opWxNPjI0ygxxEwB89EsAsmhFFPzeAadAfM9DYOtVLEJ9uDyvn9gWr%2B5oesUTbTxYtQaXWtn6n9Nkj2VyW3EC%2FZKYyWZvpraox8nYmbOIXxbph5Y4%2BoyA2k%2FOS2rIy3DoclhR7C1HM0OHfgR4nwcd6nugsQvT1EXOOAyjdbXMW5BpclwDgEw7Tx2HvEl4O4TOKmNqDU2DD7au6RPkeAUvS3kHNfj5Q4zknTBljY1%2FV8zA%3D%3D',
    'editorState': {
    },
    'activeLine': -1,
    'cursor': 0,
    'active': 0,
    'advanced': true,
    'steps': 0,
    'speed': 14.973509933774835,
    'frames': {
    },
    'palette': [
      {
        'name': 'pink',
        'value': '#e91e63'
      },
      {
        'name': 'purple',
        'value': '#9c27b0'
      },
      {
        'name': 'deepPurple',
        'value': '#673ab7'
      },
      {
        'name': 'indigo',
        'value': '#3f51b5'
      },
      {
        'name': 'blue',
        'value': '#2196f3'
      },
      {
        'name': 'lightBlue',
        'value': '#03a9f4'
      },
      {
        'name': 'cyan',
        'value': '#00bcd4'
      },
      {
        'name': 'teal',
        'value': '#009688'
      },
      {
        'name': 'green',
        'value': '#4caf50'
      },
      {
        'name': 'lightGreen',
        'value': '#8bc34a'
      },
      {
        'name': 'lime',
        'value': '#cddc39'
      },
      {
        'name': 'yellow',
        'value': '#ffeb3b'
      },
      {
        'name': 'amber',
        'value': '#ffc107'
      },
      {
        'name': 'orange',
        'value': '#ff9800'
      },
      {
        'name': 'deepOrange',
        'value': '#ff5722'
      },
      {
        'name': 'brown',
        'value': '#795548'
      },
      {
        'name': 'grey',
        'value': '#9e9e9e'
      },
      {
        'name': 'blueGrey',
        'value': '#607d8b'
      },
      {
        'name': 'black',
        'value': '#000000'
      },
      {
        'name': 'white',
        'value': '#FFFFFF'
      }
    ],
    'capabilities': {
      'block_end': true,
      'down': [
        true
      ],
      'ifColor': [
        true
      ],
      'left': [
        true
      ],
      'moveTo': [
        true,
        true
      ],
      'paint': [
        true
      ],
      'paintI': [
        true
      ],
      'paintO': [
        true
      ],
      'paintS': [
        true
      ],
      'repeat': [
        true
      ],
      'right': [
        true
      ],
      'up': [
        true
      ]
    },
    'animals': [
      {
        'current': {
          'dir': 0,
          'location': [
            4,
            0
          ],
          'rot': 0
        },
        'hidden': false,
        'initial': {
          'dir': 0,
          'location': [
            4,
            0
          ],
          'rot': 0
        },
        'sequence': "repeat(4, i => { ifColor('black', () => { up()\n paint()\n down() })\n up()\n right() })",
        'type': 'penguin'
      },
      {
        'current': {
          'location': [
            4,
            0
          ],
          'rot': 0
        },
        'hidden': true,
        'initial': {
          'location': [
            4,
            0
          ],
          'rot': 0
        },
        'type': 'teacherBot'
      }
    ]
  }
}
