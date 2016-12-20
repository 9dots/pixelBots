import Schema from '@weo-edu/schema'
import validator from '@weo-edu/validate'

const link = Schema('string')
	.min(5)
	.max(5)

const linkForm = Schema()
	.prop('link', link)
	.required(['link'])

export default validator(linkForm)