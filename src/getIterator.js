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
    try {
      ${code}
    } catch (e) {
      yield {
        type: 'THROW_ERROR',
        payload: e
      }
    }
  }
  codeRunner()
`
}

function matchApiString (api, line) {
  let apiStrings = Object.keys(api)
  return apiStrings.filter(function (term) {
    if (line.search(term) > -1) {
      return term
    }
  })
}

function codeRunner (code, api, timeout) {
  let {sequence} = code
  if (typeof sequence === 'string') {
    sequence = sequence.split(/[\n]/gi)
  }
  sequence = sequence.map((line, i) => {
    let updatedLine = line
    matchApiString(api, line).forEach((match) => {
      var re = new RegExp('(' + match + '\\()(.*)\\)', 'gi')
      var results = re.exec(line)
      if (results) {
        updatedLine = updatedLine.replace(re, `$1${i}${results[2] ? ', ' : ''}${results[2]})`)
      }
    })
    return updatedLine
  }).join('\n')
  api = {...api, sleep, startRun, stopRun, setActiveLine, scrollTo}
  try {
    return eval(wrap(autoYield(sequence, Object.keys(api)), api))
  } catch (e) {
    return {
      error: e
    }
  }
}

export default codeRunner
