import animalApis from './animalApis'
import {setActiveLine} from './actions'
import {scrollTo} from './middleware/scroll'
import EventEmitter from 'events'

class Runner extends EventEmitter {
  constructor (it, dispatch, getState) {
    super()
    this.it = it
    this.dispatch = dispatch
    this.running = false
    this.done = false
    this.timeout = ''
    this.stepsCompleted = 0
    this.getState = getState
    this.stepQueue = 0
  }
  stepForward () {
  	var self = this
    this.stepQueue++
    if (this.stepQueue === 1) {
    	run()
    }
    function run () {
      const curState = self.getState()
      const result = self.it.next()
      const interval = getTimeout(curState.game.animals, result.value.payload.id) * 1 / curState.speed
      self.step(result.value, interval)
	      .then(() => {
		      self.stepQueue--
	        if (self.stepQueue > 0) {
	         run()
	        }
	      })
	     	.catch(() => {})
    }
  }
  step (step, interval) {
    return new Promise((resolve, reject) => {
      step = step || this.it.next().value
      if (step.type === 'END_RUN') {
      	return reject('run over')
      }
      this.stepsCompleted += 1
      this.emit('step', this.stepsCompleted)
      if (step.meta) {
        const lineNum = step.meta.lineNum
        if (this.getState().game.inputType === 'icons') {
          this.dispatch(scrollTo('.code-editor', `#code-icon-${lineNum}`))
        }
        this.dispatch(setActiveLine(lineNum))
      }
      this.dispatch(step)
      setTimeout(() => resolve(), interval)
    })
  }
  run () {
    if (!this.done) {
      const result = this.it.next()
      const self = this
      const curState = this.getState()
      const interval = getTimeout(curState.game.animals, result.value.payload.id) * 1 / curState.speed
       if (result.done) {
        this.done = true
        this.running = false
      }
      this.step(result.value, interval)
        .then(() => this.running && this.run())
        .catch((e) => this.done = true)
    }
  }
  stop () {
  	this.done = true
    this.running = false
    this.stepQueue = 0
  }
  pause () {
    this.running = false
  }
  startRun () {
    this.running = true
    this.run()
  }
}

const getTimeout = (animals, id) => {
  return id
    ? animalApis[animals[id].type].speed + 50
    : undefined
}

export default Runner
