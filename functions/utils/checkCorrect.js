const objEqual = require('@f/equal-obj')
const filter = require('@f/filter')

const filterWhite = (square) => square !== 'white'

module.exports = function (painted, targetPainted) {
  if (targetPainted) {
    if (objEqual(filter(filterWhite, targetPainted), filter(filterWhite, painted))) {
      return true
    }
  }
  return false
}
