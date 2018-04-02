import Worker from 'webWorkers/codeRunner.worker.js'
import createAction from '@f/create-action'
import range from '@f/range'
import pick from '@f/pick'

const workerProps = [
  'initialPainted',
  'capabilities',
  'levelSize',
  'animals',
  'painted',
  'palette',
  'active',
  'steps',
  'speed'
]

const terminateCodeWorker = createAction('<codeMw/>: TERMINATE_CODE_WORKER')
const initCodeWorker = createAction('<codeMw/>: INIT_CODE_WORKER')
const startCodeRun = createAction('<codeMw/>: START_CODE_RUN')
const pauseCodeRun = createAction('<codeMw/>: PAUSE_CODE_RUN')
const adjustSpeed = createAction('<codeMw/>: ADJUST_SPEED')
const stepCode = createAction('<codeMw/>: STEP_CODE')

const codeRunWorker = {
  worker: undefined,
  workerPool: range(3).map(() => new Worker()),
  sendMessage (msg) {
    this.worker.postMessage(msg)
    return this
  },
  createNewWorker (handler) {
    this.worker = this.workerPool[this.workerPool.length - 1]
    this.workerPool = [new Worker(), ...this.workerPool].slice(0, -1)
    this.worker.addEventListener('message', handler)
    return this
  },
  terminateWorker () {
    if (this.worker) {
      this.worker.terminate()
    }
    return this
  }
}

function codeMw ({ getState, dispatch, actions }) {
  return next => action => {
    switch (action.type) {
      case initCodeWorker.type:
        codeRunWorker
          .terminateWorker()
          .createNewWorker(e => dispatch(action.payload.updateAction(e)))
          .sendMessage({
            type: 'init',
            payload: pick(workerProps, action.payload.state)
          })
        break
      case startCodeRun.type:
        codeRunWorker.sendMessage({ type: 'play' })
        break
      case terminateCodeWorker.type:
        codeRunWorker.terminateWorker()
        break
      case adjustSpeed.type:
        if (codeRunWorker.worker) {
          codeRunWorker.sendMessage({
            type: 'updateSpeed',
            payload: action.payload
          })
        }
        break
      case pauseCodeRun.type:
        codeRunWorker.sendMessage({
          type: 'pause'
        })
        break
      case stepCode.type:
        codeRunWorker.sendMessage({
          type: 'step',
          payload: action.payload || null
        })
        break
    }
    return next(action)
  }
}

export default codeMw
export {
  terminateCodeWorker,
  initCodeWorker,
  startCodeRun,
  pauseCodeRun,
  adjustSpeed,
  stepCode
}
