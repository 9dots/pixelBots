import Schema from '@weo-edu/schema'
import validator from '@weo-edu/validate'

const link = Schema('string')
	.min(5, 'Code must be 5 characters.')
	.max(5, 'Code must be 5 characters.')

const linkForm = Schema()
	.prop('link', link)
	.required(['link'])

export default validator(linkForm)