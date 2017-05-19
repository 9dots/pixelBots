/**
 * Imports
 */

const sequenceToCode = require('./sequenceToCode').default
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

module.exports = function (code, api) {
  const newCode = sequenceToCode(code)
  const autoYielded = autoYield(newCode, api)
  const wrapped = wrap(autoYielded, api)
  const evaled = nodeEval(wrapped, 'file.js', {api})

  return () => {
    try {
      return evaled()
    } catch (err) {
      return {error: err}
    }
  }
}
