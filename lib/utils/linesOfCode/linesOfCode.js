import isArray from '@f/is-array'
import Analyse from 'js-analyse'
import filter from '@f/filter'

let lastLoc = 0

export default (code = '') => {
  try {
    if (isArray(code)) {
      return filter(
        ({ type }) =>
          ['block_end', 'comment', 'lineBreak'].indexOf(type) === -1,
        code
      ).length
    }

    const analysis = new Analyse(code)
    lastLoc = analysis.lloc()
    return lastLoc
  } catch (e) {
    return lastLoc
  }
}
