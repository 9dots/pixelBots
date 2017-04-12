// import _eval from 'eval'

function wrap (code, api) {
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
  module.exports = codeRunner
`
}

export default function (code, api) {
  try {
    return eval(wrap(code, api))()
  } catch (e) {
    return {
      error: e
    }
  }
}