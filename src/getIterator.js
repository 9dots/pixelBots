import autoYield from 'auto-yield'
import sleep from '@f/sleep'
import {scrollTo} from './middleware/scroll'

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
  api = {...api, sleep, startRun, stopRun, setActiveLine, scrollTo}
  sequence = sequence.map((line, i) => {
    return `${line}
    setActiveLine(${i})
    scrollTo('.code-editor', '#code-icon-${i}')
    sleep(${timeout})`
  }).join('\n')
  return eval(wrap(autoYield(sequence, Object.keys(api)), api))
}

export default codeRunner
