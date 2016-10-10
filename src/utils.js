import gPalette from 'google-material-color-palette-json'
import reduce from '@f/reduce'
import _ from 'lodash'

const icons = {
  up: 'arrow_upward',
  down: 'arrow_downward',
  left: 'arrow_back',
  right: 'arrow_forward',
  paint: 'brush'
}

const directions = {
  forward: 'N',
  back: 'S',
  right: 'E',
  left: 'W'
}

const palette = _.drop(reduce(
  (arr, value, key) => [...arr, {
    name: key,
    value: value['shade_500'] || value
  }],
  [],
  gPalette
))

function nameToIcon (name) {
  return icons[name]
}

function nameToDirection (name) {
  return directions[name]
}

function isLocal (url) {
  return !/^(?:[a-z]+\:)?\/\//i.test(url)
}

function range (low, hi) {
  function rangeRec (low, hi, vals) {
    if (low > hi) {
      return vals
    }
    vals.push(low)
    return rangeRec(low + 1, hi, vals)
  }
  return rangeRec(low, hi, [])
}

export {
  nameToIcon,
  nameToDirection,
  range,
  palette,
  isLocal
}
