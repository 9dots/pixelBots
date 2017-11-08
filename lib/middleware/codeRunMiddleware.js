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
// import {scrollTo} from './scroll'
import Worker from 'webWorkers/codeRunner.worker.js'
import createAction from '@f/create-action'
import pick from '@f/pick'

const workerProps = [
  'animals',
  'initialPainted',
  'painted',
  'capabilities',
  'palette',
  'active',
  'levelSize',
  'speed'
]

const initCodeWorker = createAction('<codeMw/>: INIT_CODE_WORKER')

const codeRunWorker = {
  worker: undefined,
  sendMessage (msg) {
    this.worker.postMessage(msg)
    return this
  },
  createNewWorker () {
    if (this.worker) {
      this.worker.terminate()
    }
    this.worker = new Worker()
    return this
  }
}

function codeMw ({ getState, dispatch, actions }) {
  return next => action => {
    if (action.type === initCodeWorker.type) {
      codeRunWorker.createNewWorker().sendMessage({
        type: 'play',
        payload: pick(workerProps, action.payload)
      })
      codeRunWorker.worker.addEventListener('message', e =>
        dispatch(actions.handleUpdate(e))
      )
    }
    return next(action)
  }
}

export default codeMw
export { initCodeWorker }
