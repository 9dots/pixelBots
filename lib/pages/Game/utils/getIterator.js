/**
 * Imports
 */

const sequenceToCode = require('pages/Game/utils/sequenceToCode').default
const autoYield = require('auto-yield-delegate')
const nodeEval = require('node-eval')

function wrap (code, api) {
  return `
  var {${Object.keys(api).join(', ')}} = api
  function * codeRunner () {
    try {
      ${code}
    } catch (e) {
      yield {
        type: 'throwError',
        payload: e
      }
    }
  }
  module.exports = codeRunner
`
}

export default function getIterator (code, api) {
  const newCode = sequenceToCode(code)
  const autoYielded = autoYield(newCode, api)
  const wrapped = wrap(autoYielded, api)

  const evaled = eval(wrapped)

  return () => {
    try {
      return evaled()
    } catch (err) {
      return {error: err}
    }
  }
}
