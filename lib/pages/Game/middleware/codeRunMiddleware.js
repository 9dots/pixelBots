import checkCorrect from '../utils/checkCorrect'
import {createRunners} from '../utils/runner'
import linesOfCode from 'utils/linesOfCode'
import createAction from '@f/create-action'
import isEmpty from 'lodash/isEmpty'
import stackTrace from 'stack-trace'
import {Block, Text} from 'vdux-ui'
import firebase from 'firebase'
import Switch from '@f/switch'
import sleep from '@f/sleep'
import {element} from 'vdux'
// import {scrollTo} from './scroll'


const completeProject = createAction('<codeRunMiddleware/>: COMPLETE_PROJECT')
const executeLine = createAction('<codeRunMiddleware/>: EXECUTE_LINE')
const stepForward = createAction('<codeRunMiddleware/>: STEP_FORWARD')
const throwError = createAction('<codeRunMiddleware/>: THROW_ERROR')
const abortRun = createAction('<codeRunMiddleware/>: ABORT_RUN')
const pauseRun = createAction('<codeRunMiddleware/>: PAUSE_RUN')
const runCode = createAction('<codeRunMiddleware/>: RUN_CODE')
const endRun = createAction('<codeRunMiddleware/>: END_RUN')
const resume = createAction('<codeRunMiddleware/>: RESUME')

export default ({dispatch, getState, actions, getContext}) => (next) => (action) => {
  const {openModal} = getContext()
	return Switch({
		'animalPaint': checkCompleted,
		[stepForward.type]: handleStepForward,
		[throwError.type]: throwErrorHandler,
		[runCode.type]: handleRunCode,
		default: () => next(action)
	})(action.type, action.payload)

	function throwErrorHandler (payload) {
		const {lineNum, message} = payload
		const {runners} = getState()
    const errorLine = typeof (lineNum) === 'number'
      ? lineNum
      : stackTrace.parse(payload)[0].lineNumber - 5
    if (runners && runners.length > 0) {
    	runners.forEach((runner) => runner.pause())
    }
    dispatch(actions.toggleRunning(false))
		dispatch(actions.setCompleted(true))
    dispatch(openModal({
    	type: 'error',
      body: `${message}. Check the code at line ${errorLine + 1}.`,
      header: 'Error'
    }))
    return next(action)
	}

	function checkCompleted () {
		const result = next(action)
    const {painted, targetPainted, animals} = getState()
    if (checkCorrect(painted, targetPainted)) {
      const loc = linesOfCode(animals[0].sequence)
      dispatch(openModal(winMessage(`You wrote ${loc} lines of code to draw this picture!`)))
    }
    return result
	}

	function getRunners () {
		return new Promise((resolve, reject) => {
			const {animals} = getState()
	    createRunners(
	    	animals,
	    	getSpeed,
	    	onValue,
	    	(e) => dispatch(actions.throwError(e)),
	    	() => dispatch(actions.onComplete(action.payload))
	    )
	      .then(resolve)
	      .catch(reject)
		})
	}

	function handleRunCode () {
		const {running, hasRun, completed, runners} = getState()
		if (running) {
			dispatch(actions.toggleRunning(false))
			runners.forEach((runner) => runner.pause())
		} else if (completed || !hasRun) {
			dispatch(actions.setHasRun(false))
			dispatch(actions.reset())
			getRunners()
				.then((runners) => {
					dispatch(actions.setRunners(runners))
					dispatch(actions.toggleRunning(true))
					return runners
				})
				.then((runners) => runners.forEach((runner) => runner.run()))
				.catch(({message, lineNum}) => dispatch(throwError({message, lineNum})))
		} else if (!running && hasRun) {
			dispatch(actions.toggleRunning(true))
			runners.forEach((runner) => runner.run())
		}
		return next(action)
	}

	function handleStepForward () {
		const {runners} = getState()
		if (runners && !isEmpty(runners)) {
			runners.forEach((runner, i) => runner.step(i))
		} else {
			getRunners()
				.then((runners) => {
					dispatch(actions.setRunners(runners))
					return runners
				})
				.then((runners) => runners.forEach((runner, i) => runner.step(i)))
				.catch(({message, lineNum}) => dispatch(throwError({message, lineNum})))
		}
		return next(action)
	}

  function onValue (action) {
		const lineNum = action.payload.lineNum
    if (!isNaN(lineNum) && lineNum >= 0) {
      // if (getState().game.inputType === 'icons') {
      //   dispatch(scrollTo('.code-editor', `#code-icon-${lineNum}`))
    // }
      dispatch(actions.setActiveLine(lineNum))
    }
    dispatch(actions.incrementSteps())
    return dispatch(action)
  }

  function onComplete (payload) {
    const {painted = {}} = getState()

    // if (typeof (payload) === 'function') {
    //   yield payload()
    // }
    // if (saveID && Object.keys(painted).length > 0) {
    //   yield fbTask('update_saved_image', {
    //     painted: painted,
    //     levelSize: game.levelSize[0],
    //     url: saveID
    //   })
    // }
  }

	function getSpeed () {
		return getState().speed
	}
}

function winMessage (msg) {
  const body = <Block>
    <Text>{msg}</Text>
  </Block>

  return {
    header: 'Congratulations',
    type: 'win',
    body
  }
}

export {
	completeProject,
	executeLine,
	stepForward,
	throwError,
	pauseRun,
	abortRun,
	runCode,
	resume,
	endRun
}


