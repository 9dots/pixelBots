import autoYield from 'auto-yield'
import sleep from '@f/sleep'
import {
  startRun,
  stopRun,
  setActiveLine
} from './actions'

const wrap = (code, api) => {
  return `
  var {${Object.keys(api).join(', ')}} = api
  function * codeRunner () {
    yield startRun()
    ${code}
    yield stopRun()
  }
  codeRunner()
`
}

function codeRunner (code, api, timeout) {
  let {sequence} = code
  api = {...api, sleep, startRun, stopRun, setActiveLine}
  sequence = sequence.map((line, i) => {
    return `${line}
    setActiveLine(${i})
    sleep(${timeout})`
  }).join('\n')
  return eval(wrap(autoYield(sequence, Object.keys(api)), api))
}

export default codeRunner
