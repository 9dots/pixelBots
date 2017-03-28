const Analyse = require('js-analyse')
const isArray = require('@f/is-array')

let lastLoc = 0
const maybeStringify = (seq) => isArray(seq) ? seq.join('\n') : seq

module.exports = function (code = '') {
  try {
    const analysis = new Analyse(maybeStringify(code))
    lastLoc = analysis.lloc()
    return lastLoc
  } catch (e) {
    return lastLoc
  }
}

