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

export default function (code, api) {
  try {
    return eval(wrap(autoYield(code, api), api))()
  } catch (e) {
    return {error: e}
  }
}
