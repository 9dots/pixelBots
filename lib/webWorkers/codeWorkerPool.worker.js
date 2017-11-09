// import CodeWorker from 'webWorkers/codeRunner.worker.js'
import range from '@f/range'

// console.log(CodeWorker)

const codeRunWorker = () => ({
  // worker: new CodeWorker(),
  sendMessage (msg) {
    this.worker.postMessage(msg)
    return this
  },
  terminateWorker () {
    this.worker.terminate()
    return this
  }
})

const workerPool = {
  activeWorker: null,
  availableWorkers: range(5).map(codeRunWorker),
  getNextWorker () {
    this.activeWorker = this.availableWorkers[0]
    this.availableWorkers = [...this.availableWorkers.slice(1), codeRunWorker()]
    // this.activeWorkers.push(worker)
    return this
  },
  terminateWorker (idx) {
    this.activeWorkers[idx].terminateWorker()
    this.workers = this.workers.filter((val, i) => i !== idx)
    return this
  },
  sendMessage (msg) {
    this.activeWorker.sendMessage(msg)
    return this
  }
}

console.log(workerPool)

self.addEventListener('message', ({ data: { type, payload } }) => {
  if (type === 'setCode') {
    workerPool.getNextWorker().sendMessage({ type: 'init', payload })
  } else if (type === 'play') {
    workerPool.sendMessage(type)
  }

  // createNewWorker (handler) {
  //   this.worker = this.workerPool[this.workerPool.length - 1]
  //   this.workerPool = [new Worker(), ...this.workerPool].slice(0, -1)
  //   this.worker.addEventListener('message', handler)
  //   return this
  // },
  // terminateWorker () {
  //   if (this.worker) {
  //     this.worker.terminate()
  //   }
  //   return this
  // }
})
