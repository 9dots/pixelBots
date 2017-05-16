const {generatePainted, createFrames, getLastFrame} = require('../utils/frameReducer')
const animalApis = require('../utils/animalApis/index').default
const checkCorrect = require('../utils/checkCorrect')
const getIterator = require('../utils/getIterator')
const functions = require('firebase-functions')
const cors = require('cors')()

  let incorrect = false

  const props = getProps()
  const {active, animals, solution, initialData} = props

  const base = Object.assign({}, props, {painted: {}})
  const startCode = getIterator(initialData.initialPainted, animalApis.teacherBot.default(1))
  const userCode = getIterator(animals[active].sequence, animalApis[animals[active].type].default(active))
  const solutionIterator = getIterator(solution[0].sequence, animalApis[solution[0].type].default(0))
  const failedSeeds = []

  for (let i = 0; i < 100; i++) {
    const painted = createPainted(Object.assign({}, base, {
      startGrid: {},
      animals: animals.map(a => Object.assign({}, a, {current: a.initial})),
      randSeed: i
    }), startCode)
    const answer = getLastFrame(Object.assign({}, base, {painted}), userCode)
    const solutionState = Object.assign({}, props, {startGrid: painted})
    if (!checkCorrect(answer, generateSolution(solutionState, solutionIterator))) {
      failedSeeds.push(i)
    }
  }
  if (failedSeeds.length > 0) {
    console.log({status: 'failed', failedSeeds})
  } else {
    console.log({status: 'success'})
  }

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
    'runners': {},
    'title': 'Untitled',
    'description': 'Use code to draw the image.',
    'inputType': 'code',
    'levelSize': [
      5,
      5
    ],
    'painted': {
      '3,1': 'black'
    },
    'selected': [],
    'targetPainted': {},
    'initialPainted': `const n = rand(1, 4)

repeat(n, () => {
  up()
  right()
  paint()
})`,
    'editorState': [],
    'activeLine': 6,
    'cursor': 0,
    'active': 0,
    'steps': 0,
    'speed': 1,
    'frames': [],
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
        'sequence': `up()
right()
repeat(3, () => {
  ifColor('black', () => {
    up()
    paint()
    down()
  })
  right()
  up()
})`,
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
    ],
    'advanced': true,
    'creatorID': 'OomwNVi8vScVtr3h5dD7CHFkEj62',
    'lastEdited': 1494700239712,
    'meta': {
      'attempts': 18,
      'creatorID': 'OomwNVi8vScVtr3h5dD7CHFkEj62',
      'lastEdited': 1494700243423,
      'loc': 10,
      'username': 'danleavitt0'
    },
    'shortLink': 'VZW2E',
    'solution': [
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
        'sequence': "up()\nright()\nrepeat(3, () => {\n  ifColor('black', () => {\n    up()\n    paint()\n    down()\n  })\n  right()\n  up()\n})",
        'type': 'penguin'
      }
    ],
    'gameRef': '-Kjj74wHNVlVzGfB3vdf',
    'uid': 'OomwNVi8vScVtr3h5dD7CHFkEj62',
    'username': 'danleavitt0',
    'initialData': {
      'type': 'write',
      'runners': null,
      'title': 'Untitled',
      'description': 'Use code to draw the image.',
      'inputType': 'code',
      'levelSize': [
        5,
        5
      ],
      'painted': false,
      'selected': [],
      'targetPainted': {},
      'initialPainted': 'const n = rand(1, 4)\n\nrepeat(n, () => {\n  up()\n  right()\n  paint()\n})',
      'editorState': [],
      'activeLine': 0,
      'cursor': 0,
      'active': 0,
      'steps': 0,
      'speed': 1,
      'frames': [],
      'animals': [
        {
          'current': {
            'dir': 0,
            'location': [
              2,
              3
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
          'sequence': 'right()\nup()\nright()\npaint()\nright()\nup()\npaint()\nright()\nup()\npaint()\n',
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
      ],
      'advanced': true,
      'creatorID': 'OomwNVi8vScVtr3h5dD7CHFkEj62',
      'lastEdited': 1494700239712,
      'meta': {
        'attempts': 18,
        'creatorID': 'OomwNVi8vScVtr3h5dD7CHFkEj62',
        'lastEdited': 1494700243423,
        'loc': 10,
        'username': 'danleavitt0'
      },
      'shortLink': 'VZW2E',
      'solution': [
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
          'sequence': "up()\nright()\nrepeat(1, () => {\n  ifColor('black', () => {\n    up()\n    paint()\n    down()\n  })\n  right()\n  up()\n})",
          'type': 'penguin'
        }
      ],
      'gameRef': '-Kjj74wHNVlVzGfB3vdf',
      'uid': 'OomwNVi8vScVtr3h5dD7CHFkEj62',
      'username': 'danleavitt0'
    },
    'pauseState': null,
    'startGrid': {
      '3,1': 'black'
    },
    'completed': false,
    'running': false,
    'hasRun': false,
    'paints': 1,
    'isDraft': false,
    'game': {
      'active': 0,
      'activeLine': 0,
      'advanced': true,
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
          'initial': {
            'dir': 0,
            'location': [
              4,
              0
            ],
            'rot': 0
          },
          'type': 'penguin'
        }
      ],
      'creatorID': 'OomwNVi8vScVtr3h5dD7CHFkEj62',
      'cursor': 0,
      'description': 'Use code to draw the image.',
      'initialPainted': 'const n = rand(1, 4)\n\nrepeat(n, () => {\n  up()\n  right()\n  paint()\n})',
      'inputType': 'code',
      'lastEdited': 1494633764753,
      'levelSize': [
        5,
        5
      ],
      'meta': {
        'animals': [
          'penguin'
        ],
        'creatorID': 'OomwNVi8vScVtr3h5dD7CHFkEj62',
        'inputType': 'code',
        'lastEdited': 1494633764753,
        'title': 'Untitled'
      },
      'shortLink': 'VZW2E',
      'solution': [
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
          'sequence': "up()\nright()\nrepeat(3, () => {\n  ifColor('black', () => {\n    up()\n    paint()\n    down()\n  })\n  right()\n  up()\n})",
          'type': 'penguin'
        }
      ],
      'speed': 1,
      'steps': 0,
      'title': 'Untitled',
      'type': 'write'
    },
    'gameActions': {},
    'savedGame': {
      'animals': [
        {
          'current': {
            'dir': 0,
            'location': [
              2,
              3
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
          'sequence': 'right()\nup()\nright()\npaint()\nright()\nup()\npaint()\nright()\nup()\npaint()\n',
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
      ],
      'creatorID': 'OomwNVi8vScVtr3h5dD7CHFkEj62',
      'gameRef': '-Kjj74wHNVlVzGfB3vdf',
      'lastEdited': 1494700239712,
      'meta': {
        'attempts': 18,
        'creatorID': 'OomwNVi8vScVtr3h5dD7CHFkEj62',
        'lastEdited': 1494700243423,
        'loc': 10,
        'username': 'danleavitt0'
      },
      'uid': 'OomwNVi8vScVtr3h5dD7CHFkEj62',
      'username': 'danleavitt0'
    },
    'saveRef': '-Kjyntze8CwFN8cclsRt'
  }
}
