import autoYield from 'auto-yield-delegate'

import {
  endRun
} from '../middleware/codeRunMiddleware'

function wrap (code, api, id) {
  return `
  var {${Object.keys(api).join(', ')}} = api
  function * codeRunner () {
    try {
      ${code}
    } catch (e) {
      yield {
        type: 'THROW_ERROR',
        payload: e
      }
    }
  }
  codeRunner()
`
}

function codeRunner (animal, api, id) {
  const {sequence} = animal
  const fullApi = {...api, endRun}
  const code = sequenceToCode(sequence)

  try {
    return eval(wrap(autoYield(code, Object.keys(fullApi)), fullApi, id))
  } catch (e) {
    return {
      error: e
    }
  }
}

function sequenceToCode (sequence) {
  return Array.isArray(sequence)
    ? blocksToCode(sequence)
    : sequence
}

function blocksToCode (blocks, indent = 0) {
  let level = 0

  return blocks.map(({type, payload}) => {
    const args = Array.isArray(payload) ? payload.join(', ') : payload
    const indent = tabs(level)

    switch (type) {
      case 'up':
        return `${indent}up(${args || 1})`
      case 'left':
        return `${indent}left(${args || 1})`
      case 'right':
        return `${indent}right(${args || 1})`
      case 'down':
        return `${indent}down(${args || 1})`
      case 'paint':
         return `${indent}paint("${args || 'black'}")`
      case 'comment':
        return `${indent}// ${args}`
      case 'repeat':
        return `${tabs(level++)}repeat(${payload[0]}, function * () {`
      case 'repeat_end':
        return `${tabs(--level)}})`
      default:
        throw new Error(`blocksToCode: encountered unknown block type (${type})`)
    }
  }).join('\n')
}

function tabs (n) {
  let str = ''

  while (n--)
    str += '\t'

  return str
}


export default codeRunner
