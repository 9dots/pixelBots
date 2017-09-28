import Schema from '@weo-edu/schema'
import validator from '@weo-edu/validate'

const userFn = Schema('string')
	.min(1, 'Function name is required.')
	.max(15, 'Function must be less than 15 characters.')

const userFnForm = Schema()
	.prop('userFn', userFn)
	.required(['userFn'])

export default validator(userFnForm)