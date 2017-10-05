import Schema from '@weo-edu/schema'
import validator from '@weo-edu/validate'

const userFnLetters = Schema('string')
  .min(1, 'Name is required.')
  .max(15, 'Must be less than 15 characters.')
  .pattern(/^[a-zA-Z][a-zA-Z0-9]*/, 'Must start with a letter')

const userFnSpaces = Schema('string')
  .min(1, 'Name is required.')
  .max(15, 'Must be less than 15 characters.')
  .pattern(/^\S*$/, 'Cannot conatin spaces')

const userFnLettersCheck = Schema()
  .prop('userFn', userFnLetters)
  .required(['userFn'])

const userFnSpacesCheck = Schema()
  .prop('userFn', userFnSpaces)
  .required(['userFn'])

const lettersCheck = validator(userFnLettersCheck)
const spacesCheck = validator(userFnSpacesCheck)

export { lettersCheck, spacesCheck }
