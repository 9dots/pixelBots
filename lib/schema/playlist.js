import Schema from '@weo-edu/schema'
import validator from '@weo-edu/validate'

const name = Schema('string')
  .min(3, 'Name must be longer than 3 characters')
  .max(20, 'Name must be shorter than 20 characters')

const description = Schema('string')
  .max(100, 'Descriptions must be under 100 characters.')
  .min(1, 'Must add a description.')

const playlist = Schema()
  .prop('name', name)
  .prop('description', description)
  .required(['name', 'description'])

export default {
  playlist: validator(playlist),
  name: validator(name),
  description: validator(description)
}
