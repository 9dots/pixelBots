import isArray from '@f/is-array'
import Analyse from 'js-analyse'

let lastLoc = 0

export default (code = '') => {
  try {
    if (isArray(code)) return code.length

    const analysis = new Analyse(code)
    lastLoc = analysis.lloc()
    return lastLoc
  } catch (e) {
    return lastLoc
  }
}
