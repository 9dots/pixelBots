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
    const startCode = getIterator(initialData.initialPainted, animalApis.teacherBot.default(1))
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
  type: 'write',
  runners: null,
  title: 'Writing Review 1.4',
  description: 'Use code to draw the image.',
  inputType: 'icons',
  levelSize: [
    5,
    5
  ],
  painted: {},
  selected: [],
  targetPainted: {
    '2,1': 'black',
    '2,2': 'black',
    '3,1': 'black',
    '3,2': 'black'
  },
  initialPainted: {},
  initialData: {
    type: 'write',
    runners: null,
    title: 'Writing Review 1.4',
    description: 'Use code to draw the image.',
    inputType: 'icons',
    levelSize: [
      5,
      5
    ],
    painted: {},
    selected: [],
    targetPainted: {
      '2,1': 'black',
      '2,2': 'black',
      '3,1': 'black',
      '3,2': 'black'
    },
    initialPainted: {},
    initialData: {},
    solution: null,
    editorState: [],
    activeLine: 0,
    cursor: 0,
    active: 0,
    steps: 0,
    speed: 1,
    frames: [],
    animals: [
      {
        current: {
          dir: 0,
          location: [
            2,
            2
          ],
          rot: 0
        },
        hidden: false,
        initial: {
          dir: 0,
          location: [
            2,
            2
          ],
          rot: 0
        },
        sequence: [
          {
            description: 'Paint the square the zebra is currently on black.',
            type: 'paint',
            usage: 'paint()'
          },
          {
            description: 'Move the zebra left one space.',
            payload: [
              1
            ],
            type: 'left',
            usage: 'left()'
          },
          {
            description: 'Paint the square the zebra is currently on black.',
            type: 'paint',
            usage: 'paint()'
          },
          {
            description: 'Move the zebra down one space.',
            payload: [
              1
            ],
            type: 'down',
            usage: 'down()'
          },
          {
            description: 'Paint the square the zebra is currently on black.',
            type: 'paint',
            usage: 'paint()'
          },
          {
            description: 'Move the zebra right one space.',
            payload: [
              1
            ],
            type: 'right',
            usage: 'right()'
          }
        ],
        type: 'zebra'
      },
      {
        current: {
          location: [
            4,
            0
          ],
          rot: 0
        },
        hidden: true,
        initial: {
          location: [
            4,
            0
          ],
          rot: 0
        },
        type: 'teacherBot'
      }
    ],
    completedBy: {
      OomwNVi8vScVtr3h5dD7CHFkEj62: true,
      yeIt9wAD5HOvDLATduyaA7ddSlF2: true
    },
    completions: 4,
    creatorID: 'OomwNVi8vScVtr3h5dD7CHFkEj62',
    lastEdited: 1495153702737,
    meta: {
      creatorID: 'OomwNVi8vScVtr3h5dD7CHFkEj62',
      lastEdited: 1495153703567,
      loc: 6,
      username: 'danleavitt0'
    },
    name: '',
    permissions: [
      'Run Button',
      'Edit Code'
    ],
    shortLink: 'JD22Y',
    gameRef: '-KczEJM1qsXIMQWC4U-y',
    uid: 'OomwNVi8vScVtr3h5dD7CHFkEj62',
    username: 'danleavitt0',
    solutionIterator: null,
    ready: true
  },
  solution: null,
  editorState: [],
  activeLine: 0,
  cursor: 0,
  active: 0,
  steps: 0,
  speed: 1,
  frames: [],
  animals: [
    {
      current: {
        dir: 0,
        location: [
          2,
          2
        ],
        rot: 0
      },
      hidden: false,
      initial: {
        dir: 0,
        location: [
          2,
          2
        ],
        rot: 0
      },
      sequence: [
        {
          usage: 'left()',
          description: 'Move the zebra left one space.',
          type: 'left',
          payload: [
            1
          ]
        },
        {
          description: 'Paint the square the zebra is currently on black.',
          type: 'paint',
          usage: 'paint()'
        },
        {
          description: 'Move the zebra left one space.',
          payload: [
            1
          ],
          type: 'left',
          usage: 'left()'
        },
        {
          description: 'Paint the square the zebra is currently on black.',
          type: 'paint',
          usage: 'paint()'
        },
        {
          description: 'Move the zebra down one space.',
          payload: [
            1
          ],
          type: 'down',
          usage: 'down()'
        },
        {
          description: 'Paint the square the zebra is currently on black.',
          type: 'paint',
          usage: 'paint()'
        },
        {
          description: 'Move the zebra right one space.',
          payload: [
            1
          ],
          type: 'right',
          usage: 'right()'
        }
      ],
      type: 'zebra'
    },
    {
      current: {
        location: [
          4,
          0
        ],
        rot: 0
      },
      hidden: true,
      initial: {
        location: [
          4,
          0
        ],
        rot: 0
      },
      type: 'teacherBot'
    }
  ]
}
}
