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
      case 'faceNorth':
        return `${indent}faceNorth()`
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
        return `${indent}forward(${args || 1})`
      case 'paintO':
        return `${indent}paintO("${args || 'black'}")`
      case 'paintI':
        return `${indent}paintI("${args || 'black'}")`
      case 'paintS':
        return `${indent}paintS("${args || 'black'}")`
      case 'paintZ':
        return `${indent}paintZ("${args || 'black'}")`
      case 'paintJ':
        return `${indent}paintJ("${args || 'black'}")`
      case 'paintT':
        return `${indent}paintT("${args || 'black'}")`
      case 'paintL':
        return `${indent}paintL("${args || 'black'}")`
      case 'forward':
        return `${indent}forward(${args || 1})`
      case 'moveTo':
        return `${indent}moveTo(${args})`
      case 'turnRight':
        return `${indent}turnRight()`
      case 'turnLeft':
        return `${indent}turnLeft()`
      case 'repeat':
        return `${tabs(level++)}repeat(${payload[0]}, function * () {`
      case 'block_end':
        return `${tabs(--level)}})`
      case 'ifColor':
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
