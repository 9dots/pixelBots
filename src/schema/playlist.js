import Schema from '@weo-edu/schema'
import validator from '@weo-edu/validate'

const name = Schema('string')
	.min(3)
	.max(20)

const description = Schema('string')
	.max(100)

const playlist = Schema()
	.prop('name', name)
	.prop('description', description)
	.required(['name', 'description'])

export default {
	playlist: validator(playlist)
}
