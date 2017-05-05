/**
 * Imports
 */

const sequenceToCode = require('pages/Game/utils/sequenceToCode').default
const autoYield = require('auto-yield-delegate')

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
  const wrapped = eval(wrap(autoYield(sequenceToCode(code), api), api))

  return () => {
    try {
      return wrapped()
    } catch (err) {
      return {error: err}
    }
  }
}
