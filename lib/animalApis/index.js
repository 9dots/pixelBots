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

delete gameImages['zebra']

/**
 * Actions
 */

const getCurrentColor = createAction('getCurrentColor', (...args) => args)
const animalPaint = createAction('animalPaint', (...args) => args)
const animalMove = createAction('animalMove', (...args) => args)
const animalTurn = createAction('animalTurn', (...args) => args)
const setLine = createAction('setActiveLine', (...args) => args)
const rand = createAction('createRand', (...args) => args)

function * checkColor (lineNum, color) {
  return (yield getCurrentColor(lineNum)) === color
}

function * ifColor (lineNum, color, fn) {
  if (yield checkColor(lineNum, color)) {
    yield fn()
  }
}

function * loopFn (lineNum, max, fn) {
  for (let i = 0; i < max; i++) {
    yield setLine(lineNum)
    yield * fn()
  }
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
  up: {
    usage: 'up(steps)',
    description: 'Move the pixelbot up `steps` space.',
    args: [{
      name: 'steps',
      type: 'number',
      default: 1,
      values: range(1, 10),
      description: 'The number of steps right to move the pixelbot.'
    }]
  },
  left: {
    usage: 'left(steps)',
    description: 'Move the pixelbot left `steps` space.',
    args: [{
      name: 'steps',
      type: 'number',
      default: 1,
      values: range(1, 10),
      description: 'The number of steps right to move the pixelbot.'
    }]
  },
  right: {
    usage: 'right(steps)',
    description: 'Move the pixelbot right `steps` space.',
    args: [{
      name: 'steps',
      type: 'number',
      default: 1,
      values: range(1, 10),
      description: 'The number of steps right to move the pixelbot.'
    }]
  },
  down: {
    usage: 'down(steps)',
    description: 'Move the pixelbot down `steps` space.',
    args: [{
      name: 'steps',
      type: 'number',
      default: 1,
      values: range(1, 10),
      description: 'The number of steps right to move the pixelbot.'
    }]
  },
  paint: {
    usage: 'paint(color)',
    description: 'Paint the square the toucan is currently on `color`.',
    args: [{
      name: 'color',
      type: 'string',
      default: 'black',
      values: palette,
      description: 'The color to paint.'
    }]
  },
  comment: {
    usage: '// comment',
    description: 'Add a comment.'
  },
  repeat: {
    usage: 'repeat(n, function(){\n\t// code to repeat\n})',
    description: 'Repeat the actions inside of the loop.',
    block: true,
    args: [{
      name: 'num',
      type: 'number',
      default: 2,
      values: range(1, 10),
      description: 'The number of times to repeat the loop.'
    },
    {
      name: 'fn',
      type: 'function',
      description: 'The function to be repeated'
    }]
  },
  block_end: {
    description: 'end of a repeat block',
    hidden: true,
    unselectable: true
  },
  ifColor: {
    usage: 'ifColor(color, function(){\n\t// code to execute\n\t// if the color matches\n})',
    description: 'conditional block',
    block: true,
    args: [
      {
        name: 'color',
        type: 'string',
        default: 'white',
        values: palette,
        description: 'The color to match'
      }
    ]
  },
  turnRight: {
    usage: 'turnRight()',
    description: 'Turn the pixelbot 90 degrees to the right.'
  },
  turnLeft: {
    usage: 'turnLeft()',
    description: 'Turn the pixelbot 90 degrees to the left.'
  },
  forward: {
    usage: 'forward()',
    description: 'Move the pixelbot one space in whichever direction it is facing.'
  },
  rand: {
    usage: 'rand(min, max)',
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
  }
}

const hasAction = {
  repeat: loopFn,
  ifColor: ifColor
}

const teacherBot = Object
  .keys(capabilities)
  .reduce((acc, key) => {
    acc[key] = capabilities[key].args
      ? capabilities[key].args.map(a => a.values)
      : true
    return acc
  }, {})


/**
 * Exports
 */

export default function (spec, id) {
  return map(
    (params, key) => hasAction[key]
      ? hasAction[key]
      : createAction(key, (lineNum, ...args) => [lineNum, id, ...args]),
    spec
  )
}

export function createDocs (traits) {
  return map(
    (val, key) => traits[key] === true
      ? {...val, args: []}
      : {
          ...val,
          args: (val.args || []).map((arg, i) => ({
            ...arg,
            values: traits[key][i] === true
              ? arg.values
              : traits[key][i]
          }))
        },
    filter((val, key) => traits[key], capabilities)
  )
}

export {
  capabilities,
  gameImages,
  teacherBot,
  images
}
