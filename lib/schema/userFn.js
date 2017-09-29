import Schema from '@weo-edu/schema'
import validator from '@weo-edu/validate'

const userFn = Schema('string')
	.min(1, 'Name is required.')
	.max(15, 'Must be less than 15 characters.')
	.pattern(/^\S*$/, 'Cannot conatin spaces')
	.pattern(/^[a-zA-Z]\w*/, 'Must start with a letter')

const userFnForm = Schema()
	.prop('userFn', userFn)
	.required(['userFn'])

export default validator(userFnForm)