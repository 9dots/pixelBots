import createAction from '@f/create-action'

const loopAction = createAction('LOOP')

function * loopFn (max, fn) {
	for (let i = 0; i < max; i++) {
		yield * fn()
	}
}

export {
	loopAction,
	loopFn
}