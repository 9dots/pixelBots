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
  'chameleon',
  'panda',
  'penguin',
  'crocodile',
  'teacherBot',
  'toucan'
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

function * callFn (lineNum, fn, ...args) {
  yield setLine(lineNum)
  yield * fn(...args)
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

const capabilities = {
  faceNorth: {
    type: 'move',
    description: 'Turn the pixelbot to face north.'
  },
  up: {
    type: 'move',
    description: 'Move the pixelbot up <%= args[0] %> space.',
    defaultArgs: [1],
    args: [{
      name: 'steps',
      type: 'number',
      default: 1,
      values: range(1, 10),
      description: 'The number of steps right to move the pixelbot.'
    }]
  },
  left: {
    type: 'move',
    description: 'Move the pixelbot left <%= args[0] %> space.',
    defaultArgs: [1],
    args: [{
      name: 'steps',
      type: 'number',
      default: 1,
      values: range(1, 10),
      description: 'The number of steps right to move the pixelbot.'
    }]
  },
  right: {
    type: 'move',
    description: 'Move the pixelbot right <%= args[0] %> space.',
    defaultArgs: [1],
    args: [{
      name: 'steps',
      type: 'number',
      default: 1,
      values: range(1, 10),
      description: 'The number of steps right to move the pixelbot.'
    }]
  },
  down: {
    type: 'move',
    description: 'Move the pixelbot down <%= args[0] %> space.',
    defaultArgs: [1],
    args: [{
      name: 'steps',
      type: 'number',
      default: 1,
      values: range(1, 10),
      description: 'The number of steps right to move the pixelbot.'
    }]
  },
  paint: {
    type: 'paint',
    description: 'Paint the square the pixelbot is currently on <%= args[0] %>.',
    defaultArgs: ['black'],
    args: [{
      name: 'color',
      type: 'string',
      default: 'black',
      values: palette,
      description: 'The color to paint.'
    }]
  },
  toggle: {
    type: 'paint',
    description: 'Toggle between blue and yellow.'
  },
  paintT: {
    type: 'paint',
    description: 'Paint a T tetris shape.',
    args: [{
      name: 'color',
      type: 'string',
      default: 'black',
      values: palette,
      description: 'The color to paint'
    }]
  },
  paintL: {
    type: 'paint',
    description: 'Paint an L tetris shape.',
    args: [{
      name: 'color',
      type: 'string',
      default: 'black',
      values: palette,
      description: 'The color to paint'
    }]
  },
  paintO: {
    type: 'paint',
    description: 'Paint an O shape.',
    args: [{
      name: 'color',
      type: 'string',
      default: 'black',
      values: palette,
      description: 'The color to paint'
    }]
  },
  paintI: {
    type: 'paint',
    description: 'Paint an I shape.',
    args: [{
      name: 'color',
      type: 'string',
      default: 'black',
      values: palette,
      description: 'The color to paint'
    }]
  },
  paintS: {
    type: 'paint',
    description: 'Paint an S shape.',
    args: [{
      name: 'color',
      type: 'string',
      default: 'black',
      values: palette,
      description: 'The color to paint'
    }]
  },
  paintZ: {
    type: 'paint',
    description: 'Paint an Z shape.',
    args: [{
      name: 'color',
      type: 'string',
      default: 'black',
      values: palette,
      description: 'The color to paint'
    }]
  },
  paintJ: {
    type: 'paint',
    description: 'Paint an J shape.',
    args: [{
      name: 'color',
      type: 'string',
      default: 'black',
      values: palette,
      description: 'The color to paint'
    }]
  },
  comment: {
    type: 'comment',
    usage: '// comment',
    description: 'Add a comment.'
  },
  repeat: {
    type: 'control',
    description: 'Repeat the actions inside of the loop `num` times.',
    block: true,
    args: [{
      name: 'num',
      type: 'number',
      default: 2,
      values: range(1, 10),
      description: 'The number of times to repeat the loop.'
    },
    {
      name: '() => {\n\t// code to repeat\n}',
      type: 'function',
      values: null,
      description: 'The function to be repeated'
    }]
  },
  block_end: {
    type: 'control',
    description: 'end of a repeat block',
    hidden: true,
    unselectable: true
  },
  ifColor: {
    type: 'control',
    description: 'conditional block',
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
        default: null,
        values: null,
        description: 'The function to conditionally execute'
      }
    ]
  },
  turnRight: {
    type: 'move',
    description: 'Turn the pixelbot 90 degrees to the right.',
    args: [{
      name: 'turns',
      type: 'number',
      default: 1,
      values: range(1, 4),
      description: 'The number of turns right for the pixelbot to make.'
    }]
  },
  turnLeft: {
    type: 'move',
    description: 'Turn the pixelbot 90 degrees to the left.',
    args: [{
      name: 'turns',
      type: 'number',
      default: 1,
      values: range(1, 4),
      description: 'The number of turns left for the pixelbot to make.'
    }]
  },
  forward: {
    type: 'move',
    description: 'Move the pixelbot <%= args[0] %> space in the direction it is facing.',
    defaultArgs: [1],
    args: [{
      name: 'steps',
      type: 'number',
      default: 1,
      values: range(1, 10),
      description: 'The number of steps forward to move the pixelbot.'
    }]
  },
  moveTo: {
    type: 'move',
    description: 'Move the pixelbot to a specific coordinate (x, y).',
    defaultArgs: [0, 0],
    args: [{
      name: 'x',
      type: 'number',
      default: 0,
      values: range(0, 19),
      description: 'The x coordinate to move to.'
    },
    {
      name: 'y',
      type: 'number',
      default: 0,
      values: range(0, 19),
      description: 'The y coordinate to move to.'
    }]
  },
  rand: {
    type: null,
    description: 'Generate a random number',
    args: [{
      name: 'min',
      type: 'number',
      default: 0,
      description: 'The minimum for the random number'
    },
    {
      name: 'max',
      type: 'number',
    }]
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
  ifColor: ifColor,
  callFn: callFn
}

const teacherBot = Object
  .keys(capabilities)
  .reduce((acc, key) => {
    acc[key] = capabilities[key].args
      ? [true]
      : true
    return acc
  }, {})

const typeColors = {
  move: 'green',
  control: '#bd1317',
  paint: 'blue'
}

const arrowColors = {
  down: '#ca2a2d',
  up: 'yellow',
  right: '#a725ad',
  left: '#5cd8f7'
}

const capabilityOrder = [
  'up',
  'left',
  'right',
  'down',
  'forward',
  'moveTo',
  'turnRight',
  'turnLeft',
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
  'block_end',
  'ifColor',
  'rand',
  'comment'
]

/**
 * Exports
 */

export default function (spec, id, palette) {
  return map(createActionFromSpec(id), createDocs(spec, palette))
}

function createArgumentsFromSpec (id, spec, name) {
  return (lineNum, ...args) => [lineNum, id, ...spec.args.map((aspec, i) => {
    if (aspec.name === 'color' && aspec.values && aspec.values.filter(arg => arg === args[i] || arg.name === args[i]).length === 0) {
      return aspec.default
    }

    return args[i]
  })]
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
    (val, key) => traits[key] === true || key === 'comment'
      ? {...val, args: []}
      : {
          ...val,
          args: (val.args || []).map((arg, i) => ({
            ...arg,
            values: (traits[key][i] === true
              ? arg.name === 'color' ? palette : (arg.values || true)
              : traits[key][i]) || null
          }))
        },
    {
      ...filter((val, key) => traits[key], capabilities),
      comment: capabilities.comment,
      setLine: capabilities.setLine,
      callFn: capabilities.callFn
    }
  )
}

export {
  typeColors,
  arrowColors,
  capabilityOrder,
  capabilities,
  gameImages,
  teacherBot,
  images
}
