import objEqual from '@f/equal-obj'
import filter from '@f/filter'

const filterWhite = (square) => square !== 'white'

export default (painted, targetPainted) => {
  if (targetPainted) {
    if (objEqual(filter(filterWhite, targetPainted), filter(filterWhite, painted))) {
      return true
    }
  }
  return false
}