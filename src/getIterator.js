import autoYield from 'auto-yield-delegate'

import {
  endRun
} from './actions'

const wrap = (code, api, id) => {
  return `
  var {${Object.keys(api).join(', ')}} = api
  function * codeRunner () {
    try {
      ${code}
      yield endRun({id: ${id}}) 
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

function codeRunner (code, api, id) {
  let {sequence} = code
  if (typeof sequence === 'string') {
    sequence = sequence.split(/[\n]/gi)
  }
  sequence = sequence.map((line, i) => {
    let updatedLine = line
    matchApiString(api, line).forEach((match) => {
      var re = new RegExp('(' + match + '\\s*\\()(.*)\\)', 'gi')
      var results = re.exec(line)
      if (results) {
        updatedLine = updatedLine.replace(re, `$1${i}${results[2] ? ', ' : ''}${results[2]})`)
      }
    })
    return updatedLine
  }).join('\n')
  api = {...api, endRun}
  try {
    return eval(wrap(autoYield(sequence, Object.keys(api)), api, id))
  } catch (e) {
    return {
      error: e
    }
  }
}

export default codeRunner
