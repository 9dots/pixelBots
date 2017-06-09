const Analyse = require('js-analyse')
const isArray = require('@f/is-array')

let lastLoc = 0
const maybeStringify = (seq) => isArray(seq) ? seq.join('\n') : seq

module.exports = function (code = '') {
  try {
    if (isArray(code)) return code.length

    const analysis = new Analyse(code)
    lastLoc = analysis.lloc()
    return lastLoc
  } catch (e) {
    console.error(e)
    return lastLoc
  }
}
