import isArray from '@f/is-array'
import Analyse from 'js-analyse'

const maybeStringify = (seq) => isArray(seq) ? seq.join('\n') : seq
let lastLoc = 0

export default (code = '') => {
  try {
    const analysis = new Analyse(maybeStringify(code))
    lastLoc = analysis.lloc()
    return lastLoc
  } catch (e) {
    return lastLoc
  }
}