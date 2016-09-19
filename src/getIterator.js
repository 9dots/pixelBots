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

var addedLines

function matchApiString (api, line) {
  let apiStrings = Object.keys(api)
  for (var i in apiStrings) {
    if (line.search(apiStrings[i]) > -1) {
      return true
    }
  }
  return false
}

function codeRunner (code, api, timeout) {
  addedLines = 0

  let {sequence} = code
  if (typeof sequence === 'string') {
    sequence = sequence.split('\n')
  }
  sequence = sequence.map((line, i) => {
    if (matchApiString(api, line)) {
      addedLines += 3
      return `setActiveLine(${i})
      scrollTo('.code-editor', '#code-icon-${i}')
      ${line}
      sleep(${api.speed})`
    } else {
      return line
    }
  }).join('\n')
  api = {...api, sleep, startRun, stopRun, setActiveLine, scrollTo}
  try {
    return eval(wrap(autoYield(sequence, Object.keys(api)), api))
  } catch (e) {
    return {
      error: e,
      addedLines
    }
  }
}

export default codeRunner
