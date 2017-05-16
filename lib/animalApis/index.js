import * as turtle from './turtle'
import * as zebra from './zebra'
import * as panda from './panda'
import * as toucan from './toucan'
import * as crocodile from './crocodile'
import * as chameleon from './chameleon'
import * as penguin from './penguin'
import * as teacherBot from './teacherBot'

import palette from 'utils/palette'
import filter from '@f/filter-obj'
import range from '@f/range'
import map from '@f/map-obj'

const animals = [
  'chameleon',
  'turtle',
  'zebra',
  'panda',
  'penguin',
  'crocodile',
  'teacherBot',
  'toucan'
]

const images = animals.reduce((acc, animal) => {
  acc[animal] = `/animalImages/${animal}.jpg`
  return acc
}, {})

// export default {
//   turtle,
//   zebra,
//   panda,
//   chameleon,
//   toucan,
//   crocodile,
//   penguin,
//   teacherBot
// }


// function wrap (id, api) {
//   const up = (lineNum, steps = 1) => move(0, steps, lineNum)
//   const right = (lineNum, steps = 1) => move(1, steps, lineNum)
//   const down = (lineNum, steps = 1) => move(2, steps, lineNum)
//   const left = (lineNum, steps = 1) => move(3, steps, lineNum)
//   const paint = lineNum => animalPaint(id, 'black', lineNum)



//   return {
//     up,
//     right,
//     down,
//     left,
//     paint
//   }
// }

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
    description: 'Move the panda up `steps` space.',
    args: [{
      name: 'steps',
      type: 'number',
      default: 1,
      values: range(1, 10),
      description: 'The number of steps right to move the panda.'
    }]
  },
  left: {
    usage: 'left(steps)',
    description: 'Move the panda left `steps` space.',
    args: [{
      name: 'steps',
      type: 'number',
      default: 1,
      values: range(1, 10),
      description: 'The number of steps right to move the panda.'
    }]
  },
  right: {
    usage: 'right(steps)',
    description: 'Move the panda right `steps` space.',
    args: [{
      name: 'steps',
      type: 'number',
      default: 1,
      values: range(1, 10),
      description: 'The number of steps right to move the panda.'
    }]
  },
  down: {
    usage: 'down(steps)',
    description: 'Move the panda down `steps` space.',
    args: [{
      name: 'steps',
      type: 'number',
      default: 1,
      values: range(1, 10),
      description: 'The number of steps right to move the panda.'
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
  if_color: {
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
  }
}


export default function (spec, id) {
  return mapObj(
    (key, params) => createAction(type, (...args) => args),
    spec
  )
}

export function createDocs (traits) {
  return map(
    (val, key) => traits[key] === true
      ? {...val, args: []}
      : {...val, args: (val.args || []).map((arg, i) => ({...arg, ...traits[key][i]}))},
    filter((val, key) => traits[key], capabilities)
  )
}

export {
  capabilities,
  images
}

// const up = (lineNum, steps = 1) => move(0, steps, lineNum)
// const right = (lineNum, steps = 1) => move(0, steps, lineNum)
// const down = (lineNum)

// function move (dir, steps, lineNum) {
//   const state = getState()
//   const animal = state.animals[id]
//   const location = getNewLocation(animal.current.location, dir)

//   if (checkBounds(location, state.levelSize)) {
//     return animalMove(id, location, lineNum)
//   } else {
//     return moveError('Out of bounds', lineNum)
//   }
// }



// function penguin (id) {
//   const up = (lineNum, steps = 1) => move(0, steps, lineNum)
//   const right = (lineNum, steps = 1) => move(1, steps, lineNum)
//   const down = (lineNum, steps = 1) => move(2, steps, lineNum)
//   const left = (lineNum, steps = 1) => move(3, steps, lineNum)
//   const paint = (lineNum, color = 'black') => animalPaint(id, color, lineNum)
//   const repeat = (lineNum, max, fn) => loopFn(max, fn, lineNum)
//   const ifColor = (lineNum, color, fn) => rawIfColor(color, fn, lineNum)

//   function move (dir, steps, lineNum) {
//     return animalMove(id, getNewLocation(dir, steps), lineNum)
//   }

//   return {
//     up,
//     right,
//     down,
//     left,
//     paint,
//     repeat,
//     ifColor
//   }
// }


// function toucan (id, getState = () => {}) {
//   const up = (lineNum, steps = 1) => move(0, steps, lineNum)
//   const right = (lineNum, steps = 1) => move(1, steps, lineNum)
//   const down = (lineNum, steps = 1) => move(2, steps, lineNum)
//   const left = (lineNum, steps = 1) => move(3, steps, lineNum)
//   const paint = (lineNum, color) => animalPaint(id, color, lineNum)

//   function move (dir, steps, lineNum) {
//     return animalMove(id, getNewLocation(dir, steps), lineNum)
//   }

//   return {
//     up,
//     right,
//     down,
//     left,
//     paint
//   }
// }


// function zebra (id) {
//   const up = (lineNum, steps = 1) => move(0, steps, lineNum)
//   const right = (lineNum, steps = 1) => move(1, steps, lineNum)
//   const down = (lineNum, steps = 1) => move(2, steps, lineNum)
//   const left = (lineNum, steps = 1) => move(3, steps, lineNum)
//   const paint = lineNum => animalPaint(id, 'black', lineNum)

//   function move (dir, steps, lineNum) {
//     return animalMove(id, getNewLocation(dir, steps), lineNum)
//   }

//   return {
//     up,
//     right,
//     down,
//     left,
//     paint
//   }
// }

// function panda (id) {
//   const up = (lineNum, steps = 1) => move(0, steps, lineNum)
//   const right = (lineNum, steps = 1) => move(1, steps, lineNum)
//   const down = (lineNum, steps = 1) => move(2, steps, lineNum)
//   const left = (lineNum, steps = 1) => move(3, steps, lineNum)
//   const paint = (lineNum) => animalPaint(id, 'black', lineNum)

//   function move (dir, steps, lineNum) {
//     return animalMove(id, getNewLocation(dir, steps), lineNum)
//   }

//   return {
//     up,
//     right,
//     down,
//     left,
//     paint
//   }
// }

// function crocodile (id) {
//   const move = (lineNum, steps = 1) => moveCrocodile(steps, lineNum)
//   const turnRight = (lineNum) => animalTurn(id, 90, lineNum)
//   const turnLeft = (lineNum) => animalTurn(id, -90, lineNum)
//   const paint = (lineNum, color) => animalPaint(id, color, lineNum)

//   function moveCrocodile (steps, lineNum) {
//     return animalMove(id, getNewLocation(steps), lineNum)
//   }

//   return {
//     move,
//     turnRight,
//     turnLeft,
//     paint
//   }
// }

// function chameleon (id) {
//   const up = (lineNum, steps = 1) => move(0, steps, lineNum)
//   const right = (lineNum, steps = 1) => move(1, steps, lineNum)
//   const down = (lineNum, steps = 1) => move(2, steps, lineNum)
//   const left = (lineNum, steps = 1) => move(3, steps, lineNum)
//   const paint = (lineNum, color) => animalPaint(id, color, lineNum)

//   function move (dir, steps, lineNum) {
//     return animalMove(id, getNewLocation(dir, steps), lineNum)
//   }

//   return {
//     up,
//     right,
//     down,
//     left,
//     paint
//   }
// }
