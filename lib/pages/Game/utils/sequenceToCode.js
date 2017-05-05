import mapValues from '@f/map-values'

function sequenceToCode (sequence) {
  return Array.isArray(sequence)
    ? blocksToCode(sequence)
    : sequence
}

function blocksToCode (blocks, indent = 0) {
  let level = 0

  return blocks.map(({type, payload}) => {
    const args = typeof payload === 'object'
      ? mapValues((v) => v, payload).join(', ')
      : payload
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
      case 'move':
        return `${indent}move(${args || 1})`
      case 'turnRight':
        return `${indent}turnRight()`
      case 'turnLeft':
        return `${indent}turnLeft()`
      case 'repeat':
        return `${tabs(level++)}repeat(${payload[0]}, function * () {`
      case 'block_end':
        return `${tabs(--level)}})`
      case 'if_color':
        return `${tabs(level++)}ifColor('${payload[0]}', function * () {`
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


export default sequenceToCode
