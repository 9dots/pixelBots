import Schema from '@weo-edu/schema'
import validator from '@weo-edu/validate'

const userFnLetters = Schema('string')
  .min(1, 'Name is required.')
  .max(15, 'Must be less than 15 characters.')
  .pattern(/^[a-zA-Z][a-zA-Z0-9]*/, 'Must start with a letter')

const userFnSpaces = Schema('string')
  .min(1, 'Name is required.')
  .max(15, 'Must be less than 15 characters.')
  .pattern(/^\S*$/, 'No spaces allowed.')

const typeCheckScheme = Schema()
  .prop('type', Schema('string').min(1))
  .required(['type'])

const userFnLettersCheck = Schema()
  .prop('userFn', userFnLetters)
  .required(['userFn'])

const userFnSpacesCheck = Schema()
  .prop('userFn', userFnSpaces)
  .required(['userFn'])

const lettersCheck = validator(userFnLettersCheck)
const spacesCheck = validator(userFnSpacesCheck)
const typeCheck = validator(typeCheckScheme)

export { lettersCheck, spacesCheck, typeCheck }
