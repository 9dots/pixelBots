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
  console.log('newcode', newCode)
  const autoYielded = autoYield(newCode, api)
  console.log('autoyielded', autoYielded)
  const wrapped = wrap(autoYielded, api)
  console.log('wrapped', wrapped)

  const evaled = nodeEval(wrapped, 'file.js', {api})

  console.log('evaled', evaled)

  return () => {
    try {
      return evaled()
    } catch (err) {
      return {error: err}
    }
  }
}
