const {
  createFrames,
  getLastFrame,
  getIterator
} = require('../utils/frameReducer/frameReducer')
const animalApis = require('../utils/animalApis/index')
const checkCorrect = require('../utils/checkCorrect')
const objEqual = require('@f/equal-obj')
const srand = require('@f/srand')
const map = require('@f/map')

const createApi = animalApis.default
const teacherBot = animalApis.teacherBot

const props = getProps()
// const {active, animals, solution, initialData, targetPainted} = props
// const userCode = getIterator(animals[active].sequence, animalApis[animals[active].type].default(active))

// createPaintFrames(props, userCode)
console.time('check')
// console.log('teacherBot', teacherBot)
const {
  active,
  advanced,
  animals,
  solution,
  initialData,
  targetPainted,
  capabilities,
  palette
} = props
const userApi = createApi(capabilities, active, palette)
const userCode = getIterator('test', userApi)
const base = Object.assign({}, props, { painted: {} })

// if (!advanced) {
//   const painted = initialData.initialPainted || {}
//   const answer = getLastFrame(Object.assign({}, base, {painted}), userCode)
//     // console.log(answer)
//   const seed = [{painted, userSolution: answer}]
//   if (checkCorrect(answer, targetPainted)) {
//     console.log({status: 'success', correctSeeds: seed})
//   }
//   console.log({status: 'failed', failedSeeds: seed})
if (advanced) {
  const startCode = getIterator(
    initialData.initialPainted,
    createApi(teacherBot, 0)
  )
  const solutionIterator = getIterator(solution[0].sequence, userApi)
  const uniquePaints = []
  const failedSeeds = []
  const correctSeeds = []
  for (let i = 0; i < 100; i++) {
    const painted = createPainted(
      Object.assign({}, base, {
        startGrid: {},
        animals: animals
          .filter(a => a.type === 'teacherBot')
          .map(a => Object.assign({}, a, { current: a.initial })),
        rand: srand(i)
      }),
      startCode
    )
    if (uniquePaints.every(paint => !objEqual(paint, painted))) {
      uniquePaints.push(painted)
      const answer = getLastFrame(
        Object.assign({}, base, { painted }),
        userCode
      )
      const solutionState = Object.assign({}, props, { startGrid: painted })
      if (
        !checkCorrect(answer, generateSolution(solutionState, solutionIterator))
      ) {
        failedSeeds.push({ painted, userSolution: answer, seed: i })
      } else {
        correctSeeds.push({ painted, userSolution: answer, seed: i })
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
    const painted = map(
      val => (val === 'toggle' ? (rand(2, 0) > 1 ? 'blue' : 'yellow') : val),
      initialData.initialPainted || {}
    )
    if (uniquePaints.every(paint => !objEqual(paint, painted))) {
      uniquePaints.push(painted)
      const [answer, steps] = getLastFrame(
        Object.assign({}, base, { painted }),
        userCode
      )
      console.log('answer', answer, 'targetPainted', targetPainted)
      if (!checkCorrect(answer, targetPainted)) {
        failedSeeds.push({ painted, userSolution: answer, seed: i })
      } else {
        correctSeeds.push({ painted, userSolution: answer, seed: i, steps })
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

function generateSolution (
  { initialPainted, solution, levelSize, active, startGrid },
  code
) {
  return createFrames(
    {
      active: 0,
      painted: startGrid,
      animals: solution.map(animal =>
        Object.assign({}, animal, { current: animal.initial })
      )
    },
    code
  ).pop().painted
}

function getProps () {
  return {
    type: 'write',
    runners: {},
    title: 'Untitled',
    description: 'Use code to draw the image.',
    inputType: 'icons',
    levelSize: [2, 2],
    painted: {},
    selected: {},
    targetPainted: {
      '1,0': 'yellow'
    },
    initialPainted: {
      '1,0': 'toggle'
    },
    initialData: {
      type: 'write',
      runners: null,
      title: 'Untitled',
      description: 'Use code to draw the image.',
      inputType: 'icons',
      levelSize: [2, 2],
      painted: false,
      selected: {},
      targetPainted: {
        '1,0': 'toggle'
      },
      initialPainted: {
        '1,0': 'toggle'
      },
      initialData: {},
      saveRef: null,
      solution: [
        {
          current: {
            dir: 0,
            location: [0, 0],
            rot: 0
          },
          hidden: false,
          initial: {
            dir: 0,
            location: [1, 0],
            rot: 0
          },
          sequence: [
            {
              args: [
                {
                  default: 'white',
                  description: 'The color to match',
                  name: 'color',
                  type: 'string',
                  values: [
                    {
                      name: 'pink',
                      value: '#e91e63'
                    },
                    {
                      name: 'purple',
                      value: '#9c27b0'
                    },
                    {
                      name: 'deepPurple',
                      value: '#673ab7'
                    },
                    {
                      name: 'indigo',
                      value: '#3f51b5'
                    },
                    {
                      name: 'blue',
                      value: '#2196f3'
                    },
                    {
                      name: 'lightBlue',
                      value: '#03a9f4'
                    },
                    {
                      name: 'cyan',
                      value: '#00bcd4'
                    },
                    {
                      name: 'teal',
                      value: '#009688'
                    },
                    {
                      name: 'green',
                      value: '#4caf50'
                    },
                    {
                      name: 'lightGreen',
                      value: '#8bc34a'
                    },
                    {
                      name: 'lime',
                      value: '#cddc39'
                    },
                    {
                      name: 'yellow',
                      value: '#ffeb3b'
                    },
                    {
                      name: 'amber',
                      value: '#ffc107'
                    },
                    {
                      name: 'orange',
                      value: '#ff9800'
                    },
                    {
                      name: 'deepOrange',
                      value: '#ff5722'
                    },
                    {
                      name: 'brown',
                      value: '#795548'
                    },
                    {
                      name: 'grey',
                      value: '#9e9e9e'
                    },
                    {
                      name: 'blueGrey',
                      value: '#607d8b'
                    },
                    {
                      name: 'black',
                      value: '#000000'
                    },
                    {
                      name: 'white',
                      value: '#FFFFFF'
                    }
                  ]
                },
                {
                  description: 'The function to conditionally execute',
                  name: '() => { // code to execute // if the color matches }',
                  type: 'function'
                }
              ],
              block: true,
              description: 'conditional block',
              id: '1502824240554.11',
              payload: ['blue'],
              type: 'ifColor'
            },
            {
              description: 'Toggle between blue and yellow.',
              id: '1502824245433.12',
              type: 'toggle'
            },
            {
              type: 'block_end'
            },
            {
              defaultArgs: [1],
              description:
                'Move the pixelbot <%= args[0] %> space in the direction it is facing.',
              id: '1502824256400.15',
              type: 'forward'
            },
            {
              args: [
                {
                  default: 'white',
                  description: 'The color to match',
                  name: 'color',
                  type: 'string',
                  values: [
                    {
                      name: 'pink',
                      value: '#e91e63'
                    },
                    {
                      name: 'purple',
                      value: '#9c27b0'
                    },
                    {
                      name: 'deepPurple',
                      value: '#673ab7'
                    },
                    {
                      name: 'indigo',
                      value: '#3f51b5'
                    },
                    {
                      name: 'blue',
                      value: '#2196f3'
                    },
                    {
                      name: 'lightBlue',
                      value: '#03a9f4'
                    },
                    {
                      name: 'cyan',
                      value: '#00bcd4'
                    },
                    {
                      name: 'teal',
                      value: '#009688'
                    },
                    {
                      name: 'green',
                      value: '#4caf50'
                    },
                    {
                      name: 'lightGreen',
                      value: '#8bc34a'
                    },
                    {
                      name: 'lime',
                      value: '#cddc39'
                    },
                    {
                      name: 'yellow',
                      value: '#ffeb3b'
                    },
                    {
                      name: 'amber',
                      value: '#ffc107'
                    },
                    {
                      name: 'orange',
                      value: '#ff9800'
                    },
                    {
                      name: 'deepOrange',
                      value: '#ff5722'
                    },
                    {
                      name: 'brown',
                      value: '#795548'
                    },
                    {
                      name: 'grey',
                      value: '#9e9e9e'
                    },
                    {
                      name: 'blueGrey',
                      value: '#607d8b'
                    },
                    {
                      name: 'black',
                      value: '#000000'
                    },
                    {
                      name: 'white',
                      value: '#FFFFFF'
                    }
                  ]
                },
                {
                  description: 'The function to conditionally execute',
                  name: '() => { // code to execute // if the color matches }',
                  type: 'function'
                }
              ],
              block: true,
              description: 'conditional block',
              id: '1502824250544.13',
              payload: ['blue'],
              type: 'ifColor'
            },
            {
              description: 'Toggle between blue and yellow.',
              id: '1502824254384.14',
              type: 'toggle'
            },
            {
              type: 'block_end'
            }
          ],
          type: 'penguin'
        }
      ],
      solutionSteps: null,
      imageUrl: '/animalImages/teacherBot.png',
      editorState: {},
      activeLine: 0,
      cursor: 0,
      active: 0,
      advanced: false,
      steps: 0,
      speed: 1,
      frames: {},
      palette: [
        {
          name: 'pink',
          value: '#e91e63'
        },
        {
          name: 'purple',
          value: '#9c27b0'
        },
        {
          name: 'deepPurple',
          value: '#673ab7'
        },
        {
          name: 'indigo',
          value: '#3f51b5'
        },
        {
          name: 'blue',
          value: '#2196f3'
        },
        {
          name: 'lightBlue',
          value: '#03a9f4'
        },
        {
          name: 'cyan',
          value: '#00bcd4'
        },
        {
          name: 'teal',
          value: '#009688'
        },
        {
          name: 'green',
          value: '#4caf50'
        },
        {
          name: 'lightGreen',
          value: '#8bc34a'
        },
        {
          name: 'lime',
          value: '#cddc39'
        },
        {
          name: 'yellow',
          value: '#ffeb3b'
        },
        {
          name: 'amber',
          value: '#ffc107'
        },
        {
          name: 'orange',
          value: '#ff9800'
        },
        {
          name: 'deepOrange',
          value: '#ff5722'
        },
        {
          name: 'brown',
          value: '#795548'
        },
        {
          name: 'grey',
          value: '#9e9e9e'
        },
        {
          name: 'blueGrey',
          value: '#607d8b'
        },
        {
          name: 'black',
          value: '#000000'
        },
        {
          name: 'white',
          value: '#FFFFFF'
        }
      ],
      capabilities: {
        block_end: true,
        forward: true,
        ifColor: [true],
        loop: true,
        repeat: [true],
        stop: true,
        toggle: true,
        turnLeft: true,
        turnRight: true
      },
      animals: [
        {
          current: {
            dir: 0,
            location: [1, 0],
            rot: 0
          },
          hidden: true,
          initial: {
            dir: 0,
            location: [1, 0],
            rot: 0
          },
          sequence: [
            {
              args: [
                {
                  default: 'white',
                  description: 'The color to match',
                  name: 'color',
                  type: 'string',
                  values: [
                    {
                      name: 'pink',
                      value: '#e91e63'
                    },
                    {
                      name: 'purple',
                      value: '#9c27b0'
                    },
                    {
                      name: 'deepPurple',
                      value: '#673ab7'
                    },
                    {
                      name: 'indigo',
                      value: '#3f51b5'
                    },
                    {
                      name: 'blue',
                      value: '#2196f3'
                    },
                    {
                      name: 'lightBlue',
                      value: '#03a9f4'
                    },
                    {
                      name: 'cyan',
                      value: '#00bcd4'
                    },
                    {
                      name: 'teal',
                      value: '#009688'
                    },
                    {
                      name: 'green',
                      value: '#4caf50'
                    },
                    {
                      name: 'lightGreen',
                      value: '#8bc34a'
                    },
                    {
                      name: 'lime',
                      value: '#cddc39'
                    },
                    {
                      name: 'yellow',
                      value: '#ffeb3b'
                    },
                    {
                      name: 'amber',
                      value: '#ffc107'
                    },
                    {
                      name: 'orange',
                      value: '#ff9800'
                    },
                    {
                      name: 'deepOrange',
                      value: '#ff5722'
                    },
                    {
                      name: 'brown',
                      value: '#795548'
                    },
                    {
                      name: 'grey',
                      value: '#9e9e9e'
                    },
                    {
                      name: 'blueGrey',
                      value: '#607d8b'
                    },
                    {
                      name: 'black',
                      value: '#000000'
                    },
                    {
                      name: 'white',
                      value: '#FFFFFF'
                    }
                  ]
                },
                {
                  description: 'The function to conditionally execute',
                  name: '() => { // code to execute // if the color matches }',
                  type: 'function'
                }
              ],
              block: true,
              description: 'conditional block',
              id: '1502824293568.16',
              payload: ['blue'],
              type: 'ifColor'
            },
            {
              description: 'Toggle between blue and yellow.',
              id: '1502824297139.17',
              type: 'toggle'
            },
            {
              type: 'block_end'
            },
            {
              defaultArgs: [1],
              description:
                'Move the pixelbot <%= args[0] %> space in the direction it is facing.',
              id: '1502824298609.18',
              type: 'forward'
            },
            {
              args: [
                {
                  default: 'white',
                  description: 'The color to match',
                  name: 'color',
                  type: 'string',
                  values: [
                    {
                      name: 'pink',
                      value: '#e91e63'
                    },
                    {
                      name: 'purple',
                      value: '#9c27b0'
                    },
                    {
                      name: 'deepPurple',
                      value: '#673ab7'
                    },
                    {
                      name: 'indigo',
                      value: '#3f51b5'
                    },
                    {
                      name: 'blue',
                      value: '#2196f3'
                    },
                    {
                      name: 'lightBlue',
                      value: '#03a9f4'
                    },
                    {
                      name: 'cyan',
                      value: '#00bcd4'
                    },
                    {
                      name: 'teal',
                      value: '#009688'
                    },
                    {
                      name: 'green',
                      value: '#4caf50'
                    },
                    {
                      name: 'lightGreen',
                      value: '#8bc34a'
                    },
                    {
                      name: 'lime',
                      value: '#cddc39'
                    },
                    {
                      name: 'yellow',
                      value: '#ffeb3b'
                    },
                    {
                      name: 'amber',
                      value: '#ffc107'
                    },
                    {
                      name: 'orange',
                      value: '#ff9800'
                    },
                    {
                      name: 'deepOrange',
                      value: '#ff5722'
                    },
                    {
                      name: 'brown',
                      value: '#795548'
                    },
                    {
                      name: 'grey',
                      value: '#9e9e9e'
                    },
                    {
                      name: 'blueGrey',
                      value: '#607d8b'
                    },
                    {
                      name: 'black',
                      value: '#000000'
                    },
                    {
                      name: 'white',
                      value: '#FFFFFF'
                    }
                  ]
                },
                {
                  description: 'The function to conditionally execute',
                  name: '() => { // code to execute // if the color matches }',
                  type: 'function'
                }
              ],
              block: true,
              description: 'conditional block',
              id: '1502824300089.19',
              payload: ['blue'],
              type: 'ifColor'
            },
            {
              description: 'Toggle between blue and yellow.',
              id: '1502824303168.20',
              type: 'toggle'
            },
            {
              type: 'block_end'
            }
          ],
          type: 'penguin'
        },
        {
          current: {
            location: [1, 0],
            rot: 0
          },
          hidden: false,
          initial: {
            location: [1, 0],
            rot: 0
          },
          type: 'teacherBot'
        }
      ],
      creatorID: 'b1V2uAmlCieLOdP749PkdhGxfUw2',
      imageVersion: 14,
      lastEdited: 1502824493370,
      meta: {
        loc: 5,
        modifications: 7,
        runs: 1,
        timeElapsed: 20771
      },
      shortLink: 'NYNEE',
      stretch: {
        hard: true,
        indicator: 'lloc',
        label: 'Lines',
        type: 'lineLimit',
        value: '5'
      },
      gameRef: '-KotVq74aB2d3nSTpD1K',
      uid: 'b1V2uAmlCieLOdP749PkdhGxfUw2',
      loc: 5,
      modifications: 7,
      runs: 1,
      timeElapsed: 20771,
      lloc: 5,
      ready: true
    },
    saveRef: '-KoOgujOSXAKs_BV-J0814',
    solution: [
      {
        current: {
          dir: 0,
          location: [0, 0],
          rot: 0
        },
        hidden: false,
        initial: {
          dir: 0,
          location: [1, 0],
          rot: 0
        },
        sequence: [
          {
            args: [
              {
                default: 'white',
                description: 'The color to match',
                name: 'color',
                type: 'string',
                values: [
                  {
                    name: 'pink',
                    value: '#e91e63'
                  },
                  {
                    name: 'purple',
                    value: '#9c27b0'
                  },
                  {
                    name: 'deepPurple',
                    value: '#673ab7'
                  },
                  {
                    name: 'indigo',
                    value: '#3f51b5'
                  },
                  {
                    name: 'blue',
                    value: '#2196f3'
                  },
                  {
                    name: 'lightBlue',
                    value: '#03a9f4'
                  },
                  {
                    name: 'cyan',
                    value: '#00bcd4'
                  },
                  {
                    name: 'teal',
                    value: '#009688'
                  },
                  {
                    name: 'green',
                    value: '#4caf50'
                  },
                  {
                    name: 'lightGreen',
                    value: '#8bc34a'
                  },
                  {
                    name: 'lime',
                    value: '#cddc39'
                  },
                  {
                    name: 'yellow',
                    value: '#ffeb3b'
                  },
                  {
                    name: 'amber',
                    value: '#ffc107'
                  },
                  {
                    name: 'orange',
                    value: '#ff9800'
                  },
                  {
                    name: 'deepOrange',
                    value: '#ff5722'
                  },
                  {
                    name: 'brown',
                    value: '#795548'
                  },
                  {
                    name: 'grey',
                    value: '#9e9e9e'
                  },
                  {
                    name: 'blueGrey',
                    value: '#607d8b'
                  },
                  {
                    name: 'black',
                    value: '#000000'
                  },
                  {
                    name: 'white',
                    value: '#FFFFFF'
                  }
                ]
              },
              {
                description: 'The function to conditionally execute',
                name: '() => { // code to execute // if the color matches }',
                type: 'function'
              }
            ],
            block: true,
            description: 'conditional block',
            id: '1502824240554.11',
            payload: ['blue'],
            type: 'ifColor'
          },
          {
            description: 'Toggle between blue and yellow.',
            id: '1502824245433.12',
            type: 'toggle'
          },
          {
            type: 'block_end'
          },
          {
            defaultArgs: [1],
            description:
              'Move the pixelbot <%= args[0] %> space in the direction it is facing.',
            id: '1502824256400.15',
            type: 'forward'
          },
          {
            args: [
              {
                default: 'white',
                description: 'The color to match',
                name: 'color',
                type: 'string',
                values: [
                  {
                    name: 'pink',
                    value: '#e91e63'
                  },
                  {
                    name: 'purple',
                    value: '#9c27b0'
                  },
                  {
                    name: 'deepPurple',
                    value: '#673ab7'
                  },
                  {
                    name: 'indigo',
                    value: '#3f51b5'
                  },
                  {
                    name: 'blue',
                    value: '#2196f3'
                  },
                  {
                    name: 'lightBlue',
                    value: '#03a9f4'
                  },
                  {
                    name: 'cyan',
                    value: '#00bcd4'
                  },
                  {
                    name: 'teal',
                    value: '#009688'
                  },
                  {
                    name: 'green',
                    value: '#4caf50'
                  },
                  {
                    name: 'lightGreen',
                    value: '#8bc34a'
                  },
                  {
                    name: 'lime',
                    value: '#cddc39'
                  },
                  {
                    name: 'yellow',
                    value: '#ffeb3b'
                  },
                  {
                    name: 'amber',
                    value: '#ffc107'
                  },
                  {
                    name: 'orange',
                    value: '#ff9800'
                  },
                  {
                    name: 'deepOrange',
                    value: '#ff5722'
                  },
                  {
                    name: 'brown',
                    value: '#795548'
                  },
                  {
                    name: 'grey',
                    value: '#9e9e9e'
                  },
                  {
                    name: 'blueGrey',
                    value: '#607d8b'
                  },
                  {
                    name: 'black',
                    value: '#000000'
                  },
                  {
                    name: 'white',
                    value: '#FFFFFF'
                  }
                ]
              },
              {
                description: 'The function to conditionally execute',
                name: '() => { // code to execute // if the color matches }',
                type: 'function'
              }
            ],
            block: true,
            description: 'conditional block',
            id: '1502824250544.13',
            payload: ['blue'],
            type: 'ifColor'
          },
          {
            description: 'Toggle between blue and yellow.',
            id: '1502824254384.14',
            type: 'toggle'
          },
          {
            type: 'block_end'
          }
        ],
        type: 'penguin'
      }
    ],
    solutionSteps: null,
    imageUrl: '/animalImages/teacherBot.png',
    editorState: {},
    activeLine: -1,
    cursor: 0,
    active: 0,
    advanced: false,
    steps: 3,
    speed: 1,
    frames: {},
    palette: [
      {
        name: 'pink',
        value: '#e91e63'
      },
      {
        name: 'purple',
        value: '#9c27b0'
      },
      {
        name: 'deepPurple',
        value: '#673ab7'
      },
      {
        name: 'indigo',
        value: '#3f51b5'
      },
      {
        name: 'blue',
        value: '#2196f3'
      },
      {
        name: 'lightBlue',
        value: '#03a9f4'
      },
      {
        name: 'cyan',
        value: '#00bcd4'
      },
      {
        name: 'teal',
        value: '#009688'
      },
      {
        name: 'green',
        value: '#4caf50'
      },
      {
        name: 'lightGreen',
        value: '#8bc34a'
      },
      {
        name: 'lime',
        value: '#cddc39'
      },
      {
        name: 'yellow',
        value: '#ffeb3b'
      },
      {
        name: 'amber',
        value: '#ffc107'
      },
      {
        name: 'orange',
        value: '#ff9800'
      },
      {
        name: 'deepOrange',
        value: '#ff5722'
      },
      {
        name: 'brown',
        value: '#795548'
      },
      {
        name: 'grey',
        value: '#9e9e9e'
      },
      {
        name: 'blueGrey',
        value: '#607d8b'
      },
      {
        name: 'black',
        value: '#000000'
      },
      {
        name: 'white',
        value: '#FFFFFF'
      }
    ],
    capabilities: {
      block_end: true,
      forward: true,
      ifColor: [true],
      loop: true,
      repeat: [true],
      stop: true,
      toggle: true,
      turnLeft: true,
      turnRight: true
    },
    animals: [
      {
        current: {
          dir: 0,
          location: [1, 0],
          rot: 0
        },
        hidden: false,
        initial: {
          dir: 0,
          location: [1, 0],
          rot: 0
        },
        sequence: [
          {
            args: [
              {
                default: 'white',
                description: 'The color to match',
                name: 'color',
                type: 'string',
                values: [
                  {
                    name: 'pink',
                    value: '#e91e63'
                  },
                  {
                    name: 'purple',
                    value: '#9c27b0'
                  },
                  {
                    name: 'deepPurple',
                    value: '#673ab7'
                  },
                  {
                    name: 'indigo',
                    value: '#3f51b5'
                  },
                  {
                    name: 'blue',
                    value: '#2196f3'
                  },
                  {
                    name: 'lightBlue',
                    value: '#03a9f4'
                  },
                  {
                    name: 'cyan',
                    value: '#00bcd4'
                  },
                  {
                    name: 'teal',
                    value: '#009688'
                  },
                  {
                    name: 'green',
                    value: '#4caf50'
                  },
                  {
                    name: 'lightGreen',
                    value: '#8bc34a'
                  },
                  {
                    name: 'lime',
                    value: '#cddc39'
                  },
                  {
                    name: 'yellow',
                    value: '#ffeb3b'
                  },
                  {
                    name: 'amber',
                    value: '#ffc107'
                  },
                  {
                    name: 'orange',
                    value: '#ff9800'
                  },
                  {
                    name: 'deepOrange',
                    value: '#ff5722'
                  },
                  {
                    name: 'brown',
                    value: '#795548'
                  },
                  {
                    name: 'grey',
                    value: '#9e9e9e'
                  },
                  {
                    name: 'blueGrey',
                    value: '#607d8b'
                  },
                  {
                    name: 'black',
                    value: '#000000'
                  },
                  {
                    name: 'white',
                    value: '#FFFFFF'
                  }
                ]
              },
              {
                description: 'The function to conditionally execute',
                name: '() => { // code to execute // if the color matches }',
                type: 'function'
              }
            ],
            block: true,
            description: 'conditional block',
            id: '1502824293568.16',
            payload: ['blue'],
            type: 'ifColor'
          },
          {
            description: 'Toggle between blue and yellow.',
            id: '1502824297139.17',
            type: 'toggle'
          },
          {
            type: 'block_end'
          },
          {
            defaultArgs: [1],
            description:
              'Move the pixelbot <%= args[0] %> space in the direction it is facing.',
            id: '1502824298609.18',
            type: 'forward'
          },
          {
            args: [
              {
                default: 'white',
                description: 'The color to match',
                name: 'color',
                type: 'string',
                values: [
                  {
                    name: 'pink',
                    value: '#e91e63'
                  },
                  {
                    name: 'purple',
                    value: '#9c27b0'
                  },
                  {
                    name: 'deepPurple',
                    value: '#673ab7'
                  },
                  {
                    name: 'indigo',
                    value: '#3f51b5'
                  },
                  {
                    name: 'blue',
                    value: '#2196f3'
                  },
                  {
                    name: 'lightBlue',
                    value: '#03a9f4'
                  },
                  {
                    name: 'cyan',
                    value: '#00bcd4'
                  },
                  {
                    name: 'teal',
                    value: '#009688'
                  },
                  {
                    name: 'green',
                    value: '#4caf50'
                  },
                  {
                    name: 'lightGreen',
                    value: '#8bc34a'
                  },
                  {
                    name: 'lime',
                    value: '#cddc39'
                  },
                  {
                    name: 'yellow',
                    value: '#ffeb3b'
                  },
                  {
                    name: 'amber',
                    value: '#ffc107'
                  },
                  {
                    name: 'orange',
                    value: '#ff9800'
                  },
                  {
                    name: 'deepOrange',
                    value: '#ff5722'
                  },
                  {
                    name: 'brown',
                    value: '#795548'
                  },
                  {
                    name: 'grey',
                    value: '#9e9e9e'
                  },
                  {
                    name: 'blueGrey',
                    value: '#607d8b'
                  },
                  {
                    name: 'black',
                    value: '#000000'
                  },
                  {
                    name: 'white',
                    value: '#FFFFFF'
                  }
                ]
              },
              {
                description: 'The function to conditionally execute',
                name: '() => { // code to execute // if the color matches }',
                type: 'function'
              }
            ],
            block: true,
            description: 'conditional block',
            id: '1502824300089.19',
            payload: ['blue'],
            type: 'ifColor'
          },
          {
            description: 'Toggle between blue and yellow.',
            id: '1502824303168.20',
            type: 'toggle'
          },
          {
            type: 'block_end'
          }
        ],
        type: 'penguin'
      },
      {
        current: {
          location: [1, 0],
          rot: 0
        },
        hidden: true,
        initial: {
          location: [1, 0],
          rot: 0
        },
        type: 'teacherBot'
      }
    ]
  }
}
