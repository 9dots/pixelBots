// import {createRunners, getInterval} from '../utils/runner'
// import checkCorrect from '../utils/checkCorrect'
// import linesOfCode from 'utils/linesOfCode'
// import createAction from '@f/create-action'
// import {loopAction} from 'animalApis/loop'
// import isIterator from '@f/is-iterator'
// import isEmpty from 'lodash/isEmpty'
// import stackTrace from 'stack-trace'
// import {Block, Text} from 'vdux-ui'
// import firebase from 'firebase'
// import Switch from '@f/switch'
// import {element} from 'vdux'
// import sleep from '@f/sleep'
// // import {scrollTo} from './scroll'


// const completeProject = createAction('<codeRunMiddleware/>: COMPLETE_PROJECT')
// const throwError = createAction('THROW_ERROR')
// const endRun = createAction('<codeRunMiddleware/>: END_RUN')
// const resume = createAction('<codeRunMiddleware/>: RESUME')

// export default ({dispatch, getState, actions, getContext}) => (next) => (action) => {
//   const {openModal} = getContext()
// 	return Switch({
// 		[throwError.type]: throwErrorHandler,
// 		animalPaint: checkCompleted,
// 		default: () => next(action)
// 	})(action.type, action.payload)

// 	function throwErrorHandler (payload) {
// 		const {lineNum, message} = payload
//     const errorLine = typeof lineNum === 'number'
//       ? lineNum
//       : stackTrace.parse(payload)[0].lineNumber - 5
//     dispatch(actions.setRunning(false))
// 		dispatch(actions.setCompleted(true))
//     dispatch(openModal({
//     	type: 'error',
//       body: `${message}. Check the code at line ${errorLine + 1}.`,
//       header: 'Error'
//     }))
//    return next(action)
// 	}

// <<<<<<< HEAD
// 	function checkCompleted () {
// 		const result = next(action)
//     const {painted, targetPainted, animals, frames} = getState()
//     if (checkCorrect(painted, targetPainted)) {
//       const loc = linesOfCode(animals[0].sequence)
//       dispatch(openModal(winMessage(`You wrote ${loc} lines of code to draw this picture!`)))
//       dispatch(actions.onComplete(frames))
//     }
//     return result
// 	}
// }
// =======
// 	function checkCompleted () {
// 		const result = next(action)
//     const {painted, targetPainted, animals, frames, type} = getState()
//     if (checkCorrect(painted, targetPainted) && type !== 'project') {
//       const loc = linesOfCode(animals[0].sequence)
//       dispatch(openModal(winMessage(`You wrote ${loc} lines of code to draw this picture!`)))
//       dispatch(actions.onComplete(frames))
//     }
//     return result
// 	}
// }
// >>>>>>> 3917e3cff91ccf371c72ad7cd614b342ed347c40

// function winMessage (msg) {
//   const body = <Block>
//     <Text>{msg}</Text>
//   </Block>

//   return {
//     header: 'Congratulations',
//     type: 'win',
//     body
//   }
// }

// export {
// 	completeProject,
// 	throwError,
// 	resume,
// 	endRun
// }
