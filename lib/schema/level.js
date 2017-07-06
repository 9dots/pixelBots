import Schema from '@weo-edu/schema'
import validator from '@weo-edu/validate'

const inputType = Schema('string')
  .max(100)
  .pattern(/code|icons/)

const description = Schema('string')
  .max(500, 'Descriptions must be under 500 characters.')
  .min(1, 'Must have a description.')

const size = Schema('array')
  .min(2)
  .max(2)
  .items({type: 'number'})

const title = Schema('string')
  .min(3, 'Must be longer than 3 characters')

const animalType = Schema('string')

const location = Schema('array')
  .items({type: 'number'})

const direction = Schema('number')

const rotation = Schema('number')

const position = Schema()
  .prop('dir', direction)
  .prop('rot', rotation)
  .prop('location', location)

const animal = Schema()
  .prop('current', position)
  .prop('initial', position)
  .prop('type', animalType)
  .required(['current', 'initial', 'type'])

const stretchValue = Schema('string')
  .min(1, 'Need a stretch goal.')
  .pattern(/[0-9]+/, 'Stretch goal should be a number.')

const stretch = Schema()
  .prop('value', stretchValue)
  .required(['value'], 'Stretch goal must have a value.')

const animals = Schema('array')
  .items({type: 'animal'})

const numCapabilities = Schema('number')
  .min(3, 'Please select at least one movement type.')

const numTargetPainted = Schema('number')
  .min(1, 'Must paint the target grid.')

const game = Schema()
  .prop('title', title)
  .prop('description', description)
  .prop('inputType', inputType)
  .prop('levelSize', size)
  .prop('capabilitiesCount', numCapabilities)
  .prop('stretch', stretch)
  .required(['inputType', 'description', 'levelSize', 'title', 'capabilitiesCount'])

const painted = Schema()
  .prop('targetPaintedCount', numTargetPainted)
  .required(['targetPaintedCount'], 'Must paint the target grid.')

const initialPainted = Schema()
  .prop('initialPainted', Schema('string').min(1, 'Must add code for teacher bot.'))
  .required(['initialPainted'], 'Must add code for teacher bot.')

const solution = Schema()
  .prop('solution', Schema('string').min(1, 'Must add code for solution.'))
  .required(['solution'], 'Must add code for solution.')

const read = Schema()
  .prop('startCode', Schema('string').min(1, 'Must add start code.'))
  .required(['startCode'], 'Must add start code.')

export default {
  stretch: validator(Schema().prop('stretch', stretch).required(['stretch'], 'Need a stretch goal.')),
  animal: validator(animal),
  levelSize: validator(size),
  create: validator(game),
  title: validator(Schema().prop('title', title)),
  description: validator(description),
  initialPainted: validator(initialPainted),
  read: validator(read),
  solution: validator(solution),
  painted: validator(painted)
}
