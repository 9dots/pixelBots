import Schema from '@weo-edu/schema'
import validator from '@weo-edu/validate'

const inputType = Schema('string')
  .max(100)
  .pattern(/code|icons/)

const description = Schema('string')
  .max(600)

const size = Schema('number')
  .min(1)
  .max(20)

const title = Schema('string')
  .min(3)

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

// const animals = Schema('array')
//   .items({type: animal})

const game = Schema()
  .prop('title', title)
  .prop('description', description)
  .prop('inputType', inputType)
  .prop('levelSize', size)
  .prop('animal', animal)
  .required(['inputType', 'levelSize', 'animal', 'title'])

export default {
  animal: validator(animal),
  levelSize: validator(size),
  game: validator(game),
  title: validator(Schema().prop('title', title)),
  description: validator(description)
}
