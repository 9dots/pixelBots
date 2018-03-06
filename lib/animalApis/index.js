/**
 * Imports
 */

import createAction from '@f/create-action'
import palette from 'utils/palette'
import filter from '@f/filter-obj'
import range from '@f/range'
import map from '@f/map-obj'

/**
 * Images
 */

const animals = [
  'teacherBot',
  'crocodile',
  'chameleon',
  'penguin',
  'toucan',
  'panda'
]

const images = animals.reduce((acc, animal) => {
  acc[animal] = `/animalImages/${animal}.png`
  return acc
}, {})

const gameImages = animals.reduce((acc, animal) => {
  acc[animal] = `/animalImages/${animal}top.png`
  return acc
}, {})

/**
 * Actions
 */

const getCurrentColor = createAction('getCurrentColor', (...args) => args)
const animalPaint = createAction('animalPaint', (...args) => args)
const animalMove = createAction('animalMove', (...args) => args)
const animalTurn = createAction('animalTurn', (...args) => args)
const toggle = createAction('toggle', (...args) => args)
const paintT = createAction('paintT', (...args) => args)
const paintL = createAction('paintL', (...args) => args)
const paintJ = createAction('paintJ', (...args) => args)
const paintS = createAction('paintS', (...args) => args)
const paintZ = createAction('paintZ', (...args) => args)
const paintO = createAction('paintO', (...args) => args)
const paintI = createAction('paintI', (...args) => args)
const setLine = createAction('setActiveLine', (...args) => args)
const rand = createAction('createRand', (...args) => args)
const drawLoop = createAction('drawLoop', (...args) => args)
const frameOf = createAction('getModdedFrame', (...args) => args)
const setFrameRate = createAction('updateRunSpeed', (...args) => args)
const startDrawLoop = createAction('startDrawLoop', (...args) => args)
const endDrawLoop = createAction('endDrawLoop', (...args) => args)

function * checkColor (lineNum, color) {
  const a = yield getCurrentColor(lineNum)
  return a === color
}

function * ifColor (lineNum, color, fn) {
  if (yield checkColor(lineNum, color)) {
    yield * fn()
  }
}

function * repeatFn (lineNum, max, fn) {
  for (let i = 0; i < max; i++) {
    yield setLine(lineNum)
    yield * fn(i)
  }
}

function * drawFn (lineNum, fn) {
  yield startDrawLoop(lineNum)
  for (;;) {
    yield * fn()
    yield endDrawLoop(lineNum)
  }
}

function * callFn (lineNum, fn, ...args) {
  yield setLine(lineNum)
  return yield * fn(...args)
}

/**
 * Capabilities
 *
 * up/right/down/left - parameterless
 * up/right/down/left - with `steps` argument
 * paint - parameterless (black/white)
 * paint - with `color` argument
 * for loops
 * while loops
 * color conditionals
 * ??? conditionals
 * chess movements
 * toggle bot
 */

/**
 * Arg types
 *
 * number
 * string
 * variable
 */

const capabilities = {
  faceNorth: {
    type: 'move',
    description: 'Turn the pixelbot to face north.',
    snippet: 'faceNorth()'
  },
  up: {
    type: 'move',
    description: 'Move the pixelbot up <%= args[0] %> space.',
    snippet: 'up()',
    argsSnippet: 'up(1)',
    defaultArgs: [1],
    args: [
      {
        name: 'steps',
        type: 'number',
        default: 1,
        values: range(1, 10),
        description: 'The number of steps right to move the pixelbot.'
      }
    ]
  },
  left: {
    type: 'move',
    description: 'Move the pixelbot left <%= args[0] %> space.',
    snippet: 'left()',
    argsSnippet: 'left(1)',
    defaultArgs: [1],
    args: [
      {
        name: 'steps',
        type: 'number',
        default: 1,
        values: range(1, 10),
        description: 'The number of steps right to move the pixelbot.'
      }
    ]
  },
  right: {
    type: 'move',
    description: 'Move the pixelbot right <%= args[0] %> space.',
    snippet: 'right()',
    argsSnippet: 'right(1)',
    checkArgs: true,
    defaultArgs: [1],
    args: [
      {
        name: 'steps',
        type: 'number',
        default: 1,
        values: range(1, 10),
        description: 'The number of steps right to move the pixelbot.'
      }
    ]
  },
  down: {
    type: 'move',
    description: 'Move the pixelbot down <%= args[0] %> space.',
    snippet: 'down()',
    argsSnippet: 'down(1)',
    defaultArgs: [1],
    args: [
      {
        name: 'steps',
        type: 'number',
        default: 1,
        values: range(1, 10),
        description: 'The number of steps right to move the pixelbot.'
      }
    ]
  },
  paint: {
    type: 'paint',
    description:
      'Paint the square the pixelbot is currently on <%= args[0] %>.',
    snippet: 'paint()',
    argsSnippet: "paint('black')",
    defaultArgs: ['black'],
    args: [
      {
        name: 'color',
        type: 'string',
        default: {
          type: 'string',
          value: 'black'
        },
        values: palette,
        description: 'The color to paint.'
      }
    ]
  },
  toggle: {
    type: 'paint',
    description: 'Toggle between blue and yellow.',
    snippet: 'toggle()'
  },
  paintT: {
    type: 'paint',
    description: 'Paint a T tetris shape.',
    argsSnippet: "paintT('black')",
    snippet: 'paintT()',
    args: [
      {
        name: 'color',
        type: 'string',
        default: {
          type: 'string',
          value: 'black'
        },
        values: palette,
        description: 'The color to paint'
      }
    ]
  },
  paintL: {
    type: 'paint',
    description: 'Paint an L tetris shape.',
    argsSnippet: "paintL('black')",
    snippet: 'paintL()',
    args: [
      {
        name: 'color',
        type: 'string',
        default: {
          type: 'string',
          value: 'black'
        },
        values: palette,
        description: 'The color to paint'
      }
    ]
  },
  paintO: {
    type: 'paint',
    description: 'Paint an O shape.',
    argsSnippet: "paintO('black')",
    snippet: 'paintO()',
    args: [
      {
        name: 'color',
        type: 'string',
        default: {
          type: 'string',
          value: 'black'
        },
        values: palette,
        description: 'The color to paint'
      }
    ]
  },
  paintI: {
    type: 'paint',
    description: 'Paint an I shape.',
    argsSnippet: "paintI('black')",
    snippet: 'paintI()',
    args: [
      {
        name: 'color',
        type: 'string',
        default: {
          type: 'string',
          value: 'black'
        },
        values: palette,
        description: 'The color to paint'
      }
    ]
  },
  paintS: {
    type: 'paint',
    description: 'Paint an S shape.',
    argsSnippet: "paintS('black')",
    snippet: 'paintS()',
    args: [
      {
        name: 'color',
        type: 'string',
        default: {
          type: 'string',
          value: 'black'
        },
        values: palette,
        description: 'The color to paint'
      }
    ]
  },
  paintZ: {
    type: 'paint',
    description: 'Paint an Z shape.',
    argsSnippet: "paintZ('black')",
    snippet: 'paintZ()',
    args: [
      {
        name: 'color',
        type: 'string',
        default: {
          type: 'string',
          value: 'black'
        },
        values: palette,
        description: 'The color to paint'
      }
    ]
  },
  paintJ: {
    type: 'paint',
    description: 'Paint an J shape.',
    argsSnippet: "paintJ('black')",
    snippet: 'paintJ()',
    args: [
      {
        name: 'color',
        type: 'string',
        default: {
          type: 'string',
          value: 'black'
        },
        values: palette,
        description: 'The color to paint'
      }
    ]
  },
  lineBreak: {
    type: 'utility',
    usage: '\n',
    snippet: '',
    description: 'Add a line break.'
  },
  comment: {
    type: 'utility',
    usage: '// comment',
    snippet: '// write comment here',
    description: 'Add a comment.'
  },
  repeat: {
    type: 'control',
    description: 'Repeat the actions inside of the loop `num` times.',
    block: true,
    snippet: 'repeat(2, () => {\n\t\n})',
    wrapSnippet: 'repeat(2, () => {',
    args: [
      {
        name: 'num',
        type: 'number',
        default: 2,
        values: range(1, 10),
        description: 'The number of times to repeat the loop.'
      },
      {
        name: '() => {\n\t\n}',
        type: 'function',
        values: null,
        description: 'The function to be repeated'
      }
    ]
  },
  draw: {
    type: 'control',
    description:
      'Repeats actions inside of loop forever, and each draw is done in one step.',
    snippet: 'draw(() => {\n\t\n})',
    wrapSnippet: 'draw(() => {',
    args: [
      {
        name: '() => {\n\t\n}',
        type: 'function',
        values: null,
        description: 'The function to be drawn repeatedly'
      }
    ]
  },
  block_end: {
    type: null,
    description: 'end of a repeat block',
    hidden: true,
    unselectable: true
  },
  ifColor: {
    type: 'control',
    description: 'conditional block',
    snippet: "ifColor('black',() => {\n\t\n})",
    wrapSnippet: "ifColor('black',() => {",
    block: true,
    args: [
      {
        name: 'color',
        type: 'string',
        default: 'white',
        values: palette,
        description: 'The color to match'
      },
      {
        name: '() => {\n\t// code to execute\n\t// if the color matches\n}',
        type: 'function',
        values: null,
        description: 'The function to conditionally execute'
      }
    ]
  },
  frameOf: {
    type: 'control',
    snippet: 'frameOf()',
    description:
      'Given the number of frames, returns the current frame number.',
    args: [
      {
        name: 'frameCount',
        type: 'number',
        default: 0,
        description: 'max number of frames'
      }
    ]
  },
  setFrameRate: {
    type: 'control',
    description: 'Sets the current speed to the given number.',
    snippet: 'setFrameRate()',
    argsSnippet: 'setFrameRate(20)',
    defaultArgs: [20],
    args: [
      {
        name: 'frameRate',
        type: 'number',
        default: {
          type: 'number',
          value: 20
        },
        values: range(1, 100),
        description: 'speed animation should run at'
      }
    ]
  },
  turnRight: {
    type: 'move',
    description: 'Turn the pixelbot 90 degrees to the right.',
    snippet: 'turnRight()',
    args: [
      {
        name: 'turns',
        type: 'number',
        default: 1,
        values: range(1, 4),
        description: 'The number of turns right for the pixelbot to make.'
      }
    ]
  },
  turnLeft: {
    type: 'move',
    description: 'Turn the pixelbot 90 degrees to the left.',
    snippet: 'turnLeft()',
    args: [
      {
        name: 'turns',
        type: 'number',
        default: 1,
        values: range(1, 4),
        description: 'The number of turns left for the pixelbot to make.'
      }
    ]
  },
  forward: {
    type: 'move',
    description:
      'Move the pixelbot <%= args[0] %> space in the direction it is facing.',
    snippet: 'forward()',
    argsSnippet: 'forward(1)',
    defaultArgs: [1],
    args: [
      {
        name: 'steps',
        type: 'number',
        default: 1,
        values: range(1, 10),
        description: 'The number of steps forward to move the pixelbot.'
      }
    ]
  },
  moveTo: {
    type: 'move',
    description: 'Move the pixelbot to a specific coordinate (x, y).',
    snippet: 'moveTo(0,0)',
    defaultArgs: [0, 0],
    args: [
      {
        name: 'x',
        type: 'number',
        default: 0,
        values: range(0, 10),
        description: 'The x coordinate to move to.'
      },
      {
        name: 'y',
        type: 'number',
        default: 0,
        values: range(0, 10),
        description: 'The y coordinate to move to.'
      }
    ]
  },
  rand: {
    type: 'control',
    description: 'Generate a random number',
    snippet: 'rand(0, 1)',
    defaultArgs: [0, 1],
    args: [
      {
        name: 'min',
        type: 'number',
        default: 0,
        description: 'The minimum for the random number'
      },
      {
        name: 'max',
        type: 'number',
        default: 1
      }
    ]
  },
  createFunction: {
    type: 'functions',
    block: true,
    description: 'Create a new function',
    snippet: 'function functionName(){ \n\t\n}'
  },
  userFn: {
    hidden: true,
    block: true,
    type: 'functions'
  },
  callFn: {
    hidden: true
  },
  setLine: {
    hidden: true
  }
}

const hasAction = {
  repeat: repeatFn,
  draw: drawFn,
  ifColor: ifColor,
  callFn: callFn
}

const teacherBot = Object.keys(capabilities).reduce((acc, key) => {
  acc[key] = capabilities[key].args ? [true] : true
  return acc
}, {})

const functionColor = '#fb914d'
const typeColors = {
  move: 'green',
  control: '#e460bc', // '#bd1317', '#f6756c'
  paint: '#a563d8',
  functions: functionColor,
  userFn: functionColor
}

const arrowColors = {
  up: 'yellow',
  left: '#5cd8f7',
  down: '#a725ad',
  right: '#ca2a2d'
}

const typeOrder = [
  'move',
  'paint',
  'control',
  'comment' /* XXX deprecated only in here for old challenges */,
  'utility',
  'functions'
]

const capabilityOrder = [
  'up',
  'left',
  'right',
  'down',
  'forward',
  'moveTo',
  'turnRight',
  'turnLeft',
  'faceNorth',
  'paint',
  'toggle',
  'paintO',
  'paintI',
  'paintS',
  'paintZ',
  'paintL',
  'paintJ',
  'paintT',
  'repeat',
  'draw',
  'frameOf',
  'setFrameRate',
  'block_end',
  'ifColor',
  'rand',
  'comment',
  'lineBreak'
]

/**
 * Exports
 */

export default function (spec, id, palette) {
  return map(createActionFromSpec(id), createDocs(spec, palette))
}

function createArgumentsFromSpec (id, spec, name) {
  return (lineNum, ...args) => [
    lineNum,
    id,
    ...spec.args.map((aspec, i) => {
      if (
        aspec.name === 'color' &&
        aspec.values &&
        aspec.values.filter(arg => arg === args[i] || arg.name === args[i])
          .length === 0
      ) {
        return aspec.default
      }

      return args[i]
    })
  ]
}

function createActionFromSpec (id) {
  return (spec, key) => {
    if (hasAction[key]) {
      return hasAction[key]
    } else {
      return createAction(key, createArgumentsFromSpec(id, spec, key))
    }
  }
}

export function createDocs (traits, palette) {
  return map(
    (val, key) =>
      traits[key] === true || key === 'comment' || key === 'lineBreak'
        ? { ...val, args: [] }
        : {
          ...val,
          args: (val.args || []).map((arg, i) => ({
            ...arg,
            values:
                (traits[key][i] === true
                  ? arg.name === 'color' ? palette : arg.values || true
                  : traits[key][i]) || null
          }))
        },
    {
      ...filter((val, key) => traits[key], capabilities),
      comment: capabilities.comment,
      lineBreak: capabilities.lineBreak,
      setLine: capabilities.setLine,
      callFn: capabilities.callFn
    }
  )
}

export {
  typeOrder,
  typeColors,
  arrowColors,
  capabilityOrder,
  capabilities,
  gameImages,
  startDrawLoop,
  endDrawLoop,
  teacherBot,
  images
}
