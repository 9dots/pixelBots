import autoYield from 'auto-yield-delegate'

import {
  endRun
} from '../middleware/codeRunMiddleware'

function wrap (code, api, id) {
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

function codeRunner (code, api, id) {
  const {sequence} = code
  const fullApi = {...api, endRun}
  try {
    return eval(wrap(autoYield(sequence, Object.keys(fullApi)), fullApi, id))
  } catch (e) {
    return {
      error: e
    }
  }
}

export default codeRunner
